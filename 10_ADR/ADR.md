# SALESTORM — Stage 10: Architecture Decision Records (ADRs)

## ADR-001: Hybrid Concurrency Control (Redis Lua + PostgreSQL Atomic Stored Procedure)

### Status
**Accepted**

### Context
During flash sales, 10,000 customers concurrently request to purchase 100 units of Product X. Direct optimistic concurrency control (OCC) on a single database row under 10,000 concurrent updates causes 99% database transaction retries and connection pool exhaustion. Conversely, pure DB row locking (`SELECT FOR UPDATE`) locks database connections for every arriving user.

### Decision
We select a **Hybrid Concurrency Control Architecture**:
1. **Redis Cluster (In-Memory Guard)**: Executes an atomic Lua script for instant stock deduction in RAM ($<2\text{ms}$). This absorbs $9,900$ out-of-stock requests instantly without hitting the database.
2. **PostgreSQL Stored Procedure (`reserve_inventory_atomic`)**: For the 100 successful pre-reservations, an atomic stored procedure executes row-level locking (`FOR UPDATE`) to write the persistent reservation record.

### Consequences
- **Positive**: DB workload is reduced by 99%. P99 latency drops from 450ms to 18ms. Zero chance of overselling.
- **Negative**: Requires maintaining stock synchronization between Redis cache and PostgreSQL DB.

---

## ADR-002: Supabase PostgreSQL over NoSQL Document Stores (MongoDB)

### Status
**Accepted**

### Context
Flash sales require absolute ACID transaction safety, multi-table integrity (Inventory, Reservations, Payments, Orders), and row-level constraints (`CHECK available_quantity >= 0`).

### Decision
We select **Supabase PostgreSQL** over MongoDB/DynamoDB. PostgreSQL provides strict ACID transactions, row-level locks, foreign key constraints, and custom stored procedures (`PL/pgSQL`) that guarantee inventory constraints at the engine level.

### Consequences
- **Positive**: Strict data correctness guarantee. Schema enforcement prevents dirty reads/writes.
- **Negative**: Horizontal scaling requires partition sharding compared to turn-key DynamoDB auto-scaling.

---

## ADR-003: Asynchronous Saga Architecture for Order Fulfilment

### Status
**Accepted**

### Context
Synchronous HTTP calls from Payment Service $\rightarrow$ Order Service create tight coupling. If Order Service crashes (e.g. 30-second outage), payment transactions fail or orphan users.

### Decision
Decouple payment authorization from order creation using **Apache Kafka Event Streaming**. Payment Service emits `payment.succeeded` event to Kafka broker. Order Service consumes event asynchronously. If Order Service is down for 30s, events accumulate safely in Kafka topic partition.

### Consequences
- **Positive**: System remains resilient during 30s downstream service outages.
- **Negative**: Introduces eventual consistency (orders confirmed within 1-2 seconds after payment).

---

## ADR-004: Mandated `X-Idempotency-Key` Header for Financial Transactions

### Status
**Accepted**

### Context
Network retries, double-clicking "Pay Now", and client disconnects cause duplicate HTTP POST requests (2% expected duplicate rate).

### Decision
Enforce a mandatory `X-Idempotency-Key` HTTP header (UUID v4) on all reservation and payment endpoints. Store keys in PostgreSQL with unique indexes. Duplicate requests intercept at middleware layer and return identical cached HTTP responses without re-executing business logic.

### Consequences
- **Positive**: Prevents duplicate credit card charges and double inventory allocations.
- **Negative**: Requires clients to generate unique keys per user intention.
