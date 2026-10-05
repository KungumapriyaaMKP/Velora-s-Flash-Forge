const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const newArray = `const cosmeticProducts = [
  { id: 1, name: "Luminous Silk Foundation", category: "Face", price: 5299, rating: 4.8, reviews: 1204, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Velvet Matte Lip Kit", category: "Lips", price: 2499, rating: 4.9, reviews: 842, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Rosewater Hydrating Toner", category: "Skincare", price: 2650, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Celestial Highlighting Powder", category: "Face", price: 3150, rating: 4.6, reviews: 512, image: "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Advanced Night Repair Serum", category: "Skincare", price: 8699, rating: 4.9, reviews: 3200, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop" },
  { id: 6, name: "Volume Lash Mascara", category: "Eyes", price: 1999, rating: 4.5, reviews: 670, image: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=400&auto=format&fit=crop" },
  { id: 7, name: "Pro Palette Eyeshadow", category: "Eyes", price: 3750, rating: 4.8, reviews: 1100, image: "https://images.unsplash.com/photo-1512496115841-db0aafafec3f?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Dewy Glow Face Mist", category: "Skincare", price: 2350, rating: 4.4, reviews: 450, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
  { id: 9, name: "Satin Finish Lipstick", category: "Lips", price: 1850, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop" },
  { id: 10, name: "Vitamin C Brightening Serum", category: "Skincare", price: 7050, rating: 4.9, reviews: 2100, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop" },
  { id: 11, name: "Invisible UV Flawless Primer", category: "Face", price: 3499, rating: 4.6, reviews: 530, image: "https://images.unsplash.com/photo-1599733589046-10c005739ef9?q=80&w=400&auto=format&fit=crop" },
  { id: 12, name: "Precision Liquid Eyeliner", category: "Eyes", price: 1499, rating: 4.5, reviews: 1400, image: "https://images.unsplash.com/photo-1571781526291-c477eb69bfcc?q=80&w=400&auto=format&fit=crop" },
  { id: 13, name: "Gel Lip Liner", category: "Lips", price: 1250, rating: 4.4, reviews: 300, image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=400&auto=format&fit=crop" },
  { id: 14, name: "Peptide Lip Treatment", category: "Lips", price: 1350, rating: 4.9, reviews: 5200, image: "https://images.unsplash.com/photo-1615397323114-17730e238059?q=80&w=400&auto=format&fit=crop" },
  { id: 15, name: "Brow Freeze Styling Wax", category: "Eyes", price: 1899, rating: 4.7, reviews: 890, image: "https://images.unsplash.com/photo-1556228720-192a6af4e62c?q=80&w=400&auto=format&fit=crop" },
  { id: 16, name: "Radiant Cream Concealer", category: "Face", price: 2499, rating: 4.8, reviews: 1500, image: "https://images.unsplash.com/photo-1580870059867-74c598a28b02?q=80&w=400&auto=format&fit=crop" },
  { id: 17, name: "Exfoliating BHA Liquid", category: "Skincare", price: 2850, rating: 4.9, reviews: 4100, image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop" },
  { id: 18, name: "Perfecting Setting Spray", category: "Face", price: 1650, rating: 4.6, reviews: 680, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop" },
  { id: 19, name: "Plumping Lip Gloss", category: "Lips", price: 1650, rating: 4.5, reviews: 900, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop" },
  { id: 20, name: "Rose Quartz Gua Sha", category: "Skincare", price: 5650, rating: 4.8, reviews: 340, image: "https://images.unsplash.com/photo-1611078714088-771141fc765d?q=80&w=400&auto=format&fit=crop" },
];`;

const oldArrayRegex = /const cosmeticProducts = \[.*?\];/s;
content = content.replace(oldArrayRegex, newArray);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Products updated');
