const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldCheckoutRegex = /<button className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900\/10">\s*Proceed to Checkout\s*<\/button>/;

const newCheckout = `
                    {purchaseStep === 'idle' && (
                      <button 
                        onClick={handleUserReservation}
                        disabled={isPurchasing || stockState.availableQuantity <= 0}
                        className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 flex justify-center items-center gap-2 disabled:bg-stone-300 disabled:text-stone-500"
                      >
                        {isPurchasing ? 'Processing...' : (stockState.availableQuantity > 0 ? 'Proceed to Checkout' : 'Sold Out')}
                      </button>
                    )}

                    {purchaseStep === 'reserved' && (
                      <button 
                        onClick={handleUserPayment}
                        disabled={isPurchasing}
                        className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 flex justify-center items-center gap-2"
                      >
                        {isPurchasing ? 'Processing...' : 'Complete Payment'}
                      </button>
                    )}

                    {(purchaseStep === 'confirmed' || purchaseStep === 'failed') && (
                      <div className="flex gap-2">
                        <div className={\`flex-1 p-4 rounded-2xl border flex items-center justify-center text-sm font-bold \${purchaseStep === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}\`}>
                          {purchaseStep === 'confirmed' ? 'Order Confirmed!' : 'Payment Failed!'}
                        </div>
                        <button onClick={() => { resetUserSession(); setCartItems([]); }} className="px-4 py-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-2xl transition-all flex items-center justify-center"><RefreshCw className="w-5 h-5" /></button>
                      </div>
                    )}

                    {notification && (
                      <div className="text-xs font-mono text-stone-500 mt-4 text-center border-t border-stone-200 pt-3">
                        System: {notification.message}
                      </div>
                    )}
`;

content = content.replace(oldCheckoutRegex, newCheckout);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Checkout fixed');
