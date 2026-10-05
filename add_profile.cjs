const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add Package to lucide-react imports
const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
content = content.replace(importRegex, (match, p1) => {
  if (!p1.includes('Package')) {
    return `import {${p1}, Package} from 'lucide-react';`;
  }
  return match;
});

// 2. Add State
const stateInjection = `  const [orders, setOrders] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);`;
content = content.replace("  const [wishlist, setWishlist] = useState<number[]>([]);", "  const [wishlist, setWishlist] = useState<number[]>([]);\n" + stateInjection);

// 3. Update Success Modal onClick
const oldSuccessBtn = /<button \s*onClick=\{\(\) => \{ resetUserSession\(\); setCartItems\(\[\]\); setIsCartOpen\(false\); \}\}\s*className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl"\s*>/;
const newSuccessBtn = `<button 
                  onClick={() => { 
                    setOrders(prev => [{ id: lastReservationId, items: [...cartItems], date: new Date().toLocaleDateString(), status: 'Preparing for Dispatch' }, ...prev]);
                    resetUserSession(); 
                    setCartItems([]); 
                    setIsCartOpen(false); 
                  }}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl"
                >`;
content = content.replace(oldSuccessBtn, newSuccessBtn);

// 4. Add onClick to User Icon
const oldUserBtn = /<button className="text-stone-500 hover:text-stone-900"><User className="w-5 h-5" \/><\/button>/;
const newUserBtn = `<button onClick={() => setIsProfileOpen(true)} className="text-stone-500 hover:text-stone-900"><User className="w-5 h-5" /></button>`;
content = content.replace(oldUserBtn, newUserBtn);

// 5. Inject Profile Drawer
const profileDrawer = `
          {isProfileOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity" onClick={() => setIsProfileOpen(false)}></div>
              <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in fade-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                  <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">Your Account</h2>
                  <button onClick={() => setIsProfileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-500 hover:bg-stone-200 hover:text-stone-900 font-bold shadow-sm">X</button>
                </div>
                <div className="p-6 border-b border-stone-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-stone-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Guest User</h3>
                    <p className="text-sm text-stone-500">guest@velora.com</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
                  <h3 className="text-sm font-bold tracking-widest text-stone-400 uppercase mb-4">Your Orders</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center text-stone-400 mt-10 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                      <Package className="w-10 h-10 mx-auto text-stone-200 mb-3" />
                      <p>You haven't placed any orders yet.</p>
                      <button onClick={() => setIsProfileOpen(false)} className="mt-4 px-4 py-2 bg-stone-100 text-stone-600 rounded-lg text-sm font-bold hover:bg-stone-200">Start Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-xs text-stone-400 font-bold uppercase mb-1">Order {order.id}</div>
                              <div className="text-xs font-mono text-stone-500">{order.date}</div>
                            </div>
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">{order.status}</span>
                          </div>
                          <div className="flex -space-x-2 overflow-hidden mb-4 pl-2">
                            {order.items.slice(0, 4).map((item, i) => (
                              <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white object-cover bg-stone-100 shadow-sm" src={item.image} alt="" />
                            ))}
                            {order.items.length > 4 && (
                              <div className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-stone-100 text-xs flex items-center justify-center font-bold text-stone-600 shadow-sm">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-bold text-stone-900 border-t border-stone-50 pt-3 flex justify-between items-center">
                            <span className="text-stone-500 font-medium">{order.items.length} items</span>
                            <span className="text-lg">₹{order.items.reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
`;
content = content.replace("          {isCartOpen && (", profileDrawer + "\n          {isCartOpen && (");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Profile drawer added');
