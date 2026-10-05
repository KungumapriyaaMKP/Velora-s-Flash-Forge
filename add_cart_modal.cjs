const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Add state
content = content.replace(
  "const [showCartToast, setShowCartToast] = useState(false);",
  "const [showCartToast, setShowCartToast] = useState(false);\n  const [isCartOpen, setIsCartOpen] = useState(false);"
);

// Add onClick to Navbar Cart Icon
const oldCartIconStr = `<button className="text-stone-500 hover:text-stone-900 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>}
              </button>`;
const newCartIconStr = `<button onClick={() => setIsCartOpen(true)} className="text-stone-500 hover:text-stone-900 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</span>}
              </button>`;
content = content.replace(oldCartIconStr, newCartIconStr);

// Inject the Cart Modal just below the Toast
const cartModal = `          {isCartOpen && (
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
`;

content = content.replace("          {showCartToast && (", cartModal + "\n          {showCartToast && (");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Cart modal added');
