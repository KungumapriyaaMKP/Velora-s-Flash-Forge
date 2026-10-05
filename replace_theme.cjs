const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace dark mode backgrounds with light aesthetic backgrounds
content = content.replace(/bg-slate-950/g, 'bg-[#fff0f5]'); // Lavender blush
content = content.replace(/bg-slate-900/g, 'bg-white');
content = content.replace(/bg-slate-800/g, 'bg-pink-100');
content = content.replace(/bg-slate-700/g, 'bg-pink-200');

// Replace borders
content = content.replace(/border-slate-800/g, 'border-pink-200');
content = content.replace(/border-slate-700/g, 'border-pink-300');

// Replace text colors
content = content.replace(/text-slate-100/g, 'text-gray-800');
content = content.replace(/text-white/g, 'text-pink-900');
content = content.replace(/text-slate-200/g, 'text-gray-700');
content = content.replace(/text-slate-300/g, 'text-gray-600');
content = content.replace(/text-slate-400/g, 'text-pink-400');
content = content.replace(/text-slate-500/g, 'text-pink-300');
content = content.replace(/text-slate-600/g, 'text-pink-400');

// Replace cyan/emerald with pink/lavender accents
content = content.replace(/cyan-500/g, 'pink-400');
content = content.replace(/cyan-400/g, 'fuchsia-500');
content = content.replace(/cyan-300/g, 'fuchsia-400');
content = content.replace(/cyan-950/g, 'pink-50');
content = content.replace(/cyan-700/g, 'pink-200');

content = content.replace(/emerald-500/g, 'purple-400');
content = content.replace(/emerald-400/g, 'purple-500');
content = content.replace(/emerald-300/g, 'purple-400');
content = content.replace(/emerald-950/g, 'purple-50');

content = content.replace(/rose-400/g, 'rose-500');
content = content.replace(/amber-400/g, 'orange-400');

// Replace Text
content = content.replace(/Velora's Flash Forge Flagship Phone X/g, "Velora's Velvet Matte Lip Kit - Limited Edition");
content = content.replace(/Snapdragon 8 Gen 3, 16GB RAM, 100 Available Units Total/g, "Cruelty-free, vegan, ultra-pigmented lip kit. 100 Available Units Total");
content = content.replace(/High-Scale Flash Sale Architecture \(10,000 Users vs 100 Units\)/g, "Limited Edition Cosmetics Drop (10,000 Users vs 100 Units)");
content = content.replace(/Velora's Flash Forge/g, "Velora Cosmetics");

// Replace Lucide Icons
content = content.replace(/<Cpu /g, "<Sparkles ");
content = content.replace(/<Zap /g, "<Heart ");
// Add Sparkles and Heart to imports if not there
if (!content.includes('Sparkles')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Sparkles, Heart } from 'lucide-react';");
}

fs.writeFileSync('src/app/page.tsx', content);
console.log('Theme updated successfully.');
