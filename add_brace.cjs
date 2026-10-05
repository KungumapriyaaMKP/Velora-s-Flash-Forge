const fs = require('fs');
let txt = fs.readFileSync('src/app/page.tsx', 'utf8');
txt = txt + '\n}\n';
fs.writeFileSync('src/app/page.tsx', txt);
console.log('Restored closing brace');
