// =============================================================================
// VELORA'S FLASH FORGE - STORE FRONT, CART, WISHLIST & REWARDS TYPES
// =============================================================================

export interface Product {
  id: string;
  name: string;
  category: 'Electronics' | 'Gaming' | 'Wearables' | 'Computing';
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CouponReward {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 50 for $50
  title: string;
  description: string;
  unlockedAt: string;
  expiresAt: string;
  used: boolean;
}

export type PaymentMethodType = 'stripe' | 'paypal' | 'upi' | 'apple_pay';

export interface PaymentRequestPayload {
  reservationId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  cardToken?: string;
  idempotencyKey: string;
  appliedCouponCode?: string;
}
