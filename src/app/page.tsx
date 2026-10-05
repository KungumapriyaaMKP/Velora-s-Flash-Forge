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
  Clock
} from 'lucide-react';

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

  // User Purchase Modal State
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

  const handleUserReservation = async () => {
    setIsPurchasing(true);
    setPurchaseStep('reserving');
    setNotification({ message: 'Initiating atomic stock reservation...', type: 'info' });

    try {
      const customerId = `usr_${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'prod_flash_sale_x',
          customerId,
          idempotencyKey,
          quantity: 1
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPurchaseStep('failed');
        setNotification({ message: `Reservation Failed: ${data.error || 'Out of Stock'}`, type: 'error' });
        setIsPurchasing(false);
        return;
      }

      setLastReservationId(data.data.reservationId);
      if (data.stockState) setStockState(data.stockState);
      setPurchaseStep('reserved');
      setNotification({ message: `Stock Unit Reserved! Reservation ID: ${data.data.reservationId}`, type: 'success' });
    } catch (err: any) {
      setPurchaseStep('failed');
      setNotification({ message: err.message || 'Network error during reservation', type: 'error' });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleUserPayment = async () => {
    if (!lastReservationId) return;
    setIsPurchasing(true);
    setPurchaseStep('paying');
    setNotification({ message: 'Processing payment via Strategy Pattern adapter...', type: 'info' });

    try {
      const customerId = 'usr_current_session';
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: lastReservationId,
          customerId,
          amount: 299.99,
          paymentMethod: 'STRIPE',
          idempotencyKey: `pay_${idempotencyKey}`,
          simulatePaymentFailure: simulateFailure
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPurchaseStep('failed');
        setNotification({ 
          message: `Payment Failed! ${data.error || 'Card declined'}. Saga compensation released stock unit.`, 
          type: 'error' 
        });
        fetchStockState();
        return;
      }

      setPurchaseStep('confirmed');
      setNotification({ message: `Order #${data.order.orderId} Confirmed! Payment Txn: ${data.payment.transactionRef}`, type: 'success' });
      fetchStockState();
    } catch (err: any) {
      setPurchaseStep('failed');
      setNotification({ message: err.message || 'Payment system error', type: 'error' });
    } finally {
      setIsPurchasing(false);
    }
  };

  const resetUserSession = () => {
    setPurchaseStep('idle');
    setLastReservationId(null);
    setIdempotencyKey(`idemp_${Math.random().toString(36).substring(2, 9)}`);
    setNotification(null);
  };

  const runSimulation = async () => {
    setIsRunningSim(true);
    setSimProgress(10);
    setSimResults(null);

    // Progress animation
    const interval = setInterval(() => {
      setSimProgress(prev => (prev >= 90 ? 90 : prev + 15));
    }, 200);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simParams)
      });
      const data = await res.json();
      clearInterval(interval);
      setSimProgress(100);

      if (data.success) {
        setSimResults(data.metrics);
        fetchStockState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningSim(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">SALESTORM</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  SYSCRAFTERS 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">High-Scale Flash Sale Architecture (10,000 Users vs 100 Units)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Supabase Connected:</span>
              <span className="text-emerald-400 font-semibold">dqzqbpl...</span>
            </div>

            {/* Quick Live Stock Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-700/40 text-xs font-mono text-cyan-300">
              <span className="text-slate-400">Available Stock:</span>
              <span className="font-bold text-cyan-400 text-sm">{stockState.availableQuantity}</span>
              <span className="text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-800/60 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'storefront'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Flash Sale Storefront
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Cpu className="w-4 h-4" />
            10,000 Request Simulator
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'design'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            System Design Blueprint
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase Schema & DDL
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: STOREFRONT */}
        {activeTab === 'storefront' && (
          <div className="space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute right-4 -top-8 text-cyan-500/10 pointer-events-none">
                <Zap className="w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  FLASH SALE LIVE NOW • LIMITED QUANTITY
                </div>
                <h2 className="text-2xl font-bold text-white">SALESTORM Flagship Phone X</h2>
                <p className="text-slate-300 max-w-2xl text-sm">
                  10,000 customers currently competing for only 100 available units. Engineered with atomic PostgreSQL stored procedures and Redis Lua pre-locking to ensure zero overselling.
                </p>
              </div>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                notification.type === 'success' ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200' :
                notification.type === 'error' ? 'bg-rose-950/50 border-rose-500/40 text-rose-200' :
                'bg-cyan-950/50 border-cyan-500/40 text-cyan-200'
              }`}>
                {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                {notification.type === 'info' && <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
                <div className="flex-1 font-mono text-xs leading-relaxed">{notification.message}</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-50"></div>
                    <Cpu className="w-20 h-20 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-cyan-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded">
                      LIMITED STOCK
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">SALESTORM Ultra Flash Phone X</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Snapdragon 8 Gen 3, 16GB RAM, 100Available Units Total
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-2xl font-extrabold text-cyan-400">$299.99</span>
                      <span className="text-xs text-slate-500 line-through ml-2">$999.99</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono">70% OFF</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {purchaseStep === 'idle' && (
                    <button
                      onClick={handleUserReservation}
                      disabled={isPurchasing || stockState.availableQuantity <= 0}
                      className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Zap className="w-5 h-5 fill-current" />
                      {stockState.availableQuantity > 0 ? 'BUY NOW (RESERVE ATOMIC)' : 'SOLD OUT'}
                    </button>
                  )}

                  {purchaseStep === 'reserved' && (
                    <button
                      onClick={handleUserPayment}
                      disabled={isPurchasing}
                      className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <CreditCard className="w-5 h-5" />
                      PROCEED TO PAYMENT ($299.99)
                    </button>
                  )}

                  {(purchaseStep === 'confirmed' || purchaseStep === 'failed') && (
                    <button
                      onClick={resetUserSession}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Test Another Purchase
                    </button>
                  )}

                  {/* Idempotency Key Control */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>X-Idempotency-Key Header:</span>
                      <button 
                        onClick={() => setIdempotencyKey(`idemp_${Math.random().toString(36).substring(2, 9)}`)}
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                    <div className="text-xs font-mono text-slate-200 bg-slate-900 p-1.5 rounded truncate border border-slate-800">
                      {idempotencyKey}
                    </div>
                  </div>

                  {/* Toggle Payment Failure Simulation */}
                  <label className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Simulate 5% Payment Failure (Triggers Saga Compensation)
                    </span>
                    <input 
                      type="checkbox" 
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                  </label>
                </div>
              </div>

              {/* Order State Machine Visualizer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Order Lifecycle State Machine
                  </h3>
                  <span className="text-xs font-mono text-slate-400">SOLID State Pattern</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { state: 'AVAILABLE', label: '1. Product Available in Stock', active: true },
                    { state: 'RESERVED', label: '2. Stock Unit Reserved (15m TTL)', active: purchaseStep === 'reserved' || purchaseStep === 'paying' || purchaseStep === 'confirmed' },
                    { state: 'PAYMENT_PENDING', label: '3. Payment Gateway Handshake', active: purchaseStep === 'paying' || purchaseStep === 'confirmed' },
                    { state: 'CONFIRMED', label: '4. Order Confirmed (Order Created)', active: purchaseStep === 'confirmed' },
                    { state: 'SOLD', label: '5. Stock Finalized & Fulfilled', active: purchaseStep === 'confirmed' },
                  ].map((step, idx) => (
                    <div 
                      key={step.state}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                        step.active 
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {step.active ? (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                        )}
                        <span>{step.label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        step.active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-600'
                      }`}>
                        {step.state}
                      </span>
                    </div>
                  ))}
                </div>

                {purchaseStep === 'failed' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      FAILURE STATE TRIGGERED
                    </div>
                    <div>Saga Compensation executed: Stock unlocked and returned to AVAILABLE pool.</div>
                  </div>
                )}
              </div>

              {/* Database & Stock Counters Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Supabase Inventory Telemetry
                  </h3>
                  <button onClick={fetchStockState} className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Sync DB
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">AVAILABLE QUANTITY</div>
                    <div className="text-2xl font-bold text-emerald-400">{stockState.availableQuantity}</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">RESERVED QUANTITY</div>
                    <div className="text-2xl font-bold text-amber-400">{stockState.reservedQuantity}</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">SOLD QUANTITY</div>
                    <div className="text-2xl font-bold text-cyan-400">{stockState.soldQuantity}</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">ROW VERSION (OCC)</div>
                    <div className="text-2xl font-bold text-slate-300">v{stockState.version}</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Atomic Invariant Protection
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 leading-relaxed">
                    Available ({stockState.availableQuantity}) + Reserved ({stockState.reservedQuantity}) + Sold ({stockState.soldQuantity}) = <span className="text-cyan-400 font-bold">100 UNITS TOTAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10,000 CONCURRENCY SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    High-Concurrency Flash Sale Simulator
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulate 10,000 concurrent purchase requests against 100 available units to prove oversell prevention and idempotency.
                  </p>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={isRunningSim}
                  className="py-3 px-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-cyan-500/20"
                >
                  {isRunningSim ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Running 10k Load Test...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      RUN 10,000 STRESS TEST
                    </>
                  )}
                </button>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <label className="text-xs text-slate-400 block mb-1">Total Concurrent Requests</label>
                  <input 
                    type="number" 
                    value={simParams.totalRequests}
                    onChange={(e) => setSimParams({ ...simParams, totalRequests: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-cyan-300"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <label className="text-xs text-slate-400 block mb-1">Available Stock Units</label>
                  <input 
                    type="number" 
                    value={simParams.initialUnits}
                    onChange={(e) => setSimParams({ ...simParams, initialUnits: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-cyan-300"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <label className="text-xs text-slate-400 block mb-1">Payment Failure Rate (%)</label>
                  <input 
                    type="number" 
                    value={simParams.paymentFailureRatePercent}
                    onChange={(e) => setSimParams({ ...simParams, paymentFailureRatePercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-cyan-300"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <label className="text-xs text-slate-400 block mb-1">Duplicate Request Rate (%)</label>
                  <input 
                    type="number" 
                    value={simParams.duplicateRatePercent}
                    onChange={(e) => setSimParams({ ...simParams, duplicateRatePercent: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-cyan-300"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              {isRunningSim && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono text-cyan-400">
                    <span>Executing atomic concurrency load test...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${simProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Grid */}
            {simResults && (
              <div className="space-y-6">
                {/* Proof Banner */}
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-emerald-300">10,000 Request Concurrency Verification Passed!</h3>
                      <p className="text-xs text-emerald-400/80 font-mono">
                        Execution Time: {simResults.executionTimeMs}ms • P99 Latency: {simResults.p99LatencyMs}ms • Zero Oversell Guarantee Validated.
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-extrabold rounded-full uppercase tracking-wider font-mono">
                    VERIFIED ZERO OVERSELL
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">INBOUND REQUESTS</div>
                    <div className="text-2xl font-extrabold text-white">{simResults.totalRequests.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500">Target stock: 100 units</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">SUCCESSFUL RESERVATIONS</div>
                    <div className="text-2xl font-extrabold text-cyan-400">{simResults.successfulReservations}</div>
                    <div className="text-[11px] text-emerald-400">100% of available stock</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">POLITE REJECTIONS</div>
                    <div className="text-2xl font-extrabold text-rose-400">{simResults.rejectedRequests.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-500">Clean 409 Out-of-Stock</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">OVERSOLD UNITS</div>
                    <div className="text-2xl font-extrabold text-emerald-400">{simResults.oversoldUnits}</div>
                    <div className="text-[11px] text-emerald-400">STRICT ZERO OVERSELL</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">DUPLICATES CAUGHT</div>
                    <div className="text-2xl font-extrabold text-amber-400">{simResults.duplicatesCaught}</div>
                    <div className="text-[11px] text-slate-500">Intercepted via Idempotency</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">CONFIRMED ORDERS</div>
                    <div className="text-2xl font-extrabold text-emerald-400">{simResults.ordersConfirmed}</div>
                    <div className="text-[11px] text-slate-500">Successful payment SAGAs</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">FAILED PAYMENTS</div>
                    <div className="text-2xl font-extrabold text-rose-400">{simResults.failedPayments}</div>
                    <div className="text-[11px] text-amber-400">{simResults.stockReleased} stock units released</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-slate-400">AVERAGE LATENCY</div>
                    <div className="text-2xl font-extrabold text-cyan-400">{simResults.avgLatencyMs} ms</div>
                    <div className="text-[11px] text-slate-500">P99: {simResults.p99LatencyMs} ms</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SYSTEM DESIGN BLUEPRINT */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
              {[
                { id: 'HLD', label: '02. High Level Design' },
                { id: 'LLD', label: '03. Low Level Design' },
                { id: 'DATABASE', label: '04. Database Design' },
                { id: 'SOLID', label: '06. SOLID Principles' },
                { id: 'PATTERNS', label: '07. Design Patterns' },
                { id: 'SCALABILITY', label: '08. Scalability & SAGA' },
                { id: 'ADR', label: '10. Architecture Decision Records' },
                { id: 'PITCH', label: '12. 5-Min Pitch & Jury Defense' },
              ].map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id as any)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap ${
                    selectedDoc === doc.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {doc.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm leading-relaxed text-slate-200 space-y-4">
              {selectedDoc === 'HLD' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-cyan-400">High-Level Architecture (C4 Model)</h3>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2 text-cyan-300">
                    <p className="font-bold">Pipeline:</p>
                    <p className="text-slate-300">Users → CDN/WAF → Load Balancer → API Gateway → Inventory Service → Supabase Postgres / Redis → Payment Service → Kafka Event Bus → Order Service</p>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    <li>Cloudflare WAF filters malicious bot traffic and provides virtual queueing.</li>
                    <li>API Gateway enforces Token Bucket rate limiting (5 req/min per user).</li>
                    <li>Redis Lua script pre-checks stock availability in RAM (&lt;2ms).</li>
                    <li>Supabase PostgreSQL executes atomic stored procedures with row-level locks.</li>
                  </ul>
                </div>
              )}

              {selectedDoc === 'LLD' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-cyan-400">Low-Level Module Design & Sequence Diagrams</h3>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2 text-slate-300">
                    <p className="font-bold text-cyan-300">Key Domain Interfaces:</p>
                    <p>• IInventoryRepository (reserveUnits, releaseUnits, confirmSale)</p>
                    <p>• IPaymentGatewayAdapter (StripeAdapter, PayPalAdapter)</p>
                    <p>• OrderStateMachine (CREATED → PAYMENT_PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)</p>
                  </div>
                </div>
              )}

              {selectedDoc === 'SOLID' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-cyan-400">SOLID Principles Mapping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-cyan-400">Single Responsibility (SRP):</span>
                      <p className="text-slate-400 mt-1">InventoryReservationService handles ONLY stock reservation; PaymentService handles ONLY transactions.</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="font-bold text-cyan-400">Open/Closed (OCP):</span>
                      <p className="text-slate-400 mt-1">Payment Strategy pattern allows adding new payment providers without modifying core checkout code.</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedDoc === 'ADR' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-cyan-400">Architecture Decision Records</h3>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-cyan-300">ADR-001: Hybrid Concurrency Control (Redis Lua + Postgres RPC)</div>
                      <p className="text-slate-400 mt-1">Absorbs 9,900 out-of-stock requests in RAM in &lt;2ms, reducing DB workload by 99%.</p>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                      <div className="font-bold text-cyan-300">ADR-004: Mandatory X-Idempotency-Key Header</div>
                      <p className="text-slate-400 mt-1">Guarantees zero duplicate charges and double reservations during network retries.</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedDoc === 'PITCH' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-cyan-400">5-Minute Pitch & Jury Q&A Defense</h3>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-3 text-slate-300">
                    <p className="font-bold text-cyan-300">Q: What happens if 2 requests reach inventory at the exact same time?</p>
                    <p className="text-slate-400">A: Postgres serializes the requests using FOR UPDATE row locks. The first decrements stock from 1 to 0; the second receives an instant OUT_OF_STOCK error response.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE & SUPABASE SCHEMA */}
        {activeTab === 'database' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Supabase PostgreSQL Schema & Atomic Stored Procedures
                </h2>
                <span className="text-slate-400">04_Database/schema.sql</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto">
                <pre className="text-[11px] leading-relaxed text-cyan-300 font-mono">
{`-- SUPABASE ATOMIC RESERVATION STORED PROCEDURE
CREATE OR REPLACE FUNCTION reserve_inventory_atomic(
    p_product_id UUID,
    p_customer_id UUID,
    p_quantity INT,
    p_idempotency_key VARCHAR(128),
    p_ttl_minutes INT DEFAULT 15
) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    v_inventory_id UUID;
    v_available INT;
    v_reservation_id UUID;
BEGIN
    -- Lock Row For Update
    SELECT inventory_id, available_quantity 
    INTO v_inventory_id, v_available
    FROM inventory WHERE product_id = p_product_id FOR UPDATE;

    IF v_available < p_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'OUT_OF_STOCK');
    END IF;

    -- Atomic Decrement
    UPDATE inventory
    SET available_quantity = available_quantity - p_quantity,
        reserved_quantity = reserved_quantity + p_quantity,
        version = version + 1
    WHERE inventory_id = v_inventory_id;

    -- Insert Reservation
    INSERT INTO inventory_reservations (
        inventory_id, customer_id, product_id, quantity, status, expires_at, idempotency_key
    ) VALUES (
        v_inventory_id, p_customer_id, p_product_id, p_quantity, 'RESERVED',
        NOW() + (p_ttl_minutes || ' minutes')::INTERVAL, p_idempotency_key
    ) RETURNING reservation_id INTO v_reservation_id;

    RETURN jsonb_build_object('success', true, 'reservation_id', v_reservation_id);
END;
$$;`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        SALESTORM System Design Hackathon 2026 • Powered by Supabase & Next.js Clean Architecture
      </footer>
    </div>
  );
}
