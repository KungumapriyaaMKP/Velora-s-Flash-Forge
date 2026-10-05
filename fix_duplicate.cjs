const fs = require('fs');
let lines = fs.readFileSync('src/app/page.tsx', 'utf8').split('\n');
lines.splice(367, 44);
fs.writeFileSync('src/app/page.tsx', lines.join('\n'));
console.log('Fixed duplicate auth block');
