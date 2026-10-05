import { NextResponse } from 'next/server';
import { runConcurrencySimulation } from '@/simulation/concurrencySimulator';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const totalRequests = body.totalRequests || 10000;
    const initialUnits = body.initialUnits || 100;
    const paymentFailureRatePercent = body.paymentFailureRatePercent ?? 5;
    const duplicateRatePercent = body.duplicateRatePercent ?? 2;

    const metrics = await runConcurrencySimulation({
      totalRequests,
      initialUnits,
      paymentFailureRatePercent,
      duplicateRatePercent
    });

    return NextResponse.json({
      success: true,
      metrics
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'SIMULATION_ERROR' },
      { status: 500 }
    );
  }
}
