const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Remove rogue Exit Developer Mode button from the first header
const regex = /<button onClick=\{\(\) => setDevMode\(false\)\} className="ml-auto px-4 py-2 text-sm font-bold bg-fuchsia-500 text-white rounded-full hover:bg-fuchsia-400 transition shadow-lg flex items-center gap-2">\s*Exit Developer Mode\s*<\/button>/g;
content = content.replace(regex, '');

// Now we need to inject the Exit Developer Mode button into the Technical Header (which is the SECOND <header> in the file)
// Let's find: <header className="border-b border-pink-100 bg-white/80 backdrop-blur sticky top-0 z-50">
const techHeaderStart = '<header className="border-b border-pink-100 bg-white/80 backdrop-blur sticky top-0 z-50">';
const newTechHeaderStart = techHeaderStart + '\n        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm">\n          <span className="font-mono">Developer Mode Active</span>\n          <button onClick={() => setDevMode(false)} className="bg-fuchsia-500 hover:bg-fuchsia-400 px-3 py-1 rounded font-bold text-xs transition">Exit Developer Mode</button>\n        </div>';
if (content.includes(techHeaderStart) && !content.includes('Developer Mode Active')) {
  content = content.replace(techHeaderStart, newTechHeaderStart);
}

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Fixed headers');
