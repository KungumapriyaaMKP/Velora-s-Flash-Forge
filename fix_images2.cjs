const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const productsRegex = /const cosmeticProducts = \[.*?\];/s;

const newArray = `const cosmeticProducts = [
  { id: 1, name: "Luminous Silk Foundation", category: "Face", price: 5299, rating: 4.8, reviews: 1204, image: "https://picsum.photos/seed/velorafound/800/800" },
  { id: 2, name: "Velvet Matte Lip Kit", category: "Lips", price: 2499, rating: 4.9, reviews: 842, image: "https://picsum.photos/seed/veloralip/800/800" },
  { id: 3, name: "Rosewater Hydrating Toner", category: "Skincare", price: 2650, rating: 4.7, reviews: 890, image: "https://picsum.photos/seed/veloratoner/800/800" },
  { id: 4, name: "Celestial Highlighting Powder", category: "Face", price: 3150, rating: 4.6, reviews: 512, image: "https://picsum.photos/seed/velorahigh/800/800" },
  { id: 5, name: "Advanced Night Repair Serum", category: "Skincare", price: 8699, rating: 4.9, reviews: 3200, image: "https://picsum.photos/seed/veloraserum/800/800" },
  { id: 6, name: "Volume Lash Mascara", category: "Eyes", price: 1999, rating: 4.5, reviews: 670, image: "https://picsum.photos/seed/veloramasc/800/800" },
  { id: 7, name: "Pro Palette Eyeshadow", category: "Eyes", price: 3750, rating: 4.8, reviews: 1100, image: "https://picsum.photos/seed/veloraeye/800/800" },
  { id: 8, name: "Dewy Glow Face Mist", category: "Skincare", price: 2350, rating: 4.4, reviews: 450, image: "https://picsum.photos/seed/veloramist/800/800" },
  { id: 9, name: "Satin Finish Lipstick", category: "Lips", price: 1850, rating: 4.7, reviews: 890, image: "https://picsum.photos/seed/velorasatin/800/800" },
  { id: 10, name: "Vitamin C Brightening Serum", category: "Skincare", price: 7050, rating: 4.9, reviews: 2100, image: "https://picsum.photos/seed/veloravitc/800/800" },
  { id: 11, name: "Invisible UV Flawless Primer", category: "Face", price: 3499, rating: 4.6, reviews: 530, image: "https://picsum.photos/seed/velorauv/800/800" },
  { id: 12, name: "Precision Liquid Eyeliner", category: "Eyes", price: 1499, rating: 4.5, reviews: 1400, image: "https://picsum.photos/seed/veloraline/800/800" },
  { id: 13, name: "Gel Lip Liner", category: "Lips", price: 1250, rating: 4.4, reviews: 300, image: "https://picsum.photos/seed/veloragellip/800/800" },
  { id: 14, name: "Peptide Lip Treatment", category: "Lips", price: 1350, rating: 4.9, reviews: 5200, image: "https://picsum.photos/seed/velorapept/800/800" },
  { id: 15, name: "Brow Freeze Styling Wax", category: "Eyes", price: 1899, rating: 4.7, reviews: 890, image: "https://picsum.photos/seed/velorabrow/800/800" },
  { id: 16, name: "Radiant Cream Concealer", category: "Face", price: 2499, rating: 4.8, reviews: 1500, image: "https://picsum.photos/seed/veloraconceal/800/800" },
  { id: 17, name: "Exfoliating BHA Liquid", category: "Skincare", price: 2850, rating: 4.9, reviews: 4100, image: "https://picsum.photos/seed/velorabha/800/800" },
  { id: 18, name: "Perfecting Setting Spray", category: "Face", price: 1650, rating: 4.6, reviews: 680, image: "https://picsum.photos/seed/veloraspray/800/800" },
  { id: 19, name: "Plumping Lip Gloss", category: "Lips", price: 1650, rating: 4.5, reviews: 900, image: "https://picsum.photos/seed/veloragloss/800/800" },
  { id: 20, name: "Rose Quartz Gua Sha", category: "Skincare", price: 5650, rating: 4.8, reviews: 340, image: "https://picsum.photos/seed/veloragua/800/800" },
];`;

content = content.replace(productsRegex, newArray);

const heroRegex = /const heroSlides = \[.*?\];/s;
const newHeroSlides = `const heroSlides = [
    {
      title: "Velvet Matte Lip Kit",
      desc: "Our highly anticipated cruelty-free, vegan lip kit. Ultra-pigmented and long-lasting.",
      price: 2499,
      image: "https://picsum.photos/seed/veloralip/1200/800"
    },
    {
      title: "Luminous Silk Foundation",
      desc: "Achieve a flawless, radiant complexion with our award-winning lightweight silk foundation.",
      price: 5299,
      image: "https://picsum.photos/seed/velorafound/1200/800"
    },
    {
      title: "Advanced Night Serum",
      desc: "Wake up to beautiful skin every day. The #1 facial serum for a youthful, hydrating glow.",
      price: 8699,
      image: "https://picsum.photos/seed/veloraserum/1200/800"
    }
  ];`;
content = content.replace(heroRegex, newHeroSlides);

// Add grayscale and contrast filters to images so they look somewhat elegant even if they are random landscapes
content = content.replace(
  `className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"`,
  `className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale sepia-[.30]" blur-0`
);

content = content.replace(
  `className="w-full h-full object-cover opacity-80"`,
  `className="w-full h-full object-cover opacity-80 grayscale sepia-[.20]"`
);

content = content.replace(
  `className="absolute inset-0 w-full h-full object-cover"`,
  `className="absolute inset-0 w-full h-full object-cover grayscale sepia-[.30]"`
);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Images fixed with picsum');
