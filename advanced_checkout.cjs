const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add paymentMethod state
const stateInjection = `  const [paymentMethod, setPaymentMethod] = useState('card');`;
content = content.replace("  const [isCartOpen, setIsCartOpen] = useState(false);", "  const [isCartOpen, setIsCartOpen] = useState(false);\n" + stateInjection);


// 2. Replace the reserved step in the cart drawer
const oldReservedRegex = /\{purchaseStep === 'reserved' && \([\s\S]*?<\/button>\s*\)\}/;

const newReserved = `{purchaseStep === 'reserved' && (
                      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-stone-100 p-3 rounded-xl border border-stone-200">
                          <div className="text-xs text-stone-500 font-bold uppercase tracking-wider mb-1">Stock Reserved</div>
                          <div className="font-mono text-xs text-stone-900 font-bold break-all">{lastReservationId}</div>
                          <div className="text-xs text-stone-400 mt-1">Your items are locked for 5:00</div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-bold text-stone-900 mb-2">Payment Method</div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setPaymentMethod('card')} className={\`py-2 px-3 border rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'card' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'}\`}>
                              <CreditCard className="w-4 h-4" /> Card
                            </button>
                            <button onClick={() => setPaymentMethod('upi')} className={\`py-2 px-3 border rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all \${paymentMethod === 'upi' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'}\`}>
                              UPI
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={handleUserPayment}
                          disabled={isPurchasing}
                          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 flex justify-center items-center gap-2 mt-2"
                        >
                          {isPurchasing ? 'Processing Payment...' : 'Confirm & Pay'}
                        </button>
                      </div>
                    )}`;

content = content.replace(oldReservedRegex, newReserved);


// 3. Inject the Success Fullscreen Modal just outside the Drawer
const oldConfirmedDrawerRegex = /\{\(purchaseStep === 'confirmed' \|\| purchaseStep === 'failed'\) && \([\s\S]*?<\/div>\s*\)\}/;

const newConfirmedDrawer = `
                    {purchaseStep === 'failed' && (
                      <div className="flex gap-2">
                        <div className="flex-1 p-4 rounded-2xl border flex items-center justify-center text-sm font-bold bg-red-50 border-red-200 text-red-700">
                          Payment Failed!
                        </div>
                        <button onClick={() => { resetUserSession(); }} className="px-4 py-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-2xl transition-all flex items-center justify-center"><RefreshCw className="w-5 h-5" /></button>
                      </div>
                    )}
`;
content = content.replace(oldConfirmedDrawerRegex, newConfirmedDrawer);

// The Fullscreen Blast Modal goes right before </main>
const fullScreenSuccess = `
          {purchaseStep === 'confirmed' && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md transition-opacity"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full animate-in zoom-in-90 fade-in duration-500 flex flex-col items-center">
                <div className="absolute -top-10">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2 tracking-tight mt-8">Order Placed!</h2>
                <p className="text-stone-500 mb-2">Thank you for your purchase.</p>
                <div className="font-mono text-xs text-stone-400 mb-8 break-all">{lastReservationId}</div>
                
                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 w-full mb-8">
                  <div className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-2">Expected Delivery</div>
                  <div className="text-xl font-extrabold text-stone-900">Arriving in {Math.floor(Math.random() * 4) + 2} days</div>
                </div>
                
                <button 
                  onClick={() => { resetUserSession(); setCartItems([]); setIsCartOpen(false); }}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
`;
content = content.replace("          {isCartOpen && (", fullScreenSuccess + "\n          {isCartOpen && (");

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Advanced checkout implemented');
