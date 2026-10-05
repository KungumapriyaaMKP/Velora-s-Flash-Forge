'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  ArrowRight, 
  TrendingUp, 
  Sliders, 
  Activity, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Zap, 
  DollarSign, 
  Package, 
  Users, 
  ShieldAlert, 
  Tag, 
  Edit3, 
  Server, 
  Eye, 
  Check, 
  X,
  Sparkles,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

import { Product, CouponReward } from '../../core/domain/storeTypes';
import { SAMPLE_PRODUCTS } from '../../core/services/CatalogService';

interface AdminOrder {
  orderId: string;
  customerEmail: string;
  productName: string;
  amount: number;
  paymentMethod: string;
  status: 'CONFIRMED' | 'PAYMENT_PENDING' | 'RELEASED' | 'SHIPPED';
  timestamp: string;
}

const INITIAL_MOCK_ORDERS: AdminOrder[] = [
  {
    orderId: 'ord_flash_99812',
    customerEmail: 'alex.morgan@techcorp.io',
    productName: "Velora Flash Forge VR-900",
    amount: 499.99,
    paymentMethod: 'stripe',
    status: 'CONFIRMED',
    timestamp: '2026-10-05T11:45:12Z'
  },
  {
    orderId: 'ord_flash_99813',
    customerEmail: 'david.chen@silicon.com',
    productName: "CyberDeck X1 Ultra Gaming Laptop",
    amount: 1299.00,
    paymentMethod: 'paypal',
    status: 'CONFIRMED',
    timestamp: '2026-10-05T11:48:30Z'
  },
  {
    orderId: 'ord_flash_99814',
    customerEmail: 'sarah.j@designstudio.org',
    productName: "Quantum Audio Noise-Canceling Earbuds",
    amount: 149.99,
    paymentMethod: 'upi',
    status: 'PAYMENT_PENDING',
    timestamp: '2026-10-05T11:52:05Z'
  }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Stock Control State
  const [stockState, setStockState] = useState({
    availableQuantity: 100,
    reservedQuantity: 0,
    soldQuantity: 0,
    version: 1
  });
  const [isRestocking, setIsRestocking] = useState(false);
  const [circuitBreakerState, setCircuitBreakerState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [isSalePaused, setIsSalePaused] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_MOCK_ORDERS);
  const [orderFilter, setOrderFilter] = useState<string>('ALL');

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Electronics' | 'Gaming' | 'Wearables' | 'Computing'>('Gaming');

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));

    fetchStockState();
  }, []);

  const fetchStockState = async () => {
    try {
      const res = await fetch('/api/admin/stock');
      const data = await res.json();
      if (data.success && data.stockState) {
        setStockState(data.stockState);
      }
    } catch (e) {
      console.error("Failed to fetch admin stock", e);
    }
  };

  const handleRestock = async () => {
    setIsRestocking(true);
    try {
      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restock', restockQuantity: 100 })
      });
      const data = await res.json();
      if (data.success) {
        setStockState(data.stockState);
        setNotification({ message: data.message, type: 'success' });
      }
    } catch (e: any) {
      setNotification({ message: `Restock failed: ${e.message}`, type: 'error' });
    } finally {
      setIsRestocking(false);
    }
  };

  const handleReleaseExpired = async () => {
    try {
      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'release_expired' })
      });
      const data = await res.json();
      if (data.success) {
        setStockState(data.stockState);
        setNotification({ message: data.message, type: 'success' });
      }
    } catch (e: any) {
      setNotification({ message: `Release failed: ${e.message}`, type: 'error' });
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProd: Product = {
      id: `prod_${Math.random().toString(36).substring(2, 9)}`,
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      originalPrice: parseFloat(newProdPrice) * 1.3,
      discountPercent: 23,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      stockCount: 50,
      description: 'Newly added custom inventory item managed via Velora Admin Console.',
      features: ['Enterprise Spec', 'High Performance']
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNotification({ message: `Product "${newProd.name}" added to live catalog!`, type: 'success' });
  };

  const handleSwitchToAdmin = () => {
    const adminUser = {
      id: 'usr_admin_master',
      fullName: 'System Administrator',
      email: 'admin@velora.io',
      role: 'admin'
    };
    setCurrentUser(adminUser);
    setNotification({ message: 'Switched session authority to System Admin!', type: 'success' });
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'CONFIRMED' || o.status === 'SHIPPED')
    .reduce((acc, o) => acc + o.amount, 0);

  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'merchant');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  VELORA'S FLASH FORGE
                </span>
                <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 uppercase font-bold">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">System Design Operations & Telemetry Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all flex items-center gap-1.5"
            >
              Return to Storefront <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-8">
        {notification && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-lg transition-all ${
            notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' :
            notification.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-300' :
            'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {!isAdmin ? (
          <div className="max-w-md mx-auto bg-slate-900/90 border border-amber-500/40 rounded-3xl p-8 text-center space-y-5 shadow-2xl shadow-amber-500/10">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                ROLE AUTHORIZATION (AUTHZ) GUARD
              </span>
              <h2 className="text-2xl font-bold mt-2 text-white">Admin Privileges Required</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your current session ({currentUser ? currentUser.email : 'Guest'}) does not hold `admin` or `merchant` authority.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Required Role:</span>
                <span className="text-cyan-400 font-bold">ADMIN / MERCHANT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your Active Role:</span>
                <span className="text-amber-400 uppercase font-bold">{currentUser ? currentUser.role || 'customer' : 'GUEST'}</span>
              </div>
            </div>

            <button
              onClick={handleSwitchToAdmin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Grant Demo Admin Authority
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Total Confirmed Revenue</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">${totalRevenue.toFixed(2)}</div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> +14.2% Flash Sale Surge
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold font-mono">Available Stock Units</span>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{stockState.availableQuantity} / 100</div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                  <Database className="w-3 h-3 text-cyan-400" /> PostgreSQL Atomic RPC
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Circuit Breaker Guard</span>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  {circuitBreakerState} (100% HEALTHY)
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                  <Activity className="w-3 h-3 text-emerald-400" /> Stripe Resilience4j Adapter
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Inbound Throughput</span>
                <div className="text-2xl font-black text-purple-400 font-mono mt-1">10,000 req/sec</div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
                  <Cpu className="w-3 h-3 text-purple-400" /> Redis Lua Pre-locking
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> Flash Sale Emergency Operations Panel
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Real-time inventory restocking, stock reclamation, and system circuit breaker management.</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  Version: {stockState.version} • PostgreSQL ACID Lock Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleRestock}
                  disabled={isRestocking}
                  className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isRestocking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Emergency Restock +100 Units
                </button>

                <button
                  onClick={handleReleaseExpired}
                  className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  Force Release Expired Stock
                </button>

                <button
                  onClick={() => {
                    setIsSalePaused(!isSalePaused);
                    setNotification({
                      message: isSalePaused ? 'Flash Sale Resumed!' : 'Flash Sale Suspended via Admin Control!',
                      type: isSalePaused ? 'success' : 'error'
                    });
                  }}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 border ${
                    isSalePaused 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30' 
                      : 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  {isSalePaused ? 'Resume Flash Sale' : 'Pause Flash Sale System'}
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-sky-400" /> Real-time Orders & Transactions Audit Stream
                  </h3>
                  <p className="text-xs text-slate-400">Live order state machine transitions & payment idempotency logs.</p>
                </div>

                <div className="flex gap-2">
                  {['ALL', 'CONFIRMED', 'PAYMENT_PENDING'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        orderFilter === status
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Email</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment Strategy</th>
                      <th className="py-3 px-4">State Machine Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {orders
                      .filter((o) => orderFilter === 'ALL' || o.status === orderFilter)
                      .map((order) => (
                        <tr key={order.orderId} className="hover:bg-slate-950/50 transition-colors">
                          <td className="py-3 px-4 text-cyan-400 font-bold">{order.orderId}</td>
                          <td className="py-3 px-4 text-slate-300 font-sans">{order.customerEmail}</td>
                          <td className="py-3 px-4 text-slate-200 font-sans">{order.productName}</td>
                          <td className="py-3 px-4 text-white font-bold">${order.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 uppercase text-purple-400 font-semibold">{order.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              order.status === 'SHIPPED' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {order.status === 'CONFIRMED' && (
                              <button
                                onClick={() => {
                                  setOrders(orders.map((o) => o.orderId === order.orderId ? { ...o, status: 'SHIPPED' } : o));
                                  setNotification({ message: `Order ${order.orderId} marked as SHIPPED!`, type: 'success' });
                                }}
                                className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-sans text-[11px] font-semibold"
                              >
                                Fulfill Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-indigo-400" /> Catalog Inventory & Price Management
                  </h3>
                  <p className="text-xs text-slate-400">Manage products, stock allocations, and pricing.</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                        <span className="text-[11px] font-mono text-cyan-400">${prod.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-900 font-mono">
                      <span>Stock: <strong>{prod.stockCount} units</strong></span>
                      <span className="text-emerald-400">Status: In Stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Product to Catalog</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Velora VR-X Headset"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="399.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e: any) => setNewProdCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Computing">Computing</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-white text-xs shadow-lg shadow-cyan-500/20"
              >
                Create Product Item
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 font-mono">
        Velora's Flash Forge © 2026 • Enterprise Production Admin & Operational Operations Console
      </footer>
    </div>
  );
}
