const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');

content = content.replace(/--foreground-rgb: 255, 255, 255;/g, '--foreground-rgb: 51, 51, 51;');
content = content.replace(/--background-start-rgb: 11, 15, 25;/g, '--background-start-rgb: 255, 255, 255;');
content = content.replace(/--background-end-rgb: 15, 23, 42;/g, '--background-end-rgb: 255, 240, 245;');

fs.writeFileSync('src/app/globals.css', content);
try { fs.writeFileSync('frontend/src/app/globals.css', content); } catch(e){}
console.log('globals.css updated.');
