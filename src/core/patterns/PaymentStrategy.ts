export interface PaymentRequest {
  reservationId: string;
  amount: number;
  idempotencyKey: string;
  cardToken?: string;
  simulateFailure?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionRef: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

export interface IPaymentStrategy {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}

export class StripePaymentStrategy implements IPaymentStrategy {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (request.simulateFailure) {
      return {
        success: false,
        transactionRef: `str_fail_${Date.now()}`,
        status: 'FAILED',
        errorMessage: 'Card declined: Insufficient funds.'
      };
    }
    return {
      success: true,
      transactionRef: `str_txn_${Math.random().toString(36).substring(2, 10)}`,
      status: 'SUCCESS'
    };
  }
}

export class PayPalPaymentStrategy implements IPaymentStrategy {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (request.simulateFailure) {
      return {
        success: false,
        transactionRef: `pp_fail_${Date.now()}`,
        status: 'FAILED',
        errorMessage: 'PayPal authentication timeout.'
      };
    }
    return {
      success: true,
      transactionRef: `pp_txn_${Math.random().toString(36).substring(2, 10)}`,
      status: 'SUCCESS'
    };
  }
}

export class PaymentStrategyFactory {
  static getStrategy(provider: 'STRIPE' | 'PAYPAL'): IPaymentStrategy {
    switch (provider) {
      case 'PAYPAL':
        return new PayPalPaymentStrategy();
      case 'STRIPE':
      default:
        return new StripePaymentStrategy();
    }
  }
}
