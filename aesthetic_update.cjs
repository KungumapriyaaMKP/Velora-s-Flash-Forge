const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The e-commerce block starts at "if (!devMode) {"
// We'll replace specific strings within that block.

let startIdx = content.indexOf('if (!devMode) {');
let endIdx = content.indexOf('return (', startIdx + 50); // The next return is the tech dashboard one
if (startIdx === -1 || endIdx === -1) {
    console.log("Could not find bounds");
    process.exit(1);
}

let ecoBlock = content.substring(startIdx, endIdx);

// Background
ecoBlock = ecoBlock.replace(/bg-\[#fff0f5\]/g, 'bg-[#fafafa]');
ecoBlock = ecoBlock.replace(/border-pink-100/g, 'border-stone-100');
ecoBlock = ecoBlock.replace(/border-pink-200/g, 'border-stone-200');
ecoBlock = ecoBlock.replace(/border-pink-300/g, 'border-stone-200');
ecoBlock = ecoBlock.replace(/border-pink-50/g, 'border-stone-100');

// Typography
ecoBlock = ecoBlock.replace(/text-pink-900/g, 'text-stone-900');
ecoBlock = ecoBlock.replace(/text-fuchsia-500/g, 'text-stone-900');
ecoBlock = ecoBlock.replace(/text-fuchsia-600/g, 'text-stone-600');
ecoBlock = ecoBlock.replace(/text-gray-600/g, 'text-stone-500');
ecoBlock = ecoBlock.replace(/text-gray-800/g, 'text-stone-800');
ecoBlock = ecoBlock.replace(/text-pink-400/g, 'text-stone-400');

// Buttons / Badges (bg-fuchsia-500 -> bg-stone-900)
ecoBlock = ecoBlock.replace(/bg-fuchsia-500/g, 'bg-stone-900');
ecoBlock = ecoBlock.replace(/bg-fuchsia-400/g, 'bg-stone-800');
ecoBlock = ecoBlock.replace(/shadow-fuchsia-500\/30/g, 'shadow-stone-900/10');
ecoBlock = ecoBlock.replace(/bg-pink-900/g, 'bg-stone-800');
ecoBlock = ecoBlock.replace(/bg-pink-800/g, 'bg-stone-700');
ecoBlock = ecoBlock.replace(/shadow-pink-900\/20/g, 'shadow-stone-900/10');
ecoBlock = ecoBlock.replace(/bg-pink-100/g, 'bg-stone-100');
ecoBlock = ecoBlock.replace(/bg-pink-50/g, 'bg-stone-50');

// Hover states
ecoBlock = ecoBlock.replace(/hover:text-fuchsia-500/g, 'hover:text-stone-900');
ecoBlock = ecoBlock.replace(/border-fuchsia-500/g, 'border-stone-900');
ecoBlock = ecoBlock.replace(/hover:bg-pink-50/g, 'hover:bg-stone-50');
ecoBlock = ecoBlock.replace(/hover:border-pink-300/g, 'hover:border-stone-200');
ecoBlock = ecoBlock.replace(/hover:bg-fuchsia-500/g, 'hover:bg-stone-900');

// Icons
ecoBlock = ecoBlock.replace(/fill-fuchsia-500/g, 'fill-stone-900');

// Structural Elegance
ecoBlock = ecoBlock.replace(/rounded-2xl/g, 'rounded-3xl');
ecoBlock = ecoBlock.replace(/rounded-xl/g, 'rounded-2xl');

// Hero Banner - let's make it more seamless
ecoBlock = ecoBlock.replace(/p-8 md:p-12/g, 'p-8 md:p-16');

content = content.substring(0, startIdx) + ecoBlock + content.substring(endIdx);
fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log("Aesthetic applied.");
