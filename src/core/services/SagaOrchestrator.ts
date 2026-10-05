import { InventoryEngine } from './InventoryEngine';
import { PaymentStrategyFactory } from '../patterns/PaymentStrategy';
import type { PaymentRequest } from '../patterns/PaymentStrategy';
import { CircuitBreaker } from '../patterns/CircuitBreaker';
import { OrderStateMachine } from '../patterns/OrderStateMachine';
import type { Order, OrderStatus, PaymentTransaction } from '../domain/types';

export class SagaOrchestrator {
  private inventoryEngine: InventoryEngine;
  private circuitBreaker: CircuitBreaker;
  private paymentIdempotencyStore: Map<string, PaymentTransaction> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.inventoryEngine = InventoryEngine.getInstance();
    this.circuitBreaker = new CircuitBreaker(3, 10000);
  }

  public async executeCheckoutSaga(params: {
    reservationId: string;
    customerId: string;
    amount: number;
    paymentMethod: 'STRIPE' | 'PAYPAL';
    idempotencyKey: string;
    simulatePaymentFailure?: boolean;
    simulateOrderServiceOutage?: boolean;
  }): Promise<{
    success: boolean;
    order?: Order;
    payment?: PaymentTransaction;
    error?: string;
    compensationTriggered?: boolean;
    orderDelayedByOutage?: boolean;
  }> {
    const { reservationId, customerId, amount, paymentMethod, idempotencyKey, simulatePaymentFailure, simulateOrderServiceOutage } = params;

    // 1. Payment Idempotency Check
    if (this.paymentIdempotencyStore.has(idempotencyKey)) {
      const existingPayment = this.paymentIdempotencyStore.get(idempotencyKey)!;
      const existingOrder = Array.from(this.orders.values()).find(o => o.idempotencyKey === idempotencyKey);
      return {
        success: existingPayment.status === 'SUCCESS',
        payment: existingPayment,
        order: existingOrder
      };
    }

    // 2. Execute Payment via Circuit Breaker & Strategy Pattern
    try {
      const paymentStrategy = PaymentStrategyFactory.getStrategy(paymentMethod);
      const paymentRequest: PaymentRequest = {
        reservationId,
        amount,
        idempotencyKey,
        simulateFailure: simulatePaymentFailure
      };

      const paymentResult = await this.circuitBreaker.execute(async () => {
        return paymentStrategy.processPayment(paymentRequest);
      });

      const paymentTxn: PaymentTransaction = {
        paymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
        reservationId,
        amount,
        status: paymentResult.success ? 'SUCCESS' : 'FAILED',
        transactionRef: paymentResult.transactionRef,
        idempotencyKey,
        createdAt: new Date().toISOString()
      };

      this.paymentIdempotencyStore.set(idempotencyKey, paymentTxn);

      // 3. Check Payment Outcome
      if (!paymentResult.success) {
        // Trigger Saga Compensation: Release Stock Reservation
        this.inventoryEngine.releaseReservation(reservationId);
        return {
          success: false,
          payment: paymentTxn,
          error: paymentResult.errorMessage || 'Payment failed',
          compensationTriggered: true
        };
      }

      // 4. Payment Succeeded -> Confirm Inventory
      this.inventoryEngine.confirmReservation(reservationId);

      // 5. Create Order & Handle Downstream Outage
      let orderStatus: OrderStatus = 'CREATED';
      orderStatus = OrderStateMachine.transition(orderStatus, 'PAYMENT_PENDING');
      orderStatus = OrderStateMachine.transition(orderStatus, 'CONFIRMED');

      const newOrder: Order = {
        orderId: `ord_${Math.random().toString(36).substring(2, 10)}`,
        customerId,
        reservationId,
        totalAmount: amount,
        status: orderStatus,
        idempotencyKey,
        createdAt: new Date().toISOString()
      };

      this.orders.set(newOrder.orderId, newOrder);

      return {
        success: true,
        payment: paymentTxn,
        order: newOrder,
        orderDelayedByOutage: !!simulateOrderServiceOutage
      };
    } catch (err: any) {
      // Circuit Breaker triggered or System Error -> Compensation release
      this.inventoryEngine.releaseReservation(reservationId);
      return {
        success: false,
        error: err.message || 'System fault occurred during payment processing',
        compensationTriggered: true
      };
    }
  }

  public getOrders(): Order[] {
    return Array.from(this.orders.values());
  }
}
