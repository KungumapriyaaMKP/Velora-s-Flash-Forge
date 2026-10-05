# SALESTORM — Stage 6: SOLID Principles Mapping

## 1. Single Responsibility Principle (SRP)
Each service, class, and module has **only one reason to change**.

- **Demonstration**:
  - `InventoryReservationService`: Responsible *only* for validating and locking stock quantities. It does not handle credit card processing or sending customer SMS notifications.
  - `PaymentService`: Responsible *only* for managing transaction state and tokenized payment authorization.
  - `NotificationWorker`: Responsible *only* for formatting and delivering outgoing push notifications.

```typescript
// SRP Compliant Design
export class InventoryReservationService {
  constructor(private readonly inventoryRepo: IInventoryRepository) {}
  
  async reserve(productId: string, qty: number): Promise<ReservationResult> {
    // Only handles inventory allocation logic
    return this.inventoryRepo.atomicDecrement(productId, qty);
  }
}
```

---

## 2. Open / Closed Principle (OCP)
Classes should be **open for extension, but closed for modification**.

- **Demonstration**:
  - `PaymentProcessorFactory`: Adding a new payment gateway (e.g., Apple Pay or Crypto Gateway) does not require modifying core checkout logic. We simply implement `IPaymentGatewayAdapter`.

```typescript
export interface IPaymentGatewayAdapter {
  pay(amount: number, token: string): Promise<PaymentResponse>;
}

export class StripeAdapter implements IPaymentGatewayAdapter {
  async pay(amount: number, token: string): Promise<PaymentResponse> { /* Stripe API call */ }
}

export class CryptoAdapter implements IPaymentGatewayAdapter {
  async pay(amount: number, token: string): Promise<PaymentResponse> { /* Web3 API call */ }
}
```

---

## 3. Liskov Substitution Principle (LSP)
Subtypes must be **substitutable for their base types** without altering correctness.

- **Demonstration**:
  - Any implementation of `IInventoryRepository` (e.g., `PostgresInventoryRepository` or `RedisMockInventoryRepository`) can be swapped seamlessly without breaking `InventoryReservationService`.

---

## 4. Interface Segregation Principle (ISP)
Clients should not be forced to depend upon interfaces they do not use.

- **Demonstration**:
  - Instead of a monolithic `IStorefrontService`, we split interfaces into `IInventoryReader`, `IInventoryWriter`, `IPaymentProcessor`, and `IOrderQuerier`.

```typescript
export interface IInventoryReader {
  getAvailableStock(productId: string): Promise<number>;
}

export interface IInventoryWriter {
  reserveStock(productId: string, qty: number): Promise<boolean>;
  releaseStock(reservationId: string): Promise<boolean>;
}
```

---

## 5. Dependency Inversion Principle (DIP)
High-level modules should **not depend on low-level modules**. Both should depend on abstractions.

- **Demonstration**:
  - `CheckoutOrchestrator` depends on `IPaymentGatewayAdapter` (interface), NOT concrete `StripeSdkClient` directly.
