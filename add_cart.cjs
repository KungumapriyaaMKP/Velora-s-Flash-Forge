const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state
const stateInjection = `  const [activeCategory, setActiveCategory] = useState('All');
  
  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');
  
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    setAddedProductName(product.name);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 3000);
  };`;

content = content.replace("  const [activeCategory, setActiveCategory] = useState('All');", stateInjection);

// 2. Update Navbar Cart Icon
const oldCartIcon = /<button className="text-stone-500 hover:text-stone-900 relative">[\s\S]*?<ShoppingCart className="w-5 h-5" \/>[\s\S]*?<\/button>/;
const newCartIcon = `<button className="text-stone-500 hover:text-stone-900 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>}
              </button>`;
content = content.replace(oldCartIcon, newCartIcon);

// 3. Update Grid Cart Button
const oldGridBtn = /<button className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">/g;
const newGridBtn = `<button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">`;
content = content.replace(oldGridBtn, newGridBtn);

// 4. Inject Toast
// Note: We need to append the toast before the closing main tag for the storefront mode.
// We'll replace </main>\n      </div>\n    );
const toastMarkup = `
          {showCartToast && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="font-medium text-sm">{addedProductName} added to cart</span>
            </div>
          )}
        </main>
      </div>
    );`;
content = content.replace(/<\/main>\s*<\/div>\s*\);\s*}\s*return \(/, toastMarkup + "\n  }\n\n  return (");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Cart functionality added.');
