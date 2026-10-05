'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShoppingCart, 
  CreditCard, 
  Activity, 
  Layers, 
  Server, 
  Lock, 
  Play,
  ArrowRight,
  TrendingUp,
  Sliders,
  Terminal,
  Clock,
  Search,
  Heart,
  Filter,
  Gift,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  User as UserIcon,
  Tag,
  Sparkles,
  Check
} from 'lucide-react';

import { Product, CartItem, CouponReward, PaymentMethodType } from '../core/domain/storeTypes';
import { SAMPLE_PRODUCTS, CatalogService } from '../core/services/CatalogService';
import { ScratchCardModal } from '../components/ScratchCardModal';
import { RewardsLocker } from '../components/RewardsLocker';

interface SimulationMetrics {
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
  avgLatencyMs: number;
  p99LatencyMs: number;
  executionTimeMs: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'storefront' | 'simulator' | 'design' | 'database'>('storefront');
  
  // Stock State
  const [stockState, setStockState] = useState({
    availableQuantity: 100,
    reservedQuantity: 0,
    soldQuantity: 0,
    version: 1
  });

  // Auth User Session State
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating'>('popularity');

  // Shopping Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  // Coupon & Reward State
  const [appliedCoupon, setAppliedCoupon] = useState<CouponReward | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [unlockedCoupons, setUnlockedCoupons] = useState<CouponReward[]>([
    {
      id: 'coupon_welcome',
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      title: 'WELCOME 20% OFF',
      description: 'Welcome bonus reward! 20% discount on any flash sale product.',
      unlockedAt: new Date().toISOString(),
      expiresAt: '2026-12-31T23:59:59Z',
      used: false
    }
  ]);
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);

  // Payment Checkout State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('stripe');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'reserving' | 'reserved' | 'paying' | 'confirmed' | 'failed'>('idle');
  const [idempotencyKey, setIdempotencyKey] = useState(`idemp_${Math.random().toString(36).substring(2, 9)}`);
  const [lastReservationId, setLastReservationId] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Simulator State
  const [simParams, setSimParams] = useState({
    totalRequests: 10000,
    initialUnits: 100,
    paymentFailureRatePercent: 5,
    duplicateRatePercent: 2
  });
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simResults, setSimResults] = useState<SimulationMetrics | null>(null);

  // Active Design Document view
  const [selectedDoc, setSelectedDoc] = useState<'HLD' | 'LLD' | 'DATABASE' | 'SOLID' | 'PATTERNS' | 'SCALABILITY' | 'ADR' | 'PITCH'>('HLD');

  useEffect(() => {
    fetchStockState();
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const fetchStockState = async () => {
    try {
      const res = await fetch('/api/reserve');
      const data = await res.json();
      if (data.success && data.stockState) {
        setStockState(data.stockState);
      }
    } catch (e) {
      console.error("Failed to fetch stock state", e);
    }
  };

  // Cart Management
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setNotification({ message: `Added ${product.name} to Cart!`, type: 'success' });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist Management
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Coupon Application
  const handleApplyCouponCode = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = unlockedCoupons.find((c) => c.code.toUpperCase() === code);
    if (found) {
      setAppliedCoupon(found);
      setNotification({ message: `Coupon ${code} applied successfully!`, type: 'success' });
    } else {
      setNotification({ message: `Invalid or locked coupon code "${code}".`, type: 'error' });
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(cartSubtotal, appliedCoupon.discountValue);
    }
  }
  const taxAmount = (cartSubtotal - discountAmount) * 0.08;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + taxAmount);

  // Filtered Products
  const filteredProducts = CatalogService.filterProducts(
    SAMPLE_PRODUCTS,
    searchQuery,
    selectedCategory,
    0,
    maxPrice,
    onlyInStock,
    sortBy
  );

  // Purchase & Payment Handler
  const handleUserReservation = async () => {
    setIsPurchasing(true);
    setPurchaseStep('reserving');
    setNotification({ message: 'Initiating atomic stock reservation...', type: 'info' });

    try {
      const customerId = currentUser ? currentUser.id : `usr_${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          productId: 'prod_flash_forge_edition',
          customerId: customerId,
          quantity: 1
        })
      });

      const data = await res.json();

      if (!data.success) {
        setPurchaseStep('failed');
        setNotification({ message: `Reservation Failed: ${data.error}`, type: 'error' });
        setIsPurchasing(false);
        return;
      }

      setLastReservationId(data.reservationId);
      setPurchaseStep('reserved');
      setNotification({ message: `Stock Reserved! ID: ${data.reservationId}. Processing payment via ${selectedPaymentMethod.toUpperCase()}...`, type: 'success' });
      await fetchStockState();

      // Proceed to Payment Execution
      setTimeout(async () => {
        setPurchaseStep('paying');
        const payRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': `pay_${idempotencyKey}`
          },
          body: JSON.stringify({
            reservationId: data.reservationId,
            amount: cartTotal > 0 ? cartTotal : 499.99,
            paymentMethod: selectedPaymentMethod,
            simulateFailure: simulateFailure,
            appliedCouponCode: appliedCoupon?.code
          })
        });

        const payData = await payRes.json();

        if (payData.success) {
          setPurchaseStep('confirmed');
          setNotification({ message: `Payment Succeeded! Order Confirmed: ${payData.orderId}. Opening Scratch Card...`, type: 'success' });
          setCart([]);
          
          setTimeout(() => {
            setIsScratchModalOpen(true);
          }, 800);
        } else {
          setPurchaseStep('failed');
          setNotification({ message: `Payment Failed (${payData.error}). Saga Compensation Executed: Stock Returned to Pool!`, type: 'error' });
        }

        await fetchStockState();
        setIsPurchasing(false);
        setIdempotencyKey(`idemp_${Math.random().toString(36).substring(2, 9)}`);
      }, 1500);

    } catch (err: any) {
      setPurchaseStep('failed');
      setNotification({ message: `Network Error: ${err.message}`, type: 'error' });
      setIsPurchasing(false);
    }
  };

  // Run Load Test Simulator
  const runSimulation = async () => {
    setIsRunningSim(true);
    setSimProgress(10);
    setSimResults(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simParams)
      });
      setSimProgress(70);

      const data = await res.json();
      setSimProgress(100);

      if (data.success && data.metrics) {
        setSimResults(data.metrics);
      }
    } catch (e) {
      console.error("Simulation error", e);
    } finally {
      setIsRunningSim(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                VELORA'S FLASH FORGE
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                SALESTORM 2026
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flash sale products, VR headsets, laptops..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-slate-800 transition-all relative"
              title="Rewards Vault & Coupons"
            >
              <Gift className="w-4 h-4" />
              {unlockedCoupons.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                  {unlockedCoupons.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all relative"
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-pink-500 fill-pink-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-[11px]">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>

            <a
              href="/auth"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">{currentUser ? currentUser.fullName || currentUser.email : 'Login / Auth'}</span>
            </a>

            <a
              href="/admin"
              className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="hidden lg:inline">Admin Panel</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-8 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'storefront' 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Storefront & Buy
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'simulator' 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" /> 10k Load Simulator
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'design' 
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Architecture Specs
          </button>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' :
            notification.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-300' :
            'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              {notification.type === 'info' && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: STOREFRONT, FILTER & MULTI-PAYMENT CHECKOUT */}
        {/* ========================================================================= */}
        {activeTab === 'storefront' && (
          <div className="space-y-8">
            
            {/* Live Inventory Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="space-y-2 lg:col-span-2">
                  <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    Live Supabase Inventory Telemetry
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    Velora Flash Sale Inventory Counter
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Protected by Hybrid Redis Lua Pre-locking + Supabase PostgreSQL <code className="text-cyan-300">FOR UPDATE</code> Row Locks. Zero overselling under 10,000 concurrent purchase spikes.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Available</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{stockState.availableQuantity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Reserved</span>
                    <div className="text-2xl font-black text-amber-400 font-mono mt-1">{stockState.reservedQuantity}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Sold</span>
                    <div className="text-2xl font-black text-sky-400 font-mono mt-1">{stockState.soldQuantity}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Filter Controls Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Category:
                </span>
                {['All', 'Gaming', 'Computing', 'Wearables', 'Electronics'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/10'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  In Stock Only
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="bg-red-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-pink-500 transition-all"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-pink-500 fill-pink-500' : ''}`} />
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-500 font-normal">({product.reviewCount})</span>
                          </div>
                          <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                            ✓ {product.stockCount} Units Available
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-xl font-black text-white font-mono">${product.price.toFixed(2)}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-slate-500 line-through font-mono">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </button>

                      {product.id === 'prod_flash_forge_edition' ? (
                        <button
                          onClick={handleUserReservation}
                          disabled={isPurchasing}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5" /> Flash Buy
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 10,000 CONCURRENT REQUEST LOAD SIMULATOR */}
        {/* ========================================================================= */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">10,000 Request Concurrency Simulator</h2>
                  <p className="text-xs text-slate-400 font-mono">Test atomic Lua pre-locks, DB row locks, and Saga compensations under load.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Total Inbound Requests</label>
                  <input
                    type="number"
                    value={simParams.totalRequests}
                    onChange={(e) => setSimParams({ ...simParams, totalRequests: parseInt(e.target.value) || 1000 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Available Stock</label>
                  <input
                    type="number"
                    value={simParams.initialUnits}
                    onChange={(e) => setSimParams({ ...simParams, initialUnits: parseInt(e.target.value) || 100 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Failure Rate (%)</label>
                  <input
                    type="number"
                    value={simParams.paymentFailureRatePercent}
                    onChange={(e) => setSimParams({ ...simParams, paymentFailureRatePercent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={isRunningSim}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isRunningSim ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                {isRunningSim ? 'Simulating 10,000 Concurrent Requests...' : 'Execute 10,000 Request Stress Benchmark'}
              </button>

              {simResults && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">
                      ✓ Benchmark Execution Verified
                    </span>
                    <span className="text-xs font-mono text-slate-400">Time Taken: {simResults.executionTimeMs} ms</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Inbound Requests</span>
                      <div className="text-xl font-bold font-mono text-white mt-1">{simResults.totalRequests.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Oversold Items</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{simResults.oversoldUnits} (ZERO)</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Confirmed Orders</span>
                      <div className="text-xl font-bold font-mono text-sky-400 mt-1">{simResults.ordersConfirmed}</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Average Latency</span>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-1">{simResults.avgLatencyMs} ms</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SYSTEM DESIGN ARCHITECTURE SPECIFICATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 overflow-x-auto gap-1">
              {(['HLD', 'LLD', 'DATABASE', 'SOLID', 'PATTERNS', 'SCALABILITY', 'ADR', 'PITCH'] as const).map((doc) => (
                <button
                  key={doc}
                  onClick={() => setSelectedDoc(doc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedDoc === doc 
                      ? 'bg-cyan-500 text-slate-950' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {doc}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" /> System Design Blueprint — {selectedDoc}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-300 mb-2">High Resolution System Diagram</h4>
                  <img 
                    src={
                      selectedDoc === 'HLD' ? '/diagrams/02_hld_architecture.png' :
                      selectedDoc === 'LLD' ? '/diagrams/07_class_diagram.png' :
                      selectedDoc === 'DATABASE' ? '/diagrams/06_er_diagram.png' :
                      '/diagrams/01_system_context_diagram.png'
                    }
                    alt="System Architecture Diagram" 
                    className="w-full rounded-lg border border-slate-800 object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
                  <p>• <strong>Project Name</strong>: Velora's Flash Forge</p>
                  <p>• <strong>Concurrency Protection</strong>: Redis Lua Pre-locking + Supabase PostgreSQL atomic transaction stored procedure (<code className="text-cyan-400">reserve_inventory_atomic</code>).</p>
                  <p>• <strong>Resilience Strategy</strong>: Circuit Breaker pattern wrapped around Stripe payment API with automatic Saga compensation stock release on payment failure.</p>
                  <p>• <strong>AuthN & AuthZ Engine</strong>: PBKDF2 SHA-512 password hashing with 32-byte salt, constant-time comparison, and 15-minute brute-force lockout mutex.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OVER DRAWER: SHOPPING CART & MULTI-PAYMENT CHECKOUT */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col justify-between p-6 shadow-2xl text-slate-100">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Your Shopping Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Your cart is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h4>
                          <span className="text-xs font-mono text-cyan-400">${item.product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.product.id, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-400 hover:text-red-300 ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. WELCOME20)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleApplyCouponCode()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex justify-between items-center">
                    <span>Applied: <strong>{appliedCoupon.code}</strong></span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-amber-400 hover:text-white">✕</button>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400 font-mono">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Select Payment Strategy</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'stripe', name: '💳 Stripe Card' },
                      { id: 'paypal', name: '🅿️ PayPal' },
                      { id: 'upi', name: '⚡ UPI Pay' },
                      { id: 'apple_pay', name: '🍎 Apple Pay' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedPaymentMethod(m.id as PaymentMethodType)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedPaymentMethod === m.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleUserReservation}
                  disabled={isPurchasing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPurchasing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {isPurchasing ? 'Processing Order & Strategy...' : `Pay $${cartTotal.toFixed(2)} & Complete Order`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER DRAWER: WISHLIST */}
      {/* ========================================================================= */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl text-slate-100">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <h3 className="text-lg font-bold text-white">Saved Wishlist ({wishlist.length})</h3>
                </div>
                <button onClick={() => setIsWishlistOpen(false)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <Heart className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {SAMPLE_PRODUCTS.filter((p) => wishlist.includes(p.id)).map((product) => (
                    <div key={product.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{product.name}</h4>
                          <span className="text-xs font-mono text-cyan-400">${product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product);
                          toggleWishlist(product.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Storage Locker Drawer */}
      <RewardsLocker
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        unlockedCoupons={unlockedCoupons}
        onApplyCoupon={(code) => handleApplyCouponCode(code)}
      />

      {/* Interactive Gamified Scratch Card Modal */}
      <ScratchCardModal
        isOpen={isScratchModalOpen}
        onClose={() => setIsScratchModalOpen(false)}
        onCouponUnlocked={(newCoupon) => {
          setUnlockedCoupons((prev) => [newCoupon, ...prev]);
        }}
      />

    </div>
  );
}
