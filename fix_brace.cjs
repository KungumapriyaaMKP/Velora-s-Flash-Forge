const fs = require('fs');
let txt = fs.readFileSync('src/app/page.tsx', 'utf8');
txt = txt.trim();
if (txt.endsWith('}')) {
  txt = txt.slice(0, -1);
}
fs.writeFileSync('src/app/page.tsx', txt);
console.log('Extra brace removed from EOF');
