import { NextResponse } from 'next/server';
import { InventoryEngine } from '../../../../core/services/InventoryEngine';

export async function GET(request: Request) {
  try {
    const inventoryEngine = InventoryEngine.getInstance();
    const state = inventoryEngine.getStockState();
    return NextResponse.json({ success: true, stockState: state });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, restockQuantity } = body;

    const inventoryEngine = InventoryEngine.getInstance();

    if (action === 'restock') {
      const added = restockQuantity || 100;
      inventoryEngine.restock('prod_flash_forge_edition', added);
      const newState = inventoryEngine.getStockState();
      return NextResponse.json({
        success: true,
        message: `Successfully restocked ${added} units!`,
        stockState: newState
      });
    }

    if (action === 'release_expired') {
      const releasedCount = inventoryEngine.releaseExpiredReservations();
      const newState = inventoryEngine.getStockState();
      return NextResponse.json({
        success: true,
        message: `Released ${releasedCount} expired reservations back to inventory pool!`,
        stockState: newState,
        releasedCount
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
