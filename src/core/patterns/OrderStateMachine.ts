import type { OrderStatus } from '../domain/types';

export class OrderStateMachine {
  private static validTransitions: Record<OrderStatus, OrderStatus[]> = {
    CREATED: ['PAYMENT_PENDING', 'CANCELLED'],
    PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['OUT_FOR_DELIVERY'],
    OUT_FOR_DELIVERY: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  public static canTransition(current: OrderStatus, next: OrderStatus): boolean {
    const allowed = this.validTransitions[current] || [];
    return allowed.includes(next);
  }

  public static transition(current: OrderStatus, next: OrderStatus): OrderStatus {
    if (!this.canTransition(current, next)) {
      throw new Error(`ILLEGAL_STATE_TRANSITION: Cannot transition order from ${current} to ${next}.`);
    }
    return next;
  }
}
