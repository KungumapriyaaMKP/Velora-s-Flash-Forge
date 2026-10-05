const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add Search and Category states
content = content.replace(
  "const [devMode, setDevMode] = useState(false);",
  "const [devMode, setDevMode] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');\n  const [activeCategory, setActiveCategory] = useState('All');"
);

// 2. Modify Navbar to use dynamic state
const oldNavbar = `              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-fuchsia-500 text-fuchsia-500 border-b-2 border-fuchsia-500 pb-1">Shop All</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Bestsellers</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Skincare</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Makeup</a>
                <a href="#" className="hover:text-fuchsia-500 pb-1">Sets</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative">
                <input type="text" placeholder="Search for products..." className="pl-10 pr-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300 w-64" />`;

const newNavbar = `              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <button onClick={() => setActiveCategory('All')} className={\`hover:text-fuchsia-500 pb-1 \${activeCategory === 'All' ? 'text-fuchsia-500 border-b-2 border-fuchsia-500' : ''}\`}>Shop All</button>
                <button onClick={() => setActiveCategory('Skincare')} className={\`hover:text-fuchsia-500 pb-1 \${activeCategory === 'Skincare' ? 'text-fuchsia-500 border-b-2 border-fuchsia-500' : ''}\`}>Skincare</button>
                <button onClick={() => setActiveCategory('Face')} className={\`hover:text-fuchsia-500 pb-1 \${activeCategory === 'Face' ? 'text-fuchsia-500 border-b-2 border-fuchsia-500' : ''}\`}>Face</button>
                <button onClick={() => setActiveCategory('Lips')} className={\`hover:text-fuchsia-500 pb-1 \${activeCategory === 'Lips' ? 'text-fuchsia-500 border-b-2 border-fuchsia-500' : ''}\`}>Lips</button>
                <button onClick={() => setActiveCategory('Eyes')} className={\`hover:text-fuchsia-500 pb-1 \${activeCategory === 'Eyes' ? 'text-fuchsia-500 border-b-2 border-fuchsia-500' : ''}\`}>Eyes</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative">
                <input 
                  type="text" 
                  placeholder="Search for products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-pink-50 border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-300 w-64" 
                />`;

content = content.replace(oldNavbar, newNavbar);

// 3. Filter the grid products
content = content.replace(
  "{cosmeticProducts.map(prod => (",
  `{cosmeticProducts
    .filter(prod => {
      const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'All' || prod.category === activeCategory;
      return matchSearch && matchCategory;
    })
    .map(prod => (`
);

// 4. Fix the Developer Mode header issue.
// The old UI had an entire <header> element. Let's make the Exit button fit beautifully in the dev mode header.
const oldExitBtn = `          <button onClick={() => setDevMode(false)} className="ml-4 px-3 py-1.5 text-xs font-semibold bg-fuchsia-500 text-white rounded-full hover:bg-fuchsia-400 transition shadow-lg">
            Exit Developer Mode
          </button>`;

const betterExitBtn = `
          <button onClick={() => setDevMode(false)} className="ml-auto px-4 py-2 text-sm font-bold bg-fuchsia-500 text-white rounded-full hover:bg-fuchsia-400 transition shadow-lg flex items-center gap-2">
            Exit Developer Mode
          </button>`;

content = content.replace(oldExitBtn, betterExitBtn);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Done dynamicizing page.tsx');
