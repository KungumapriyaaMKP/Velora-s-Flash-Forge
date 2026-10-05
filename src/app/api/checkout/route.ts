import { NextResponse } from 'next/server';
import { SagaOrchestrator } from '@/core/services/SagaOrchestrator';

const sagaOrchestrator = new SagaOrchestrator();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reservationId, customerId, amount, paymentMethod = 'STRIPE', idempotencyKey, simulatePaymentFailure } = body;

    if (!reservationId || !customerId || !idempotencyKey) {
      return NextResponse.json(
        { success: false, error: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const result = await sagaOrchestrator.executeCheckoutSaga({
      reservationId,
      customerId,
      amount: amount || 299.99,
      paymentMethod,
      idempotencyKey,
      simulatePaymentFailure
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error, 
          compensationTriggered: result.compensationTriggered 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      payment: result.payment
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
