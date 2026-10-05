const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldHeroRegex = /\{\/\* Hero Banner \/ Flash Sale Drop \*\/\}.*?(?=\{\/\* Product Grid \*\/\})/s;
content = content.replace(oldHeroRegex, ''); // Remove it from inside <main>

const newHero = `
        {/* Full-width Hero Slideshow */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-stone-900 group">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={\`absolute inset-0 transition-opacity duration-1000 \${currentHeroSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/10">
                <span className="text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-4 drop-shadow-md">New Arrivals</span>
                <h2 className="text-5xl md:text-7xl text-white mb-6 leading-tight font-serif tracking-tight drop-shadow-lg">{slide.title}</h2>
                <p className="text-white/90 mb-10 text-lg md:text-xl max-w-2xl drop-shadow-md">{slide.desc}</p>
                <button className="px-10 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-100 transition-colors shadow-2xl tracking-wide uppercase text-sm">
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
          
          {/* Slideshow Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentHeroSlide(idx)}
                className={\`w-3 h-3 rounded-full transition-all \${currentHeroSlide === idx ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/80'}\`}
              />
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
`;

// Replace the main tag opening with the new hero + main tag opening
content = content.replace('<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">', newHero);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Fullscreen hero applied');
