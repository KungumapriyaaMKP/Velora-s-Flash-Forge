import { supabase } from '../../lib/supabaseClient';
import type { Reservation } from '../domain/types';

export class InventoryEngine {
  private static instance: InventoryEngine;
  
  // In-memory state for fallback & 10k request simulation speed
  private availableQuantity: number = 100;
  private reservedQuantity: number = 0;
  private soldQuantity: number = 0;
  private version: number = 1;
  
  private idempotencyStore: Map<string, Reservation> = new Map();
  private reservations: Map<string, Reservation> = new Map();

  private constructor() {}

  public static getInstance(): InventoryEngine {
    if (!InventoryEngine.instance) {
      InventoryEngine.instance = new InventoryEngine();
    }
    return InventoryEngine.instance;
  }

  public getStockState() {
    return {
      availableQuantity: this.availableQuantity,
      reservedQuantity: this.reservedQuantity,
      soldQuantity: this.soldQuantity,
      version: this.version
    };
  }

  public resetStock(initialUnits: number = 100) {
    this.availableQuantity = initialUnits;
    this.reservedQuantity = 0;
    this.soldQuantity = 0;
    this.version = 1;
    this.idempotencyStore.clear();
    this.reservations.clear();
  }

  /**
   * Atomic Reservation method
   * Implements Idempotency Check + Lock + Reservation Creation
   */
  public async reserveStock(
    productId: string, 
    customerId: string, 
    idempotencyKey: string, 
    quantity: number = 1
  ): Promise<{ success: boolean; reservation?: Reservation; isDuplicate?: boolean; error?: string }> {
    
    // 1. Idempotency Check (Duplicate request prevention)
    if (this.idempotencyStore.has(idempotencyKey)) {
      const existing = this.idempotencyStore.get(idempotencyKey)!;
      return { success: true, reservation: existing, isDuplicate: true };
    }

    // Try Supabase RPC first if database tables exist
    try {
      const { data, error } = await supabase.rpc('reserve_inventory_atomic', {
        p_product_id: productId,
        p_customer_id: customerId,
        p_quantity: quantity,
        p_idempotency_key: idempotencyKey,
        p_ttl_minutes: 15
      });

      if (!error && data && data.success) {
        const res: Reservation = {
          reservationId: data.reservation_id || `res_${Math.random().toString(36).substring(2, 9)}`,
          productId,
          customerId,
          quantity,
          status: 'RESERVED',
          expiresAt: data.expires_at || new Date(Date.now() + 15 * 60000).toISOString(),
          idempotencyKey,
          createdAt: new Date().toISOString()
        };
        this.idempotencyStore.set(idempotencyKey, res);
        this.reservations.set(res.reservationId, res);
        return { success: true, reservation: res, isDuplicate: !!data.is_duplicate };
      }
    } catch {
      // Fall through to in-memory atomic engine
    }

    // 2. Atomic In-Memory Guard (Atomic Check & Decrement)
    if (this.availableQuantity < quantity) {
      return { success: false, error: 'OUT_OF_STOCK' };
    }

    this.availableQuantity -= quantity;
    this.reservedQuantity += quantity;
    this.version += 1;

    const newReservation: Reservation = {
      reservationId: `res_${Math.random().toString(36).substring(2, 10)}`,
      productId,
      customerId,
      quantity,
      status: 'RESERVED',
      expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
      idempotencyKey,
      createdAt: new Date().toISOString()
    };

    this.idempotencyStore.set(idempotencyKey, newReservation);
    this.reservations.set(newReservation.reservationId, newReservation);

    return { success: true, reservation: newReservation, isDuplicate: false };
  }

  /**
   * Release reserved stock (Triggered on Payment Failure or Expiry)
   */
  public releaseReservation(reservationId: string): boolean {
    const res = this.reservations.get(reservationId);
    if (!res || res.status === 'RELEASED' || res.status === 'CONFIRMED') {
      return false;
    }

    res.status = 'RELEASED';
    this.reservedQuantity -= res.quantity;
    this.availableQuantity += res.quantity;
    this.version += 1;
    return true;
  }

  /**
   * Confirm reservation and convert to sold stock
   */
  public confirmReservation(reservationId: string): boolean {
    const res = this.reservations.get(reservationId);
    if (!res || res.status === 'CONFIRMED') {
      return false;
    }

    res.status = 'CONFIRMED';
    this.reservedQuantity -= res.quantity;
    this.soldQuantity += res.quantity;
    this.version += 1;
    return true;
  }
}
