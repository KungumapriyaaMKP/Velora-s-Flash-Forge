# SALESTORM — Stage 3: Low-Level Design (LLD) & Sequence Diagrams

## 1. Object-Oriented Class Diagram (Core Domain Modules)

```mermaid
classDiagram
    class Inventory {
        +UUID inventoryId
        +UUID productId
        +int availableQuantity
        +int reservedQuantity
        +int soldQuantity
        +long version
        +reserveUnits(quantity: int) Reservation
        +releaseUnits(quantity: int) void
        +confirmSale(quantity: int) void
    }

    class InventoryReservation {
        +UUID reservationId
        +UUID inventoryId
        +UUID customerId
        +int quantity
        +ReservationStatus status
        +DateTime expiresAt
        +String idempotencyKey
        +isExpired() boolean
        +markPaid() void
        +markExpired() void
    }

    class ReservationStatus {
        <<enumeration>>
        RESERVED
        PAYMENT_PENDING
        CONFIRMED
        RELEASED
        EXPIRED
    }

    class Order {
        +UUID orderId
        +UUID customerId
        +UUID reservationId
        +Money totalAmount
        +OrderStatus status
        +String idempotencyKey
        +transitionTo(nextStatus: OrderStatus) void
        +cancelOrder(reason: String) void
    }

    class OrderStatus {
        <<enumeration>>
        CREATED
        PAYMENT_PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        OUT_FOR_DELIVERY
        DELIVERED
        CANCELLED
    }

    class PaymentTransaction {
        +UUID paymentId
        +UUID orderId
        +UUID reservationId
        +Money amount
        +PaymentStatus status
        +String transactionRef
        +String idempotencyKey
        +markSuccess(ref: String) void
        +markFailed(reason: String) void
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        SUCCESS
        FAILED
        TIMED_OUT
        REFUNDED
    }

    interface IPaymentGatewayAdapter {
        +processPayment(request: PaymentRequest) PaymentResult
        +queryTransaction(transactionRef: String) PaymentResult
    }

    class StripePaymentAdapter {
        +processPayment(request: PaymentRequest) PaymentResult
    }

    class PayPalPaymentAdapter {
        +processPayment(request: PaymentRequest) PaymentResult
    }

    Inventory "1" -- "0..*" InventoryReservation : tracks
    InventoryReservation "1" -- "0..1" Order : results in
    Order "1" -- "1" PaymentTransaction : associated with
    IPaymentGatewayAdapter <|.. StripePaymentAdapter
    IPaymentGatewayAdapter <|.. PayPalPaymentAdapter
```

---

## 2. Sequence Diagram 1: Flash Sale Purchase & Reservation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Gateway as API Gateway / Rate Limiter
    participant InvService as Inventory Service
    participant Redis as Redis Cluster (Atomic Lua Script)
    participant DB as Supabase PostgreSQL

    Customer->>Gateway: POST /api/v1/reservations (productId, idempotencyKey)
    Gateway->>Gateway: Validate Rate Limit & JWT Token
    Gateway->>InvService: Reserve Stock Request
    InvService->>Redis: EVALSHA reserve_stock.lua (productId, customerId, expiry=15m)
    
    alt Redis Cache Hit (Stock Available > 0)
        Redis-->>InvService: Stock Decremented (New Available: 99), Return Reservation Token
        InvService->>DB: Async Persist Reservation Record (status: RESERVED)
        InvService-->>Customer: 201 Created (reservationId, status: RESERVED, expiresAt)
    else Redis Cache Miss / Stock Exhausted (Stock == 0)
        Redis-->>InvService: Error (STOCK_EXHAUSTED)
        InvService-->>Customer: 409 Conflict / 410 Gone (Out of Stock)
    end
```

---

## 3. Sequence Diagram 2: Payment Processing & Safe Idempotency Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Checkout as Checkout Service
    participant PayService as Payment Service
    participant CB as Circuit Breaker
    participant Stripe as Stripe Gateway API
    participant DB as Supabase PostgreSQL

    Customer->>Checkout: POST /api/v1/checkout/pay (reservationId, paymentDetails, idempotencyKey)
    Checkout->>PayService: Process Payment Request
    PayService->>DB: SELECT * FROM payments WHERE idempotency_key = ?
    
    alt Duplicate Request Found
        DB-->>PayService: Existing Payment Transaction Record
        PayService-->>Customer: 200 OK (Return Existing Status without re-charging)
    else First Time Request
        PayService->>DB: INSERT INTO payments (status: PENDING, idempotency_key)
        PayService->>CB: Execute Payment via Adapter
        CB->>Stripe: POST /v1/charges (Amount, CardToken, Idempotency-Header)
        
        alt Payment Succeeded (95% Case)
            Stripe-->>CB: 200 OK (TransactionRef: txn_12345)
            CB-->>PayService: Success Result
            PayService->>DB: UPDATE payments SET status='SUCCESS', txn_ref='txn_12345'
            PayService->>DB: UPDATE inventory_reservations SET status='PAYMENT_PENDING'
            PayService-->>Checkout: Payment Success
            Checkout-->>Customer: 200 OK (Payment Authorized, Order Processing)
        else Payment Failed (5% Case)
            Stripe-->>CB: 402 Payment Required / Declined
            CB-->>PayService: Failed Result
            PayService->>DB: UPDATE payments SET status='FAILED'
            PayService->>DB: UPDATE inventory_reservations SET status='RELEASED'
            PayService->>DB: UPDATE inventory SET available_quantity = available_quantity + 1 (Release Stock)
            PayService-->>Customer: 400 Bad Request (Payment Declined, Stock Released)
        end
    end
```

---

## 4. Sequence Diagram 3: Asynchronous Order Creation & Downstream Outage Recovery (30s Outage Scenario)

```mermaid
sequenceDiagram
    autonumber
    participant PayService as Payment Service
    participant EventBus as Apache Kafka / Event Bus
    participant OrderService as Order Management Service (Crashed for 30s)
    participant DB as Supabase PostgreSQL
    participant Worker as Order Reconciliation Worker

    PayService->>EventBus: Publish Event: `payment.succeeded` (reservationId, customerId, amount)
    
    note over OrderService: Order Service is Down (30 Seconds Outage)
    EventBus-->>OrderService: Delivery Attempt Fails / Queued in Broker Topic
    
    note over OrderService: 30 Seconds Later: Order Service Recovers
    OrderService->>EventBus: Poll / Consume `payment.succeeded` Event
    OrderService->>DB: BEGIN TRANSACTION
    OrderService->>DB: INSERT INTO orders (reservation_id, customer_id, status: 'CONFIRMED')
    OrderService->>DB: UPDATE inventory SET sold_quantity = sold_quantity + 1, reserved_quantity = reserved_quantity - 1
    OrderService->>DB: UPDATE inventory_reservations SET status='CONFIRMED'
    OrderService->>DB: COMMIT TRANSACTION
    OrderService->>EventBus: Publish Event: `order.created`
    
    note over Worker: Periodic Reconciliation (Every 1 Minute)
    Worker->>DB: SELECT * FROM payments WHERE status='SUCCESS' AND order_id IS NULL AND created_at < NOW() - INTERVAL '2 min'
    Worker->>OrderService: Trigger Manual Order Creation for any Orphaning
```

---

## 5. State Diagrams

### 5.1 Reservation Lifecycle State Diagram
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE
    AVAILABLE --> RESERVED : User clicks "Buy Now" (Stock Decremented)
    RESERVED --> PAYMENT_PENDING : User submits valid payment details
    PAYMENT_PENDING --> CONFIRMED : Payment Gateway returns SUCCESS
    CONFIRMED --> SOLD : Order fulfilled and stock finalized
    
    RESERVED --> RELEASED : Payment fails / User cancels
    RESERVED --> EXPIRED : 15-minute TTL timeout exceeded
    PAYMENT_PENDING --> RELEASED : Payment Gateway fails / declines
    
    RELEASED --> AVAILABLE : Stock returned to available pool
    EXPIRED --> AVAILABLE : Stock returned to available pool
    SOLD --> [*]
```

### 5.2 Order Lifecycle State Diagram
```mermaid
stateDiagram-v2
    [*] --> CREATED
    CREATED --> PAYMENT_PENDING : Checkout initialized
    PAYMENT_PENDING --> CONFIRMED : Payment verified successfully
    CONFIRMED --> PROCESSING : Warehouse picked & packed
    PROCESSING --> SHIPPED : Handed to carrier (tracking assigned)
    SHIPPED --> OUT_FOR_DELIVERY : Driver on route
    OUT_FOR_DELIVERY --> DELIVERED : Package signed and confirmed
    
    PAYMENT_PENDING --> CANCELLED : Payment failed or timed out
    CONFIRMED --> CANCELLED : Customer cancelled prior to shipping (triggers refund)
    CANCELLED --> [*]
    DELIVERED --> [*]
```
