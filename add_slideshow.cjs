const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add hero state and slides array
const heroStateInjection = `
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
`;
content = content.replace("// Quick View State", heroStateInjection + "\n  // Quick View State");

// 2. Replace the static Hero Banner HTML with a dynamic slideshow
// We need to match the entire hero banner block and replace it.
// Starts with: {/* Hero Banner / Flash Sale Drop */}
// Ends before: {/* Product Grid */}
const oldHeroRegex = /\{\/\* Hero Banner \/ Flash Sale Drop \*\/\}.*?(?=\{\/\* Product Grid \*\/\})/s;

const newHero = `{/* Hero Banner / Flash Sale Drop */}
          <div className="mb-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col md:flex-row relative group">
            <div className="absolute top-4 left-4 z-10 bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" /> Limited Edition Flash Drop
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative transition-opacity duration-500">
              <h2 className="text-4xl md:text-6xl text-stone-900 mb-4 leading-tight font-serif tracking-tight">{heroSlides[currentHeroSlide].title}</h2>
              <p className="text-stone-500 mb-6 text-lg">{heroSlides[currentHeroSlide].desc}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-extrabold text-stone-900">₹{heroSlides[currentHeroSlide].price.toLocaleString('en-IN')}</div>
                <div className="px-3 py-1 bg-stone-100 text-stone-600 font-mono text-sm rounded-lg border border-stone-200">
                  {stockState.availableQuantity} / 100 Left
                </div>
              </div>

              <div className="space-y-3 max-w-md">
                {purchaseStep === 'idle' && (
                  <button
                    onClick={handleUserReservation}
                    disabled={isPurchasing || stockState.availableQuantity <= 0}
                    className="w-full py-4 px-6 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-stone-900/10 text-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {stockState.availableQuantity > 0 ? 'Buy Now (Atomic Reserve)' : 'Sold Out'}
                  </button>
                )}
                {purchaseStep === 'reserved' && (
                  <button
                    onClick={handleUserPayment}
                    disabled={isPurchasing}
                    className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-stone-900/10 text-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Complete Payment
                  </button>
                )}
                {(purchaseStep === 'confirmed' || purchaseStep === 'failed') && (
                  <div className="flex gap-2">
                    <div className={\`flex-1 p-3 rounded-2xl border flex items-center justify-center text-sm font-bold \${purchaseStep === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}\`}>
                      {purchaseStep === 'confirmed' ? 'Order Confirmed!' : 'Payment Failed!'}
                    </div>
                    <button onClick={resetUserSession} className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl transition-all"><RefreshCw className="w-5 h-5" /></button>
                  </div>
                )}
                
                {notification && (
                  <div className="text-xs font-mono text-stone-500 mt-2 text-center">
                    System: {notification.message}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-stone-50">
              {heroSlides.map((slide, idx) => (
                <img 
                  key={idx}
                  src={slide.image} 
                  alt={slide.title} 
                  className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 \${currentHeroSlide === idx ? 'opacity-100' : 'opacity-0'}\`} 
                />
              ))}
              
              {/* Slideshow Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                {heroSlides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={\`w-2.5 h-2.5 rounded-full transition-all \${currentHeroSlide === idx ? 'bg-stone-900 scale-125' : 'bg-stone-300 hover:bg-stone-400'}\`}
                  />
                ))}
              </div>
            </div>
          </div>

          `;

content = content.replace(oldHeroRegex, newHero);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Hero slideshow added');
