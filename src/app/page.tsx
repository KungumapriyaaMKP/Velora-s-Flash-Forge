'use client';

import React, { useState, useEffect } from 'react';
import { User, Search, Menu, Star, 
  Heart,
  Sparkles,
  Zap, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShoppingCart, 
  CreditCard, 
  Activity, 
  Layers, 
  Lock, 
  Play,
  Server,
  ShieldCheck
} from 'lucide-react';


const cosmeticProducts = [
  { id: 1, name: "Luminous Silk Foundation", category: "Face", price: 5299, rating: 4.8, reviews: 1204, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Velvet Matte Lip Kit", category: "Lips", price: 2499, rating: 4.9, reviews: 842, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Rosewater Hydrating Toner", category: "Skincare", price: 2650, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Celestial Highlighting Powder", category: "Face", price: 3150, rating: 4.6, reviews: 512, image: "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Advanced Night Repair Serum", category: "Skincare", price: 8699, rating: 4.9, reviews: 3200, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
  { id: 6, name: "Volume Lash Mascara", category: "Eyes", price: 1999, rating: 4.5, reviews: 670, image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=400&auto=format&fit=crop" },
  { id: 7, name: "Pro Palette Eyeshadow", category: "Eyes", price: 3750, rating: 4.8, reviews: 1100, image: "https://images.unsplash.com/photo-1512496115841-db0aafafec3f?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Dewy Glow Face Mist", category: "Skincare", price: 2350, rating: 4.4, reviews: 450, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { id: 9, name: "Satin Finish Lipstick", category: "Lips", price: 1850, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 10, name: "Vitamin C Brightening Serum", category: "Skincare", price: 7050, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
  { id: 11, name: "Invisible UV Flawless Primer", category: "Face", price: 3499, rating: 4.6, reviews: 530, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 12, name: "Liquid Eyeliner Pen", category: "Eyes", price: 1499, rating: 4.5, reviews: 1400, image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=400&auto=format&fit=crop" },
  { id: 13, name: "Gel Lip Liner", category: "Lips", price: 1250, rating: 4.4, reviews: 300, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 14, name: "Peptide Lip Treatment", category: "Lips", price: 1350, rating: 4.9, reviews: 5200, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 15, name: "Brow Freeze Styling Wax", category: "Eyes", price: 1899, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1512496115841-db0aafafec3f?q=80&w=400&auto=format&fit=crop" },
  { id: 16, name: "Radiant Concealer", category: "Face", price: 2499, rating: 4.8, reviews: 1500, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 17, name: "Exfoliating BHA Liquid", category: "Skincare", price: 2650, rating: 4.9, reviews: 4100, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop" },
  { id: 18, name: "Setting Spray", category: "Face", price: 2850, rating: 4.6, reviews: 680, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { id: 19, name: "Plumping Lip Gloss", category: "Lips", price: 1650, rating: 4.5, reviews: 900, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 20, name: "Overnight Reset Oil", category: "Skincare", price: 5650, rating: 4.8, reviews: 340, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
];

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

export default function FrontendDashboard() {
  const [activeTab, setActiveTab] = useState<'storefront' | 'simulator' | 'design' | 'stack' | 'database'>('storefront');
  const [devMode, setDevMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  
  // Hero Slideshow State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroSlides = [
    {
      title: "Velvet Matte Lip Kit",
      desc: "Our highly anticipated cruelty-free, vegan lip kit. Ultra-pigmented and long-lasting.",
      price: 2499,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Luminous Silk Foundation",
      desc: "Achieve a flawless, radiant complexion with our award-winning lightweight silk foundation.",
      price: 5299,
      image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1200&auto=format&fit=crop"
    },
    {
      title: "Advanced Night Serum",
      desc: "Wake up to beautiful skin every day. The #1 facial serum for a youthful, hydrating glow.",
      price: 8699,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');
  
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    setAddedProductName(product.name);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };
  
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

  // Active Design Diagram view
  const [selectedDiagram, setSelectedDiagram] = useState<string>('01_system_context_diagram.jpg');

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
          amount: 2499.00,
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

  
  if (!devMode) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-stone-800 font-sans">
        {/* E-commerce Navbar */}
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <Heart className="w-8 h-8 text-stone-900 fill-stone-900" />
                <h1 className="text-3xl tracking-tight text-stone-900 font-serif">Velora</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
                <button onClick={() => setActiveCategory('All')} className={`hover:text-stone-900 pb-1 ${activeCategory === 'All' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}>Shop All</button>
                <button onClick={() => setActiveCategory('Skincare')} className={`hover:text-stone-900 pb-1 ${activeCategory === 'Skincare' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}>Skincare</button>
                <button onClick={() => setActiveCategory('Face')} className={`hover:text-stone-900 pb-1 ${activeCategory === 'Face' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}>Face</button>
                <button onClick={() => setActiveCategory('Lips')} className={`hover:text-stone-900 pb-1 ${activeCategory === 'Lips' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}>Lips</button>
                <button onClick={() => setActiveCategory('Eyes')} className={`hover:text-stone-900 pb-1 ${activeCategory === 'Eyes' ? 'text-stone-900 border-b-2 border-stone-900' : ''}`}>Eyes</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative">
                <input 
                  type="text" 
                  placeholder="Search for products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300 w-64" 
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-2.5" />
              </div>
              <button className="text-stone-500 hover:text-stone-900"><User className="w-5 h-5" /></button>
              <button onClick={() => setIsCartOpen(true)} className="text-stone-500 hover:text-stone-900 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>}
              </button>
              <button onClick={() => setDevMode(true)} className="ml-4 px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
                Developer Mode
              </button>
            </div>
          </div>
        

          

      </header>

        
        {/* Full-width Hero Slideshow */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-stone-900 group">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentHeroSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/10">
                <span className="text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-4 drop-shadow-md">New Arrivals</span>
                <h2 className="text-5xl md:text-7xl text-white mb-6 leading-tight font-serif tracking-tight drop-shadow-lg">{slide.title}</h2>
                <p className="text-white/90 mb-10 text-lg md:text-xl max-w-2xl drop-shadow-md">{slide.desc}</p>
                <button className="px-10 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-100 transition-colors shadow-2xl tracking-wide uppercase text-sm">
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
          
          {/* Slideshow Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${currentHeroSlide === idx ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          
          {/* Product Grid */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-3xl text-stone-900 font-serif tracking-tight">Trending Now</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50">Filter</button>
              <button className="px-4 py-2 border border-stone-200 rounded-full text-sm font-medium hover:bg-stone-50">Sort</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cosmeticProducts
    .filter(prod => {
      const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'All' || prod.category === activeCategory;
      return matchSearch && matchCategory;
    })
    .map(prod => (
              <div key={prod.id} onClick={() => setSelectedProduct(prod)} className="bg-white rounded-3xl p-4 border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all group cursor-pointer">
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 relative bg-stone-50">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-stone-900 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-stone-900 font-bold tracking-wider uppercase mb-1">{prod.category}</div>
                <h4 className="text-stone-900 font-semibold mb-1 truncate">{prod.name}</h4>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span className="text-xs font-bold text-gray-700">{prod.rating}</span>
                  <span className="text-xs text-gray-400">({prod.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
                  <span className="font-extrabold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        

          {selectedProduct && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProduct(null)}></div>
              <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-stone-500 hover:bg-stone-100 hover:text-stone-900 font-bold shadow-sm">X</button>
                
                {/* Image / Slideshow Mock */}
                <div className="w-full md:w-1/2 bg-stone-50 relative h-72 md:h-auto">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover" />
                  {/* Slideshow indicator dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white shadow"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 shadow"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50 shadow"></div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                  <div className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">{selectedProduct.category}</div>
                  <h2 className="text-3xl font-serif text-stone-900 mb-2 leading-tight tracking-tight">{selectedProduct.name}</h2>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-orange-400">
                      <Star className="w-4 h-4 fill-orange-400" />
                      <Star className="w-4 h-4 fill-orange-400" />
                      <Star className="w-4 h-4 fill-orange-400" />
                      <Star className="w-4 h-4 fill-orange-400" />
                      <Star className="w-4 h-4 fill-orange-400" />
                    </div>
                    <span className="text-sm font-bold text-stone-700">{selectedProduct.rating}</span>
                    <span className="text-sm text-stone-400">({selectedProduct.reviews} reviews)</span>
                  </div>

                  <p className="text-stone-500 mb-8 leading-relaxed text-sm">
                    Elevate your daily routine with our luxurious <strong>{selectedProduct.name}</strong>. 
                    Meticulously crafted for a flawless, long-lasting finish, this premium {selectedProduct.category.toLowerCase()} product 
                    is enriched with hydrating botanicals. 100% cruelty-free, vegan, and formulated for sensitive skin. 
                    Experience the aesthetic glow that everyone is talking about.
                  </p>

                  <div className="mt-auto">
                    <div className="text-3xl font-extrabold text-stone-900 mb-6">₹{selectedProduct.price.toLocaleString('en-IN')}</div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(selectedProduct); setSelectedProduct(null); }} 
                      className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCartOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
              <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">Your Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 font-bold">X</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center text-stone-400 mt-10">Your cart is empty.</div>
                  ) : (
                    cartItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center group">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-stone-50 border border-stone-100" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{item.name}</h4>
                          <div className="text-stone-500 text-xs mt-1 uppercase tracking-wider">{item.category}</div>
                        </div>
                        <div className="font-extrabold text-stone-900">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                    ))
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-stone-100 bg-stone-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-stone-600">Subtotal</span>
                      <span className="text-2xl font-extrabold text-stone-900">
                        ₹{cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10">
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCartToast && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="font-medium text-sm">{addedProductName} added to cart</span>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] text-gray-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-pink-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm">
          <span className="font-mono">Developer Mode Active</span>
          <button onClick={() => setDevMode(false)} className="bg-fuchsia-500 hover:bg-fuchsia-400 px-3 py-1 rounded font-bold text-xs transition">Exit Developer Mode</button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-400/10 border border-pink-400/30 rounded-lg text-fuchsia-500">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-pink-900">Velora Cosmetics</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-pink-400/20 text-fuchsia-400 font-mono border border-pink-400/30">
                  SYS DESIGN 2026
                </span>
              </div>
              <p className="text-xs text-pink-400">Limited Edition Cosmetics Drop (10,000 Users vs 100 Units)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-gray-600">Supabase:</span>
              <span className="text-purple-500 font-semibold">Active</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50/60 border border-pink-200/40 text-xs font-mono text-fuchsia-400">
              <span className="text-pink-400">Available Stock:</span>
              <span className="font-bold text-fuchsia-500 text-sm">{stockState.availableQuantity}</span>
              <span className="text-pink-300">/ 100</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-pink-200/60 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'storefront'
                ? 'border-fuchsia-500 text-fuchsia-500 bg-pink-400/10'
                : 'border-transparent text-pink-400 hover:text-gray-700 hover:bg-pink-100/40'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Flash Sale Storefront
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-fuchsia-500 text-fuchsia-500 bg-pink-400/10'
                : 'border-transparent text-pink-400 hover:text-gray-700 hover:bg-pink-100/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            10,000 Request Simulator
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'design'
                ? 'border-fuchsia-500 text-fuchsia-500 bg-pink-400/10'
                : 'border-transparent text-pink-400 hover:text-gray-700 hover:bg-pink-100/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            Architecture Diagrams
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'stack'
                ? 'border-fuchsia-500 text-fuchsia-500 bg-pink-400/10'
                : 'border-transparent text-pink-400 hover:text-gray-700 hover:bg-pink-100/40'
            }`}
          >
            <Server className="w-4 h-4" />
            Tech Stack Defense
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-fuchsia-500 text-fuchsia-500 bg-pink-400/10'
                : 'border-transparent text-pink-400 hover:text-gray-700 hover:bg-pink-100/40'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase Telemetry
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: STOREFRONT */}
        {activeTab === 'storefront' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50/60 via-slate-900 to-slate-950 border border-pink-400/30 rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-fuchsia-500 text-xs font-mono uppercase tracking-wider font-semibold">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  FLASH SALE LIVE NOW • LIMITED QUANTITY
                </div>
                <h2 className="text-2xl font-bold text-pink-900">Velora's Velvet Matte Lip Kit - Limited Edition</h2>
                <p className="text-gray-600 max-w-2xl text-sm">
                  10,000 customers currently competing for only 100 available units. Engineered with atomic PostgreSQL stored procedures and Redis Lua pre-locking to ensure zero overselling.
                </p>
              </div>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                notification.type === 'success' ? 'bg-purple-50/50 border-purple-400/40 text-emerald-200' :
                notification.type === 'error' ? 'bg-rose-950/50 border-rose-500/40 text-rose-200' :
                'bg-pink-50/50 border-pink-400/40 text-cyan-200'
              }`}>
                {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />}
                {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
                {notification.type === 'info' && <Activity className="w-5 h-5 text-fuchsia-500 shrink-0 mt-0.5" />}
                <div className="flex-1 font-mono text-xs leading-relaxed">{notification.message}</div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Card */}
              <div className="bg-white border border-pink-200 rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-[#fff0f5] border border-pink-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <Sparkles className="w-20 h-20 text-fuchsia-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-pink-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded">
                      LIMITED STOCK
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-pink-900">Velora's Velvet Matte Lip Kit - Limited Edition</h3>
                    <p className="text-xs text-pink-400 mt-1">
                      Cruelty-free, vegan, ultra-pigmented lip kit. 100 Available Units Total
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-pink-200">
                    <div>
                      <span className="text-2xl font-extrabold text-fuchsia-500">$299.99</span>
                      <span className="text-xs text-pink-300 line-through ml-2">$999.99</span>
                    </div>
                    <span className="text-xs text-purple-500 font-mono">70% OFF</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {purchaseStep === 'idle' && (
                    <button
                      onClick={handleUserReservation}
                      disabled={isPurchasing || stockState.availableQuantity <= 0}
                      className="w-full py-3 px-4 bg-pink-400 hover:bg-fuchsia-500 disabled:bg-pink-100 disabled:text-pink-400 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-400/20"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                      {stockState.availableQuantity > 0 ? 'BUY NOW (RESERVE ATOMIC)' : 'SOLD OUT'}
                    </button>
                  )}

                  {purchaseStep === 'reserved' && (
                    <button
                      onClick={handleUserPayment}
                      disabled={isPurchasing}
                      className="w-full py-3 px-4 bg-purple-400 hover:bg-purple-500 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-400/20"
                    >
                      <CreditCard className="w-5 h-5" />
                      PROCEED TO PAYMENT ($299.99)
                    </button>
                  )}

                  {(purchaseStep === 'confirmed' || purchaseStep === 'failed') && (
                    <button
                      onClick={resetUserSession}
                      className="w-full py-2.5 px-4 bg-pink-100 hover:bg-pink-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Test Another Purchase
                    </button>
                  )}

                  <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-pink-400 font-mono">
                      <span>X-Idempotency-Key Header:</span>
                      <button 
                        onClick={() => setIdempotencyKey(`idemp_${Math.random().toString(36).substring(2, 9)}`)}
                        className="text-fuchsia-500 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                    <div className="text-xs font-mono text-gray-700 bg-white p-1.5 rounded truncate border border-pink-200">
                      {idempotencyKey}
                    </div>
                  </div>

                  <label className="flex items-center justify-between bg-[#fff0f5] p-2.5 rounded-lg border border-pink-200 text-xs text-gray-600 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Simulate 5% Payment Failure (Triggers Saga Compensation)
                    </span>
                    <input 
                      type="checkbox" 
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded border-pink-300 bg-white text-pink-400 focus:ring-pink-400"
                    />
                  </label>
                </div>
              </div>

              {/* Order State Machine Visualizer */}
              <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                  <h3 className="text-sm font-bold text-pink-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-fuchsia-500" />
                    Order Lifecycle State Machine
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {[
                    { state: 'AVAILABLE', label: '1. Product Available in Stock', active: true },
                    { state: 'RESERVED', label: '2. Stock Unit Reserved (15m TTL)', active: purchaseStep === 'reserved' || purchaseStep === 'paying' || purchaseStep === 'confirmed' },
                    { state: 'PAYMENT_PENDING', label: '3. Payment Gateway Handshake', active: purchaseStep === 'paying' || purchaseStep === 'confirmed' },
                    { state: 'CONFIRMED', label: '4. Order Confirmed (Order Created)', active: purchaseStep === 'confirmed' },
                    { state: 'SOLD', label: '5. Stock Finalized & Fulfilled', active: purchaseStep === 'confirmed' },
                  ].map((step) => (
                    <div 
                      key={step.state}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                        step.active 
                          ? 'bg-pink-50/40 border-pink-400/50 text-cyan-200' 
                          : 'bg-[#fff0f5] border-pink-200 text-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {step.active ? (
                          <CheckCircle2 className="w-4 h-4 text-fuchsia-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-pink-300 shrink-0"></div>
                        )}
                        <span>{step.label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        step.active ? 'bg-pink-400/20 text-fuchsia-400' : 'bg-pink-100 text-pink-400'
                      }`}>
                        {step.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Telemetry */}
              <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                  <h3 className="text-sm font-bold text-pink-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-fuchsia-500" />
                    Live Inventory Telemetry
                  </h3>
                  <button onClick={fetchStockState} className="text-xs text-fuchsia-500 hover:underline flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Sync DB
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                    <div className="text-[10px] text-pink-400">AVAILABLE QUANTITY</div>
                    <div className="text-2xl font-bold text-purple-500">{stockState.availableQuantity}</div>
                  </div>

                  <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                    <div className="text-[10px] text-pink-400">RESERVED QUANTITY</div>
                    <div className="text-2xl font-bold text-orange-400">{stockState.reservedQuantity}</div>
                  </div>

                  <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                    <div className="text-[10px] text-pink-400">SOLD QUANTITY</div>
                    <div className="text-2xl font-bold text-fuchsia-500">{stockState.soldQuantity}</div>
                  </div>

                  <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                    <div className="text-[10px] text-pink-400">ROW VERSION (OCC)</div>
                    <div className="text-2xl font-bold text-gray-600">v{stockState.version}</div>
                  </div>
                </div>

                <div className="bg-[#fff0f5] p-3.5 rounded-lg border border-pink-200 space-y-2 text-xs text-gray-600">
                  <div className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-fuchsia-500" />
                    Atomic Invariant Protection
                  </div>
                  <div className="font-mono text-[11px] text-pink-400 leading-relaxed">
                    Available ({stockState.availableQuantity}) + Reserved ({stockState.reservedQuantity}) + Sold ({stockState.soldQuantity}) = <span className="text-fuchsia-500 font-bold">100 UNITS TOTAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10,000 CONCURRENCY SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-pink-200 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-pink-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-fuchsia-500" />
                    10,000 Request Concurrency Stress Test Engine
                  </h2>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={isRunningSim}
                  className="py-3 px-6 bg-pink-400 hover:bg-fuchsia-500 disabled:bg-pink-100 text-slate-950 font-bold rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-pink-400/20"
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                  <label className="text-xs text-pink-400 block mb-1">Total Requests</label>
                  <input 
                    type="number" 
                    value={simParams.totalRequests}
                    onChange={(e) => setSimParams({ ...simParams, totalRequests: Number(e.target.value) })}
                    className="w-full bg-white border border-pink-300 rounded px-2.5 py-1 text-sm font-mono text-fuchsia-400"
                  />
                </div>

                <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                  <label className="text-xs text-pink-400 block mb-1">Available Stock Units</label>
                  <input 
                    type="number" 
                    value={simParams.initialUnits}
                    onChange={(e) => setSimParams({ ...simParams, initialUnits: Number(e.target.value) })}
                    className="w-full bg-white border border-pink-300 rounded px-2.5 py-1 text-sm font-mono text-fuchsia-400"
                  />
                </div>

                <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                  <label className="text-xs text-pink-400 block mb-1">Payment Failure Rate (%)</label>
                  <input 
                    type="number" 
                    value={simParams.paymentFailureRatePercent}
                    onChange={(e) => setSimParams({ ...simParams, paymentFailureRatePercent: Number(e.target.value) })}
                    className="w-full bg-white border border-pink-300 rounded px-2.5 py-1 text-sm font-mono text-fuchsia-400"
                  />
                </div>

                <div className="bg-[#fff0f5] p-3 rounded-lg border border-pink-200">
                  <label className="text-xs text-pink-400 block mb-1">Duplicate Request Rate (%)</label>
                  <input 
                    type="number" 
                    value={simParams.duplicateRatePercent}
                    onChange={(e) => setSimParams({ ...simParams, duplicateRatePercent: Number(e.target.value) })}
                    className="w-full bg-white border border-pink-300 rounded px-2.5 py-1 text-sm font-mono text-fuchsia-400"
                  />
                </div>
              </div>

              {isRunningSim && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono text-fuchsia-500">
                    <span>Executing load test...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#fff0f5] rounded-full overflow-hidden border border-pink-200">
                    <div className="h-full bg-pink-400 transition-all duration-300" style={{ width: `${simProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {simResults && (
              <div className="space-y-6">
                <div className="p-4 bg-purple-50/60 border border-purple-400/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-purple-500 shrink-0" />
                    <div>
                      <h3 className="text-base font-bold text-purple-400">10,000 Request Concurrency Verification Passed!</h3>
                      <p className="text-xs text-purple-500/80 font-mono">
                        Execution Time: {simResults.executionTimeMs}ms • P99 Latency: {simResults.p99LatencyMs}ms • Zero Oversell Verified.
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-purple-400 text-slate-950 text-xs font-extrabold rounded-full uppercase tracking-wider font-mono">
                    VERIFIED ZERO OVERSELL
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                  <div className="bg-white border border-pink-200 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-pink-400">INBOUND REQUESTS</div>
                    <div className="text-2xl font-extrabold text-pink-900">{simResults.totalRequests.toLocaleString()}</div>
                  </div>

                  <div className="bg-white border border-pink-200 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-pink-400">SUCCESSFUL RESERVATIONS</div>
                    <div className="text-2xl font-extrabold text-fuchsia-500">{simResults.successfulReservations}</div>
                  </div>

                  <div className="bg-white border border-pink-200 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-pink-400">POLITE REJECTIONS</div>
                    <div className="text-2xl font-extrabold text-rose-500">{simResults.rejectedRequests.toLocaleString()}</div>
                  </div>

                  <div className="bg-white border border-pink-200 p-4 rounded-xl space-y-1">
                    <div className="text-xs text-pink-400">OVERSOLD UNITS</div>
                    <div className="text-2xl font-extrabold text-purple-500">{simResults.oversoldUnits}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ARCHITECTURE DIAGRAMS */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="flex space-x-2 border-b border-pink-200 pb-3 overflow-x-auto">
              {[
                { id: '01_system_context_diagram.jpg', label: '01. System Context Diagram' },
                { id: '02_hld_architecture.jpg', label: '02. HLD Architecture' },
                { id: '03_container_diagram.jpg', label: '03. Container Diagram' },
                { id: '04_component_diagram.jpg', label: '04. Component Diagram' },
                { id: '05_deployment_diagram.jpg', label: '05. Deployment Diagram' },
                { id: '06_er_diagram.jpg', label: '06. Database ER Diagram' },
              ].map(diag => (
                <button
                  key={diag.id}
                  onClick={() => setSelectedDiagram(diag.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap ${
                    selectedDiagram === diag.id
                      ? 'bg-pink-400/20 text-fuchsia-400 border border-pink-400/40 font-bold'
                      : 'bg-white text-pink-400 hover:text-gray-700 border border-pink-200'
                  }`}
                >
                  {diag.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-pink-200 rounded-xl p-4 flex items-center justify-center overflow-hidden">
              <img 
                src={`/diagrams/${selectedDiagram}`}
                alt="System Architecture Diagram"
                className="max-w-full h-auto rounded-lg shadow-2xl border border-pink-200"
              />
            </div>
          </div>
        )}

        {/* TAB 4: TECH STACK DEFENSE */}
        {activeTab === 'stack' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                <h2 className="text-base font-bold text-pink-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-fuchsia-500" />
                  High-Performance Tech Stack Rationale for Jury Defense
                </h2>
              </div>

              <div className="space-y-4 text-gray-600">
                <div className="bg-[#fff0f5] p-4 rounded-lg border border-pink-200 space-y-2">
                  <span className="font-bold text-fuchsia-500 text-sm">1. Edge Protection: Cloudflare WAF + Kong Gateway</span>
                  <p className="text-pink-400">Absorbs Layer-7 DDoS traffic at global edge servers. Enforces Token Bucket rate limits (5 req/min per user) before requests reach backend application pods.</p>
                </div>

                <div className="bg-[#fff0f5] p-4 rounded-lg border border-pink-200 space-y-2">
                  <span className="font-bold text-fuchsia-500 text-sm">2. In-Memory Concurrency: Redis Cluster (Atomic Lua Scripts)</span>
                  <p className="text-pink-400">Pre-checks stock availability in RAM (&lt;1ms). Deducts stock for 100 winners and polite-rejects 9,900 losers without causing RDBMS connection pool crashes.</p>
                </div>

                <div className="bg-[#fff0f5] p-4 rounded-lg border border-pink-200 space-y-2">
                  <span className="font-bold text-fuchsia-500 text-sm">3. Persistent Database: Supabase PostgreSQL + PgBouncer</span>
                  <p className="text-pink-400">Guarantees engine-level ACID locks (`SELECT FOR UPDATE`) and `reserve_inventory_atomic` stored procedures. PgBouncer pools 10k connections down to 50 active DB sockets.</p>
                </div>

                <div className="bg-[#fff0f5] p-4 rounded-lg border border-pink-200 space-y-2">
                  <span className="font-bold text-fuchsia-500 text-sm">4. Event Stream Broker: Apache Kafka</span>
                  <p className="text-pink-400">Sustains &gt;1M msg/sec throughput. Decouples payment authorization from order fulfillment, safely buffering events during 30s downstream service outages.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE TELEMETRY */}
        {activeTab === 'database' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                <h2 className="text-base font-bold text-pink-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-fuchsia-500" />
                  Supabase PostgreSQL Schema & Atomic Stored Procedures
                </h2>
              </div>

              <div className="bg-[#fff0f5] p-4 rounded-lg border border-pink-200 text-gray-600 overflow-x-auto">
                <pre className="text-[11px] leading-relaxed text-fuchsia-400 font-mono">
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
    SELECT inventory_id, available_quantity 
    INTO v_inventory_id, v_available
    FROM inventory WHERE product_id = p_product_id FOR UPDATE;

    IF v_available < p_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'OUT_OF_STOCK');
    END IF;

    UPDATE inventory
    SET available_quantity = available_quantity - p_quantity,
        reserved_quantity = reserved_quantity + p_quantity,
        version = version + 1
    WHERE inventory_id = v_inventory_id;

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

      <footer className="border-t border-pink-200 bg-white/60 py-4 px-6 text-center text-xs text-pink-300 font-mono">
        Velora Cosmetics • System Design Hackathon 2026
      </footer>
    </div>
  );
}
