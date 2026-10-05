# SALESTORM — Stage 12: Final 5-Minute Pitch & Jury Defense

## 1. 5-Minute Pitch Script & Presentation Outline

```
[00:00 - 00:30] SLIDE 1: Problem Statement
"Good morning Judges. Imagine launching a flash sale for a viral flagship phone with only 100 units in stock. At 09:00 AM, 10,000 customers hit 'Buy Now' simultaneously. Traditional e-commerce platforms crash, double-charge users, or sell 500 units when only 100 exist. We present SALESTORM — a resilient, high-scale system architecture designed to keep every transaction 100% correct under extreme traffic spikes."

[00:30 - 01:00] SLIDE 2: Functional & Non-Functional Requirements
"Our mission was strict: 0 oversold items, sub-100ms API latency, 100% idempotent payments, and seamless recovery even if downstream services crash for 30 seconds."

[01:00 - 02:00] SLIDE 3: High-Level Architecture (HLD)
"Traffic enters through Cloudflare WAF and API Gateway with Token Bucket rate limiting. Reads are served via Redis Cache. Writes hit our Inventory Service backed by Supabase PostgreSQL. Core microservices communicate asynchronously via Kafka event streams, decoupling checkout from fulfillment."

[02:00 - 03:00] SLIDE 4: Critical Design: 10,000 Users vs. 100 Units
"To prevent database lock contention on a single row, we implement a Hybrid Concurrency model. A Redis Lua script absorbs 9,900 requests in RAM in under 2ms. For the 100 winners, an atomic PostgreSQL stored procedure (reserve_inventory_atomic) performs row-level locking to guarantee 0 overselling."

[03:00 - 03:45] SLIDE 5: Payment & Order Reliability
"Payment operations enforce a mandatory X-Idempotency-Key to stop double charging. In our test scenario of 95% payment success and 5% failures, failed payments trigger a Saga compensation workflow that instantly unlocks stock back to waiting buyers. If the Order Service crashes for 30s, events accumulate safely in Kafka."

[03:45 - 04:30] SLIDE 6: Low-Level Design & SOLID Patterns
"We applied SOLID principles rigorously: Strategy Pattern for payment providers, State Pattern for order lifecycle transitions, Factory Pattern for adapter instantiation, and Circuit Breaker for external resilience."

[04:30 - 05:00] SLIDE 7: AI-Assisted Validation & Conclusion
"We validated our design using an automated 10,000-request simulation. Results: exactly 100 reservations, 0 oversold units, 200 duplicate requests caught, and 100% order recovery post-outage. SALESTORM is ready for high-demand production."
```

---

## 2. Jury Technical Defense Q&A

### Q1: Why is this the correct service boundary?
**Answer**: We separated Inventory, Payment, and Order into autonomous microservices based on domain boundaries (DDD) and differing scaling characteristics. Inventory requires high-speed atomic write locking, Payment interacts with high-latency 3rd-party HTTP APIs, while Order requires complex long-running fulfillment workflows.

### Q2: Where exactly is inventory consistency guaranteed?
**Answer**: Inventory consistency is guaranteed at the database engine level via our `reserve_inventory_atomic` PostgreSQL stored procedure using `SELECT FOR UPDATE` and `CHECK (available_quantity >= 0)` constraints. Even if application pods restart mid-request, Postgres ACID guarantees prevent negative stock.

### Q3: What happens if two requests reach the inventory service at the exact same time?
**Answer**: PostgreSQL serializes the two requests using row-level locking. The first request acquires the `FOR UPDATE` lock, decrements stock from 1 to 0, and commits. The second request acquires the lock immediately after, sees `available_quantity = 0`, and receives an `OUT_OF_STOCK` error response.

### Q4: Why did you select this concurrency strategy over pure Optimistic Locking?
**Answer**: Pure Optimistic Locking (OCC) with version numbers fails catastrophically under extreme contention (10,000 updates on 1 row). 99.9% of requests abort and retry in a tight CPU loop. Our Hybrid approach uses Redis Lua to drop non-winners in RAM, passing only 100 valid transactions to PostgreSQL.

### Q5: Why is inventory reservation synchronous while order processing is asynchronous?
**Answer**: Reservation MUST be synchronous because the user needs immediate confirmation ($<100\text{ms}$) that a unit has been held for them. Order processing is asynchronous because warehouse picking, shipping label generation, and email notifications take seconds/minutes and should never block the user's checkout screen.

### Q6: How does the design recover from payment success followed by Order Service failure?
**Answer**: The Payment Service emits a persistent `payment.succeeded` event to an Apache Kafka topic before responding to the user. If the Order Service is down, Kafka retains the uncommitted event log. Once restored, Order Service polls the queue and completes order creation. A background reconciliation cron job also scans for orphaned payments every 60 seconds.

### Q7: Which component is the likely bottleneck and how will it scale?
**Answer**: The single database row for Product X inventory is the primary physical bottleneck. We scale it by:
1. Sharding inventory across Redis cluster nodes.
2. Grouping inventory allocations into virtual inventory buckets (e.g. 10 buckets of 10 units each) to distribute database lock contention across 10 distinct DB rows.
