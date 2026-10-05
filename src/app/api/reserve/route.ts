import { NextResponse } from 'next/server';
import { InventoryEngine } from '@/core/services/InventoryEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerId, idempotencyKey, quantity = 1 } = body;

    if (!productId || !customerId || !idempotencyKey) {
      return NextResponse.json(
        { success: false, error: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const inventoryEngine = InventoryEngine.getInstance();
    const result = await inventoryEngine.reserveStock(productId, customerId, idempotencyKey, quantity);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'OUT_OF_STOCK' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.reservation,
      isDuplicate: result.isDuplicate,
      stockState: inventoryEngine.getStockState()
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const inventoryEngine = InventoryEngine.getInstance();
  return NextResponse.json({
    success: true,
    stockState: inventoryEngine.getStockState()
  });
}
