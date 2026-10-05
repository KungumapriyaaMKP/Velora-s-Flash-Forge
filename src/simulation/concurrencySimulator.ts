import { InventoryEngine } from '../core/services/InventoryEngine';
import { SagaOrchestrator } from '../core/services/SagaOrchestrator';
import type { SimulationMetrics } from '../core/domain/types';

export async function runConcurrencySimulation(options?: {
  totalRequests?: number;
  initialUnits?: number;
  paymentFailureRatePercent?: number;
  duplicateRatePercent?: number;
}): Promise<SimulationMetrics> {
  const totalRequests = options?.totalRequests || 10000;
  const initialUnits = options?.initialUnits || 100;
  const paymentFailureRate = options?.paymentFailureRatePercent ?? 5;
  const duplicateRate = options?.duplicateRatePercent ?? 2;

  const inventoryEngine = InventoryEngine.getInstance();
  inventoryEngine.resetStock(initialUnits);
  const sagaOrchestrator = new SagaOrchestrator();

  const productId = 'prod_flash_sale_x';
  const startTime = Date.now();

  let successfulReservations = 0;
  let rejectedRequests = 0;
  let duplicateRequests = 0;
  let duplicatesCaught = 0;
  let successfulPayments = 0;
  let failedPayments = 0;
  let stockReleased = 0;
  let ordersConfirmed = 0;

  const latencies: number[] = [];

  // Generate 10,000 simulated request DTOs
  const requests = Array.from({ length: totalRequests }).map((_, index) => {
    const customerId = `usr_${100000 + index}`;
    // Generate 2% duplicate idempotency keys
    const isDuplicate = index > 0 && Math.random() < (duplicateRate / 100);
    const keyIndex = isDuplicate ? Math.floor(Math.random() * index) : index;
    const idempotencyKey = `idemp_req_${keyIndex}`;

    return { customerId, idempotencyKey, isDuplicate };
  });

  // Execute high-concurrency requests in batches of 500 for optimal event loop execution
  const batchSize = 500;
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);

    await Promise.all(batch.map(async (req) => {
      const reqStart = Date.now();
      if (req.isDuplicate) duplicateRequests++;

      const resResult = await inventoryEngine.reserveStock(productId, req.customerId, req.idempotencyKey, 1);
      
      const reqLatency = Date.now() - reqStart;
      latencies.push(reqLatency);

      if (resResult.isDuplicate) {
        duplicatesCaught++;
        return;
      }

      if (!resResult.success || !resResult.reservation) {
        rejectedRequests++;
        return;
      }

      successfulReservations++;

      // Simulate Payment Phase for valid reservations
      const shouldFailPayment = Math.random() < (paymentFailureRate / 100);
      const checkoutResult = await sagaOrchestrator.executeCheckoutSaga({
        reservationId: resResult.reservation.reservationId,
        customerId: req.customerId,
        amount: 299.99,
        paymentMethod: 'STRIPE',
        idempotencyKey: `pay_${req.idempotencyKey}`,
        simulatePaymentFailure: shouldFailPayment
      });

      if (checkoutResult.success) {
        successfulPayments++;
        ordersConfirmed++;
      } else {
        failedPayments++;
        if (checkoutResult.compensationTriggered) {
          stockReleased++;
        }
      }
    }));
  }

  // Calculate final stock audit
  const finalStock = inventoryEngine.getStockState();
  const oversoldUnits = Math.max(0, (initialUnits - finalStock.availableQuantity - finalStock.reservedQuantity - finalStock.soldQuantity));

  const endTime = Date.now();
  latencies.sort((a, b) => a - b);
  const avgLatencyMs = latencies.reduce((acc, l) => acc + l, 0) / (latencies.length || 1);
  const p99LatencyMs = latencies[Math.floor(latencies.length * 0.99)] || 5;

  return {
    totalRequests,
    successfulReservations,
    rejectedRequests,
    oversoldUnits,
    duplicateRequests,
    duplicatesCaught,
    successfulPayments,
    failedPayments,
    stockReleased,
    ordersConfirmed,
    ordersDelayedByOutage: 0,
    avgLatencyMs: Math.round(avgLatencyMs * 100) / 100,
    p99LatencyMs,
    executionTimeMs: endTime - startTime
  };
}
