# Velora's Flash Forge — Stage 2: High-Level System Architecture (HLD)

> **Project Name**: Velora's Flash Forge  
> **Hackathon**: SALESTORM System Design Challenge 2026

---

## 1. System Context Diagram (C4 Level 1)

The System Context Diagram shows how customers interact with **Velora's Flash Forge** and external 3rd-party services (Stripe Payment Gateway, FedEx Logistics, Twilio Notifications).

![System Context Diagram](../diagrams/01_system_context_diagram.png)

```mermaid
graph TD
    User["Customer / Mobile App / Web Client"]
    CDN["Cloudflare CDN & WAF"]
    LB["API Gateway & Load Balancer"]
    SaleSystem["Velora's Flash Forge Platform"]
    PaymentGateway["External Payment Provider (Stripe / PayPal API)"]
    LogisticsProvider["Logistics Partner (FedEx / DHL API)"]
    NotificationGW["Notification Gateway (Twilio / SendGrid)"]

    User -->|1. Browse / Buy Request| CDN
    CDN -->|2. Filtered Traffic| LB
    LB -->|3. Route Requests| SaleSystem
    SaleSystem -->|4. Authorize Payment| PaymentGateway
    SaleSystem -->|5. Dispatch Shipment| LogisticsProvider
    SaleSystem -->|6. Send SMS / Email| NotificationGW
```

---

## 2. Container / Service Architecture (C4 Level 2)

![HLD System Architecture](../diagrams/02_hld_architecture.png)

![C4 Container Architecture](../diagrams/03_container_diagram.png)

```mermaid
graph TB
    subgraph Client Layer
        WebClient["Web / Mobile Storefront UI"]
    end

    subgraph Edge & Security Layer
        WAF["Cloudflare WAF & Edge Rate Limiter"]
        Gateway["Kong API Gateway (Auth & Token Bucket)"]
    end

    subgraph Core Microservices
        ProductService["Product Catalogue Service"]
        CartService["Cart Service"]
        InventoryService["Inventory & Reservation Service"]
        CheckoutService["Checkout Orchestration Service"]
        PaymentService["Payment Processing Service"]
        OrderService["Order Management Service"]
        FulfillmentService["Fulfillment & Shipment Service"]
    end

    subgraph Storage & Messaging Layer
        RedisCache[("Redis Cluster (Stock Cache & Lua Pre-Lock)")]
        KafkaQueue[("Apache Kafka (Event Bus & DLQ)")]
        MainDB[("Supabase PostgreSQL (Primary DB + Stored Procedures)")]
    end

    WebClient --> WAF
    WAF --> Gateway
    Gateway --> InventoryService
    Gateway --> CheckoutService

    CheckoutService --> InventoryService
    CheckoutService --> PaymentService
    CheckoutService --> OrderService

    InventoryService <--> RedisCache
    InventoryService <--> MainDB
    PaymentService <--> MainDB
    OrderService <--> MainDB

    CheckoutService -->|Publish Events| KafkaQueue
    PaymentService -->|Payment Events| KafkaQueue
    KafkaQueue --> OrderService
    KafkaQueue --> FulfillmentService
```

---

## 3. Component Diagram for Critical Services (C4 Level 3)

![Microservices Component Architecture](../diagrams/04_component_diagram.png)

### 3.1 Inventory & Reservation Service Internal Components
```mermaid
graph LR
    subgraph InventoryService
        APIController["Reservation API Controller"]
        IdempotencyInterceptor["Idempotency Interceptor"]
        RateLimiter["Token Bucket Rate Limiter"]
        LockManager["Redis Redlock Manager"]
        AtomicExecutor["Atomic DB Engine (reserve_inventory_atomic)"]
        ExpiryScheduler["Reservation Expiry Worker"]
    end

    APIController --> IdempotencyInterceptor
    IdempotencyInterceptor --> RateLimiter
    RateLimiter --> LockManager
    LockManager --> AtomicExecutor
    ExpiryScheduler --> AtomicExecutor
```

---

## 4. Deployment Diagram (AWS Kubernetes Infrastructure)

![Kubernetes Deployment Infrastructure](../diagrams/05_deployment_diagram.png)

---

## 5. High-Performance Tech Stack Rationale for Judges

1. **Why Cloudflare WAF + Kong API Gateway?**  
   Drops DDoS attacks and enforces rate limits at global edge locations before traffic hits backend application servers.
2. **Why Redis Cluster with Atomic Lua Scripts?**  
   Pre-checks stock in RAM ($<1\text{ms}$). Deducts stock for 100 winners and polite-rejects 9,900 losers without causing DB transaction lock contention.
3. **Why Supabase PostgreSQL + PgBouncer?**  
   ACID compliance guaranteed via engine-level row locks (`SELECT FOR UPDATE`) and `reserve_inventory_atomic` stored procedure. PgBouncer handles connection pooling under 10k surges.
4. **Why Apache Kafka for Event Bus?**  
   Sustains $>1\text{M}$ msg/sec throughput. Buffers order creation events safely during 30-second downstream Order Service outages.
