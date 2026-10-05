export type ReservationStatus = 
  | 'RESERVED' 
  | 'PAYMENT_PENDING' 
  | 'CONFIRMED' 
  | 'RELEASED' 
  | 'EXPIRED';

export type OrderStatus = 
  | 'CREATED' 
  | 'PAYMENT_PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'TIMED_OUT' 
  | 'REFUNDED';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  image: string;
}

export interface InventoryState {
  productId: string;
  availableQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  version: number;
}

export interface Reservation {
  reservationId: string;
  productId: string;
  customerId: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  reservationId: string;
  totalAmount: number;
  status: OrderStatus;
  idempotencyKey: string;
  createdAt: string;
}

export interface PaymentTransaction {
  paymentId: string;
  reservationId: string;
  amount: number;
  status: PaymentStatus;
  transactionRef?: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface SimulationMetrics {
  totalRequests: number;
  successfulReservations: number;
  rejectedRequests: number;
  oversoldUnits: number;
  duplicateRequests: number;
  duplicatesCaught: number;
  successfulPayments: number;
  failedPayments: number;
  stockReleased: number;
  ordersConfirmed: number;
  ordersDelayedByOutage: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  executionTimeMs: number;
}
