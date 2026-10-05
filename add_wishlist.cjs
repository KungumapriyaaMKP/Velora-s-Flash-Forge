const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add Wishlist State & removeFromCart logic
const stateLogic = `
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(wId => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const removeFromCart = (id: number) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      const newCart = [...cartItems];
      newCart.splice(index, 1);
      setCartItems(newCart);
    }
  };
`;
content = content.replace(
  "const [showCartToast, setShowCartToast] = useState(false);",
  "const [showCartToast, setShowCartToast] = useState(false);" + stateLogic
);

// 2. Add Wishlist Icon to Navbar
// Current Navbar search block:
const navbarSearch = `<div className="hidden md:flex items-center gap-4 relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3" />`;
const newNavbarSearch = `<div className="hidden md:flex items-center gap-6">
              <button className="text-stone-500 hover:text-stone-900 relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </button>
            <div className="hidden md:flex items-center gap-4 relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3" />`;
content = content.replace(navbarSearch, newNavbarSearch);

// 3. Update the Heart button on the product card
const oldHeartRegex = /<button className="absolute top-3 right-3 p-2 rounded-full bg-white\/80.*?>\s*<Heart className="w-4 h-4" \/>\s*<\/button>/;
const newHeart = `<button onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 transition-all z-10">
                    <Heart className={\`w-4 h-4 \${wishlist.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-stone-400 hover:text-red-500'}\`} />
                  </button>`;
content = content.replace(oldHeartRegex, newHeart);

// 4. Update the Cart Button on the product card to show quantities
const oldCartBtnRegex = /<button onClick=\{\(e\) => \{ e\.stopPropagation\(\); addToCart\(prod\); \}\} className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">\s*<ShoppingCart className="w-4 h-4" \/>\s*<\/button>/;
const newCartBtn = `{(() => {
                    const cartCountForProd = cartItems.filter(item => item.id === prod.id).length;
                    if (cartCountForProd > 0) {
                      return (
                        <div className="flex items-center gap-2 bg-stone-100 rounded-full px-1 py-1">
                          <button onClick={(e) => { e.stopPropagation(); removeFromCart(prod.id); }} className="w-6 h-6 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold shadow-sm hover:bg-stone-200">-</button>
                          <span className="text-sm font-bold text-stone-900 w-4 text-center">{cartCountForProd}</span>
                          <button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold shadow-sm hover:bg-stone-800">+</button>
                        </div>
                      );
                    }
                    return (
                      <button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    );
                  })()}`;
content = content.replace(oldCartBtnRegex, newCartBtn);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Wishlist & Cart increment added');
