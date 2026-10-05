const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state
const stateInjection = `  const [activeCategory, setActiveCategory] = useState('All');
  
  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);`;
content = content.replace("  const [activeCategory, setActiveCategory] = useState('All');", stateInjection);

// 2. Add onClick to product card
const oldCard = `<div key={prod.id} className="bg-white rounded-3xl p-4 border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all group cursor-pointer">`;
const newCard = `<div key={prod.id} onClick={() => setSelectedProduct(prod)} className="bg-white rounded-3xl p-4 border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all group cursor-pointer">`;
content = content.replace(oldCard, newCard);

// 3. The Modal UI to inject at the bottom of the storefront (right above the Cart Modal)
const quickViewModal = `
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
`;
// Inject before Cart modal
content = content.replace("          {isCartOpen && (", quickViewModal + "\n          {isCartOpen && (");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Quick View Modal added');
