const fs = require('fs');
let txt = fs.readFileSync('src/app/page.tsx', 'utf8');
txt = txt.replace('const [cartItems, setCartItems] = useState([]);', 'const [cartItems, setCartItems] = useState<any[]>([]);');
fs.writeFileSync('src/app/page.tsx', txt);
fs.writeFileSync('frontend/src/app/page.tsx', txt);
console.log('Fixed TS');
