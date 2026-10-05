const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Change Hero Banner Price
content = content.replace(/\$29\.99/g, '₹2,499');

// 2. Change Payment Payload Amount
content = content.replace(/amount: 299\.99/g, 'amount: 2499.00');

// 3. Change Product Grid Symbol and format
// From: <span className="font-extrabold text-stone-900">$\${prod.price.toFixed(2)}</span>
// To: <span className="font-extrabold text-stone-900">₹\${prod.price.toLocaleString('en-IN')}</span>
content = content.replace(/\$\\\$\{prod\.price\.toFixed\(2\)\}/g, '₹\\${prod.price.toLocaleString(\\\'en-IN\\\')}');

// 4. Update the products array to have Rupee prices (multiplying by ~83)
content = content.replace(/price: 64\.00/g, 'price: 5299');
content = content.replace(/price: 29\.99/g, 'price: 2499');
content = content.replace(/price: 32\.00/g, 'price: 2650');
content = content.replace(/price: 38\.00/g, 'price: 3150');
content = content.replace(/price: 105\.00/g, 'price: 8699');
content = content.replace(/price: 24\.00/g, 'price: 1999');
content = content.replace(/price: 45\.00/g, 'price: 3750');
content = content.replace(/price: 28\.00/g, 'price: 2350');
content = content.replace(/price: 22\.00/g, 'price: 1850');
content = content.replace(/price: 85\.00/g, 'price: 7050');
content = content.replace(/price: 42\.00/g, 'price: 3499');
content = content.replace(/price: 18\.00/g, 'price: 1499');
content = content.replace(/price: 15\.00/g, 'price: 1250');
content = content.replace(/price: 16\.00/g, 'price: 1350');
content = content.replace(/price: 23\.00/g, 'price: 1899');
content = content.replace(/price: 30\.00/g, 'price: 2499');
content = content.replace(/price: 34\.00/g, 'price: 2850');
content = content.replace(/price: 20\.00/g, 'price: 1650');
content = content.replace(/price: 68\.00/g, 'price: 5650');

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Rupee conversion complete.');
