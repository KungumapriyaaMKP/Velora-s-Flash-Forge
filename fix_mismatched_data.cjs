const https = require('https');
const fs = require('fs');

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const beauty = await fetchJSON('https://dummyjson.com/products/category/beauty');
    const skincare = await fetchJSON('https://dummyjson.com/products/category/skin-care');
    const fragrances = await fetchJSON('https://dummyjson.com/products/category/fragrances');
    
    let allProds = [...beauty.products, ...skincare.products, ...fragrances.products];
    
    // Format into our cosmeticProducts array
    const mapped = allProds.map(p => {
        let cat = "Face";
        if (p.category === 'fragrances') cat = "Skincare";
        if (p.category === 'skin-care') cat = "Skincare";
        if (p.title.toLowerCase().includes('lip')) cat = "Lips";
        if (p.title.toLowerCase().includes('eye') || p.title.toLowerCase().includes('mascara')) cat = "Eyes";

        return `{ id: ${p.id}, name: ${JSON.stringify(p.title)}, category: "${cat}", price: ${Math.floor(p.price * 80)}, rating: ${p.rating}, reviews: ${Math.floor(Math.random() * 2000) + 100}, image: "${p.images[0]}" }`;
    });

    const productsStr = `const cosmeticProducts = [\n  ${mapped.join(',\n  ')}\n];`;

    // Make hero slides from the 3 best ones
    const p1 = allProds.find(p => p.id === 1); // Essence Mascara
    const p2 = allProds.find(p => p.category === 'fragrances'); // Chanel or similar
    const p3 = allProds.find(p => p.category === 'skin-care'); // Olay or similar

    const heroStr = `const heroSlides = [
    {
      title: ${JSON.stringify(p1.title)},
      desc: ${JSON.stringify(p1.description)},
      price: ${Math.floor(p1.price * 80)},
      image: "${p1.images[0]}"
    },
    {
      title: ${JSON.stringify(p2.title)},
      desc: ${JSON.stringify(p2.description)},
      price: ${Math.floor(p2.price * 80)},
      image: "${p2.images[0]}"
    },
    {
      title: ${JSON.stringify(p3.title)},
      desc: ${JSON.stringify(p3.description)},
      price: ${Math.floor(p3.price * 80)},
      image: "${p3.images[0]}"
    }
  ];`;

    let content = fs.readFileSync('src/app/page.tsx', 'utf8');
    
    content = content.replace(/const cosmeticProducts = \[[\s\S]*?\];/, productsStr);
    content = content.replace(/const heroSlides = \[[\s\S]*?\];/, heroStr);

    fs.writeFileSync('src/app/page.tsx', content);
    try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
    console.log('Successfully synced data with matching titles and images.');
  } catch (err) {
    console.error(err);
  }
}

run();
