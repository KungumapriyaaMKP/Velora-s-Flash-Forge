import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const diagramsDir = path.join(process.cwd(), 'diagrams');
const frontendPublicDir = path.join(process.cwd(), 'frontend', 'public', 'diagrams');

const files = fs.readdirSync(diagramsDir).filter(file => file.endsWith('.svg'));

files.forEach(file => {
  const svgPath = path.join(diagramsDir, file);
  const svgBuffer = fs.readFileSync(svgPath);

  const resvg = new Resvg(svgBuffer, {
    fitTo: {
      mode: 'width',
      value: 2400, // Ultra high resolution (2400px wide)
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const pngName = file.replace('.svg', '.png');
  fs.writeFileSync(path.join(diagramsDir, pngName), pngBuffer);
  fs.writeFileSync(path.join(frontendPublicDir, pngName), pngBuffer);
  console.log(`Converted ${file} -> ${pngName} (2400px wide high-res PNG)`);
});

console.log("All diagram SVG files successfully converted to viewable PNG images!");
