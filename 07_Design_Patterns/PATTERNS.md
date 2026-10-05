# SALESTORM — Stage 7: Design Patterns Mapping & Rationale

## 1. Design Patterns Matrix

| Pattern | Application in SALESTORM | Problem Solved | Trade-off Introduced |
| :--- | :--- | :--- | :--- |
| **Strategy Pattern** | Payment Gateways & Dynamic Pricing Strategies | Allows switching between Stripe, PayPal, Razorpay seamlessly | Adds extra abstraction interfaces |
| **Factory Pattern** | `PaymentAdapterFactory` | Instantiates appropriate adapter based on user choice or region | Requires updating factory when adding new providers |
| **State Pattern** | `Order` & `Reservation` Lifecycle Management | Encapsulates state-specific transition rules and prevents invalid state leaps (e.g. `EXPIRED` $\rightarrow$ `CONFIRMED`) | Increases class count per state |
| **Observer Pattern** | Event-Driven Microservice Architecture | Decouples Payment Service from Notification, Order, and Analytics Services | Requires eventual consistency management |
| **Adapter Pattern** | 3rd Party Payment & Logistics Wrappers | Normalizes third-party vendor request/response schemas to standard internal interfaces | Data translation overhead |
| **Repository Pattern** | `InventoryRepository` & `OrderRepository` | Decouples business domain logic from Supabase PostgreSQL / Redis persistence details | Additional data mapping layer |
| **Facade Pattern** | `CheckoutFacade` | Provides a clean, simplified entry point for complex multi-service checkout workflows | Can become a bloat point if not scoped |
| **Circuit Breaker Pattern** | External Gateway & Downstream RPC Calls | Prevents cascading system failures during payment provider downtime | Temporarily degrades functionality for affected users |

---

## 2. Pattern Implementation Snippets

### 2.1 Circuit Breaker Pattern (Resilience)
Prevents cascading failures when external payment API experiences high latencies or outages:

```typescript
export enum CircuitState { CLOSED, OPEN, HALF_OPEN }

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureThreshold = 3;
  private failureCount = 0;
  private resetTimeoutMs = 10000;
  private lastFailureTime = 0;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error("CIRCUIT_OPEN: Gateway service is currently unavailable.");
      }
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  private recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  private reset() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }
}
```

### 2.2 State Pattern (Order State Transitions)
Enforces legal order state transitions and execution guards:

```typescript
export abstract class OrderState {
  abstract pay(order: OrderContext): void;
  abstract confirm(order: OrderContext): void;
  abstract cancel(order: OrderContext): void;
}

export class CreatedOrderState extends OrderState {
  pay(order: OrderContext) {
    order.setState(new PaymentPendingOrderState());
  }
  confirm(order: OrderContext) {
    throw new Error("Cannot confirm order without payment authorization.");
  }
  cancel(order: OrderContext) {
    order.setState(new CancelledOrderState());
  }
}
```
