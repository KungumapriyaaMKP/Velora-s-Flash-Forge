# SALESTORM — High-Scale E-Commerce Flash Sale System Design & Application

> **SYSTEM DESIGN HACKATHON | SYSCRAFTERS 2026**
> **Company Use Case**: SALESTORM Flash Sale Platform
> **Challenge**: 10,000 Concurrent Purchase Requests for 100 Available Units. Zero Overselling. 100% Reliable Transactions.

---

## ⚡ Executive Summary

**SALESTORM** is an enterprise-grade system architecture and full-stack interactive prototype built to handle extreme traffic spikes, limited-inventory contention, idempotent payment processing, and resilient order fulfillment workflows.

- **Primary Database**: Supabase PostgreSQL (`dqzqbplwdmlfybqtgoqu.supabase.co`) with Row Level Security, Indexes, and Atomic Stored Procedures (`reserve_inventory_atomic`).
- **Core Architecture**: Clean Domain-Driven Design (DDD) with SOLID Principles, Strategy, State, Factory, Observer, Adapter, Repository, and Circuit Breaker patterns.
- **Concurrency Protection**: Hybrid Redis Lua Pre-locking + PostgreSQL Atomic Transaction Locks (`SELECT FOR UPDATE`).

---

## 📁 Repository & Submission Folder Structure

The repository adheres strictly to the required hackathon deliverables structure (Section 15, Page 18):

```
SALESTORM/
├── 01_Requirements/               # Business context, NFRs, assumptions, guarantees
│   └── REQUIREMENTS.md
├── 02_HLD/                        # System Context, Container, Component, Deployment diagrams
│   └── HLD.md
├── 03_LLD/                        # Class, Sequence (Purchase/Payment/Order), State diagrams
│   └── LLD.md
├── 04_Database/                   # ER Diagram, Indexing strategy, SQL DDL schema & RPCs
│   ├── DATABASE.md
│   └── schema.sql
├── 05_API/                        # REST endpoints, Idempotency spec, Kafka event schemas
│   └── API.md
├── 06_SOLID/                      # SRP, OCP, LSP, ISP, DIP code mappings
│   └── SOLID.md
├── 07_Design_Patterns/            # Strategy, Factory, State, Observer, Adapter, Circuit Breaker
│   └── PATTERNS.md
├── 08_Scalability_Reliability/    # Concurrency control, SAGAs, Retry, DLQ, Stress Scenario defense
│   └── SCALABILITY_RELIABILITY.md
├── 09_Security_Observability/     # JWT Auth, WAF, Token Bucket, Structured Logging, Metrics, Tracing
│   └── SECURITY_OBSERVABILITY.md
├── 10_ADR/                        # Architecture Decision Records (ADR-001 to ADR-004)
│   └── ADR.md
├── 11_AI_Assisted_Validation/     # 10,000 Request Concurrency Simulation Report & Proofs
│   └── SIMULATION.md
├── 12_Presentation/               # 5-Minute Pitch Deck Outline & Jury Defense Q&A
│   └── PITCH.md
├── src/                           # Full-Stack Application Codebase (Next.js 14 + Tailwind + Supabase)
├── package.json
└── README.md
```

---

## 🚀 Key Architectural Highlights

### 1. Concurrency & Oversell Prevention
- **Redis Lua Script Pre-Check**: Absorbs $9,900$ out-of-stock requests in RAM in $<2\text{ms}$.
- **Supabase Atomic RPC**: Executes `reserve_inventory_atomic` stored procedure inside a PostgreSQL transaction block, preventing race conditions and guaranteeing `available_quantity >= 0`.

### 2. Payment & Idempotency Safeguards
- **Idempotency Interceptor**: Intercepts requests with `X-Idempotency-Key` header.
- **Circuit Breaker**: Protects external payment gateway calls from cascading outages.
- **Saga Compensation**: 5% simulated payment failures automatically trigger stock release back to the available pool.

### 3. Order Lifecycle Resilience
- **Event-Driven Saga**: Payment emits `payment.succeeded` event to Kafka broker. Order Service consumes events asynchronously, surviving 30-second downstream outages with 0 lost orders.

---

## 💻 Full-Stack Interactive Web Application & Simulator

The codebase includes an interactive Next.js application that serves as:
1. **Live Flash Sale Storefront**: Interactive UI for Product X (100 units initial stock), live stock counter, reservation countdown, and buy now modal.
2. **10,000 Request Concurrency Simulator**: Real-time stress test engine demonstrating 10,000 concurrent purchase attempts, visualizing latency distribution, zero oversell verification, and 100% idempotency intercept rate.
3. **System Design & Blueprint Viewer**: Embedded renderer for all 12 Markdown specifications and Mermaid diagrams.
4. **Database Visualizer**: SQL DDL & Supabase RPC Inspector.

### Running the Application

```bash
# Install Dependencies
npm install

# Run Development Server
npm run dev

# Run Concurrency Load Test Simulation (Terminal CLI)
npm run test:load
```

---

## 🛡️ Hackathon Evaluation Compliance

| Evaluation Area | Weight | Compliance Summary |
| :--- | :--- | :--- |
| **Business & Requirements** | 10% | Fully covered in `01_Requirements/REQUIREMENTS.md` |
| **HLD & Boundaries** | 15% | C4 Diagrams & Boundaries in `02_HLD/HLD.md` |
| **Concurrency & Scalability** | 15% | Hybrid Redis + Postgres RPC in `08_Scalability_Reliability/SCALABILITY_RELIABILITY.md` |
| **Inventory Consistency** | 15% | Stored Procedure & Expiry Release in `04_Database/schema.sql` |
| **Payment & Order Design** | 10% | Sequence & Saga Diagrams in `03_LLD/LLD.md` |
| **LLD & SOLID Patterns** | 15% | Class Diagrams & Patterns in `06_SOLID/SOLID.md` & `07_Design_Patterns/PATTERNS.md` |
| **Database & API Design** | 10% | ERD, Indexes, REST/Kafka Specs in `04_Database` & `05_API` |
| **Reliability & Security** | 5% | Circuit Breaker, Token Bucket, WAF in `09_Security_Observability` |
| **ADR & Trade-offs** | 5% | ADR-001 to ADR-004 in `10_ADR/ADR.md` |

---

*Engineered with precision for SALESTORM System Design Hackathon 2026.*
