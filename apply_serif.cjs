const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The Logo
content = content.replace(
  '<h1 className="text-2xl font-bold tracking-tight text-stone-900">Velora</h1>',
  '<h1 className="text-3xl tracking-tight text-stone-900 font-serif">Velora</h1>'
);

// The Hero Title
content = content.replace(
  '<h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">Velvet Matte Lip Kit</h2>',
  '<h2 className="text-4xl md:text-6xl text-stone-900 mb-4 leading-tight font-serif tracking-tight">Velvet Matte Lip Kit</h2>'
);

// The Trending Title
content = content.replace(
  '<h3 className="text-2xl font-bold text-stone-900">Trending Now</h3>',
  '<h3 className="text-3xl text-stone-900 font-serif tracking-tight">Trending Now</h3>'
);

// Make the product titles slightly heavier to match the modern look
content = content.replace(
  '<h4 className="text-stone-800 font-bold mb-1 truncate">{prod.name}</h4>',
  '<h4 className="text-stone-900 font-semibold mb-1 truncate">{prod.name}</h4>'
);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Fonts updated');
