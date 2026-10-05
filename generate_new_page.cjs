const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add devMode state
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'storefront' | 'simulator' | 'design' | 'stack' | 'database'>('storefront');",
  "const [activeTab, setActiveTab] = useState<'storefront' | 'simulator' | 'design' | 'stack' | 'database'>('storefront');\n  const [devMode, setDevMode] = useState(false);"
);

// 2. Add imports
content = content.replace(
  "import {",
  "import { User, Search, Menu, Star,"
);

// 3. Add products array right after imports
const productsStr = `
const cosmeticProducts = [
  { id: 1, name: "Luminous Silk Foundation", category: "Face", price: 64.00, rating: 4.8, reviews: 1204, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Velvet Matte Lip Kit", category: "Lips", price: 29.99, rating: 4.9, reviews: 842, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Rosewater Hydrating Toner", category: "Skincare", price: 32.00, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Celestial Highlighting Powder", category: "Face", price: 38.00, rating: 4.6, reviews: 512, image: "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Advanced Night Repair Serum", category: "Skincare", price: 105.00, rating: 4.9, reviews: 3200, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
  { id: 6, name: "Volume Lash Mascara", category: "Eyes", price: 24.00, rating: 4.5, reviews: 670, image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=400&auto=format&fit=crop" },
  { id: 7, name: "Pro Palette Eyeshadow", category: "Eyes", price: 45.00, rating: 4.8, reviews: 1100, image: "https://images.unsplash.com/photo-1512496115841-db0aafafec3f?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Dewy Glow Face Mist", category: "Skincare", price: 28.00, rating: 4.4, reviews: 450, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { id: 9, name: "Satin Finish Lipstick", category: "Lips", price: 22.00, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 10, name: "Vitamin C Brightening Serum", category: "Skincare", price: 85.00, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
  { id: 11, name: "Invisible UV Flawless Primer", category: "Face", price: 42.00, rating: 4.6, reviews: 530, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 12, name: "Liquid Eyeliner Pen", category: "Eyes", price: 18.00, rating: 4.5, reviews: 1400, image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=400&auto=format&fit=crop" },
  { id: 13, name: "Gel Lip Liner", category: "Lips", price: 15.00, rating: 4.4, reviews: 300, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 14, name: "Peptide Lip Treatment", category: "Lips", price: 16.00, rating: 4.9, reviews: 5200, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 15, name: "Brow Freeze Styling Wax", category: "Eyes", price: 23.00, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1512496115841-db0aafafec3f?q=80&w=400&auto=format&fit=crop" },
  { id: 16, name: "Radiant Concealer", category: "Face", price: 30.00, rating: 4.8, reviews: 1500, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 17, name: "Exfoliating BHA Liquid", category: "Skincare", price: 32.00, rating: 4.9, reviews: 4100, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop" },
  { id: 18, name: "Setting Spray", category: "Face", price: 34.00, rating: 4.6, reviews: 680, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { id: 19, name: "Plumping Lip Gloss", category: "Lips", price: 20.00, rating: 4.5, reviews: 900, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 20, name: "Overnight Reset Oil", category: "Skincare", price: 68.00, rating: 4.8, reviews: 340, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
];
`;
content = content.replace("interface SimulationMetrics {", productsStr + "\ninterface SimulationMetrics {");

// 4. Wrap return with devMode condition
const newReturn = `
  if (!devMode) {
    return (
      <div className="min-h-screen bg-[#fff0f5] text-gray-800 font-sans">
        {/* E-commerce Navbar */}
        <header className="bg-white border-b border-pink-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <Heart className="w-8 h-8 text-fuchsia-500 fill-fuchsia-500" />
                <h1 className="text-2xl font-bold tracking-tight text-pink-900">Velora</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-fuchsia-500 text-fuchsia-500 border-b-2 border-fuchsia-500 pb-1">Shop All</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Bestsellers</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Skincare</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Makeup</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Sets</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative">
                <input type="text" placeholder="Search for products..." className="pl-10 pr-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300 w-64" />
                <Search className="w-4 h-4 text-pink-400 absolute left-4 top-2.5" />
              </div>
              <button className="text-gray-600 hover:text-fuchsia-500"><User className="w-5 h-5" /></button>
              <button className="text-gray-600 hover:text-fuchsia-500 relative">
                <ShoppingCart className="w-5 h-5" />
                {purchaseStep === 'confirmed' && <span className="absolute -top-2 -right-2 w-4 h-4 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">1</span>}
              </button>
              <button onClick={() => setDevMode(true)} className="ml-4 px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
                Developer Mode
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Banner / Flash Sale Drop */}
          <div className="mb-12 bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100 flex flex-col md:flex-row relative">
            <div className="absolute top-4 left-4 z-10 bg-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" /> Limited Edition Flash Drop
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-pink-900 mb-4 leading-tight">Velvet Matte Lip Kit</h2>
              <p className="text-gray-600 mb-6 text-lg">Our highly anticipated cruelty-free, vegan lip kit. Ultra-pigmented and long-lasting.</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-extrabold text-fuchsia-500">$29.99</div>
                <div className="px-3 py-1 bg-pink-100 text-fuchsia-600 font-mono text-sm rounded-lg border border-pink-200">
                  {stockState.availableQuantity} / 100 Left
                </div>
              </div>

              <div className="space-y-3 max-w-md">
                {purchaseStep === 'idle' && (
                  <button
                    onClick={handleUserReservation}
                    disabled={isPurchasing || stockState.availableQuantity <= 0}
                    className="w-full py-4 px-6 bg-pink-900 hover:bg-pink-800 disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-pink-900/20 text-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {stockState.availableQuantity > 0 ? 'Buy Now (Atomic Reserve)' : 'Sold Out'}
                  </button>
                )}
                {purchaseStep === 'reserved' && (
                  <button
                    onClick={handleUserPayment}
                    disabled={isPurchasing}
                    className="w-full py-4 px-6 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold rounded-xl transition-all shadow-xl shadow-fuchsia-500/30 text-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Complete Payment
                  </button>
                )}
                {(purchaseStep === 'confirmed' || purchaseStep === 'failed') && (
                  <div className="flex gap-2">
                    <div className={\`flex-1 p-3 rounded-xl border flex items-center justify-center text-sm font-bold \${purchaseStep === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}\`}>
                      {purchaseStep === 'confirmed' ? 'Order Confirmed!' : 'Payment Failed!'}
                    </div>
                    <button onClick={resetUserSession} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"><RefreshCw className="w-5 h-5" /></button>
                  </div>
                )}
                
                {/* Notification Area for Flash Sale */}
                {notification && (
                  <div className="text-xs font-mono text-gray-500 mt-2 text-center">
                    System: {notification.message}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop" alt="Velvet Lip Kit" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-pink-900">Trending Now</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-pink-200 rounded-full text-sm font-medium hover:bg-pink-50">Filter</button>
              <button className="px-4 py-2 border border-pink-200 rounded-full text-sm font-medium hover:bg-pink-50">Sort</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cosmeticProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl p-4 border border-pink-100 hover:shadow-xl hover:border-pink-300 transition-all group cursor-pointer">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4 relative bg-pink-50">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-fuchsia-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-fuchsia-500 font-bold tracking-wider uppercase mb-1">{prod.category}</div>
                <h4 className="text-gray-800 font-bold mb-1 truncate">{prod.name}</h4>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span className="text-xs font-bold text-gray-700">{prod.rating}</span>
                  <span className="text-xs text-gray-400">({prod.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-pink-50">
                  <span className="font-extrabold text-pink-900">$\${prod.price.toFixed(2)}</span>
                  <button className="w-8 h-8 rounded-full bg-pink-50 text-fuchsia-500 flex items-center justify-center hover:bg-fuchsia-500 hover:text-white transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
`;

content = content.replace("return (", newReturn + "\n  return (");

// Add button to exit dev mode in the existing header
const devModeExitBtn = `
          <button onClick={() => setDevMode(false)} className="ml-4 px-3 py-1.5 text-xs font-semibold bg-fuchsia-500 text-white rounded-full hover:bg-fuchsia-400 transition shadow-lg">
            Exit Developer Mode
          </button>
`;
content = content.replace("</header>", devModeExitBtn + "\n      </header>");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Done rewriting page.tsx');
