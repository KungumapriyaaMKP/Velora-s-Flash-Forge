const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const productsRegex = /const cosmeticProducts = \[.*?\];/s;

const newArray = `const cosmeticProducts = [
  { id: 1, name: "Luminous Silk Foundation", category: "Face", price: 5299, rating: 4.8, reviews: 1204, image: "https://image.pollinations.ai/prompt/luxury%20bottle%20of%20luminous%20silk%20foundation%20makeup%20aesthetic%20minimalist%20photography?width=400&height=400&nologo=true" },
  { id: 2, name: "Velvet Matte Lip Kit", category: "Lips", price: 2499, rating: 4.9, reviews: 842, image: "https://image.pollinations.ai/prompt/velvet%20matte%20lip%20kit%20lipstick%20cosmetics%20aesthetic%20minimalist%20photography?width=400&height=400&nologo=true" },
  { id: 3, name: "Rosewater Hydrating Toner", category: "Skincare", price: 2650, rating: 4.7, reviews: 890, image: "https://image.pollinations.ai/prompt/rosewater%20hydrating%20toner%20glass%20bottle%20skincare%20minimalist%20photography?width=400&height=400&nologo=true" },
  { id: 4, name: "Celestial Highlighting Powder", category: "Face", price: 3150, rating: 4.6, reviews: 512, image: "https://image.pollinations.ai/prompt/celestial%20highlighting%20powder%20makeup%20compact%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 5, name: "Advanced Night Repair Serum", category: "Skincare", price: 8699, rating: 4.9, reviews: 3200, image: "https://image.pollinations.ai/prompt/advanced%20night%20repair%20serum%20dropper%20bottle%20skincare%20minimalist?width=400&height=400&nologo=true" },
  { id: 6, name: "Volume Lash Mascara", category: "Eyes", price: 1999, rating: 4.5, reviews: 670, image: "https://image.pollinations.ai/prompt/luxury%20volume%20lash%20mascara%20tube%20makeup%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 7, name: "Pro Palette Eyeshadow", category: "Eyes", price: 3750, rating: 4.8, reviews: 1100, image: "https://image.pollinations.ai/prompt/pro%20palette%20eyeshadow%20makeup%20colors%20aesthetic%20minimalist%20photography?width=400&height=400&nologo=true" },
  { id: 8, name: "Dewy Glow Face Mist", category: "Skincare", price: 2350, rating: 4.4, reviews: 450, image: "https://image.pollinations.ai/prompt/dewy%20glow%20face%20mist%20spray%20bottle%20skincare%20minimalist%20photography?width=400&height=400&nologo=true" },
  { id: 9, name: "Satin Finish Lipstick", category: "Lips", price: 1850, rating: 4.7, reviews: 890, image: "https://image.pollinations.ai/prompt/satin%20finish%20lipstick%20luxury%20cosmetics%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 10, name: "Vitamin C Brightening Serum", category: "Skincare", price: 7050, rating: 4.9, reviews: 2100, image: "https://image.pollinations.ai/prompt/vitamin%20c%20brightening%20serum%20orange%20bottle%20skincare%20aesthetic?width=400&height=400&nologo=true" },
  { id: 11, name: "Invisible UV Flawless Primer", category: "Face", price: 3499, rating: 4.6, reviews: 530, image: "https://image.pollinations.ai/prompt/invisible%20uv%20flawless%20primer%20makeup%20tube%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 12, name: "Precision Liquid Eyeliner", category: "Eyes", price: 1499, rating: 4.5, reviews: 1400, image: "https://image.pollinations.ai/prompt/precision%20liquid%20eyeliner%20pen%20makeup%20aesthetic%20minimalist?width=400&height=400&nologo=true" },
  { id: 13, name: "Gel Lip Liner", category: "Lips", price: 1250, rating: 4.4, reviews: 300, image: "https://image.pollinations.ai/prompt/gel%20lip%20liner%20pencil%20makeup%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 14, name: "Peptide Lip Treatment", category: "Lips", price: 1350, rating: 4.9, reviews: 5200, image: "https://image.pollinations.ai/prompt/peptide%20lip%20treatment%20gloss%20tube%20skincare%20aesthetic%20minimalist?width=400&height=400&nologo=true" },
  { id: 15, name: "Brow Freeze Styling Wax", category: "Eyes", price: 1899, rating: 4.7, reviews: 890, image: "https://image.pollinations.ai/prompt/brow%20freeze%20styling%20wax%20makeup%20jar%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 16, name: "Radiant Cream Concealer", category: "Face", price: 2499, rating: 4.8, reviews: 1500, image: "https://image.pollinations.ai/prompt/radiant%20cream%20concealer%20wand%20makeup%20aesthetic%20minimalist?width=400&height=400&nologo=true" },
  { id: 17, name: "Exfoliating BHA Liquid", category: "Skincare", price: 2850, rating: 4.9, reviews: 4100, image: "https://image.pollinations.ai/prompt/exfoliating%20bha%20liquid%20toner%20bottle%20skincare%20aesthetic?width=400&height=400&nologo=true" },
  { id: 18, name: "Perfecting Setting Spray", category: "Face", price: 1650, rating: 4.6, reviews: 680, image: "https://image.pollinations.ai/prompt/perfecting%20setting%20spray%20bottle%20makeup%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 19, name: "Plumping Lip Gloss", category: "Lips", price: 1650, rating: 4.5, reviews: 900, image: "https://image.pollinations.ai/prompt/plumping%20lip%20gloss%20wand%20makeup%20aesthetic%20photography?width=400&height=400&nologo=true" },
  { id: 20, name: "Rose Quartz Gua Sha", category: "Skincare", price: 5650, rating: 4.8, reviews: 340, image: "https://image.pollinations.ai/prompt/rose%20quartz%20gua%20sha%20stone%20skincare%20aesthetic%20minimalist?width=400&height=400&nologo=true" },
];`;

content = content.replace(productsRegex, newArray);

// Let's also update the Hero Slideshow images to use these same beautiful AI generated ones
const heroRegex = /const heroSlides = \[.*?\];/s;
const newHeroSlides = `const heroSlides = [
    {
      title: "Velvet Matte Lip Kit",
      desc: "Our highly anticipated cruelty-free, vegan lip kit. Ultra-pigmented and long-lasting.",
      price: 2499,
      image: "https://image.pollinations.ai/prompt/velvet%20matte%20lip%20kit%20lipstick%20cosmetics%20aesthetic%20minimalist%20photography?width=1200&height=800&nologo=true"
    },
    {
      title: "Luminous Silk Foundation",
      desc: "Achieve a flawless, radiant complexion with our award-winning lightweight silk foundation.",
      price: 5299,
      image: "https://image.pollinations.ai/prompt/luxury%20bottle%20of%20luminous%20silk%20foundation%20makeup%20aesthetic%20minimalist%20photography?width=1200&height=800&nologo=true"
    },
    {
      title: "Advanced Night Serum",
      desc: "Wake up to beautiful skin every day. The #1 facial serum for a youthful, hydrating glow.",
      price: 8699,
      image: "https://image.pollinations.ai/prompt/advanced%20night%20repair%20serum%20dropper%20bottle%20skincare%20minimalist?width=1200&height=800&nologo=true"
    }
  ];`;
content = content.replace(heroRegex, newHeroSlides);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Images fixed');
