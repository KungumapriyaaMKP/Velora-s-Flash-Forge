const https = require('https');
const fs = require('fs');

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const beauty = await fetchJSON('https://dummyjson.com/products/category/beauty');
  const skincare = await fetchJSON('https://dummyjson.com/products/category/skin-care');
  const fragrances = await fetchJSON('https://dummyjson.com/products/category/fragrances');
  
  const allProds = [...beauty.products, ...skincare.products, ...fragrances.products];
  const images = allProds.map(p => p.images[0]).filter(Boolean);
  
  let content = fs.readFileSync('src/app/page.tsx', 'utf8');
  
  const imgRegex = /https:\/\/picsum\.photos\/seed\/velora[a-z]+\/[0-9]+\/[0-9]+/g;
  let matchCount = 0;
  content = content.replace(imgRegex, () => {
    const imgUrl = images[matchCount % images.length];
    matchCount++;
    return imgUrl;
  });

  // Remove the grayscale filters
  content = content.replace(/grayscale sepia-\[\.30\]/g, '');
  content = content.replace(/grayscale sepia-\[\.20\]/g, '');
  content = content.replace(/ blur-0/g, '');
  
  fs.writeFileSync('src/app/page.tsx', content);
  try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
  console.log('Real images applied: ' + matchCount);
}

run();
