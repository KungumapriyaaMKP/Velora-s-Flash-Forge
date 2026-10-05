const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Ensure ArrowRight is imported
const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
content = content.replace(importRegex, (match, p1) => {
  if (!p1.includes('ArrowRight')) {
    return `import {${p1}, ArrowRight} from 'lucide-react';`;
  }
  return match;
});

const oldAuthBlockRegex = /if \(\!isAuthenticated\) \{[\s\S]*?return \(/;

const newAuthBlock = `if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-white flex relative overflow-hidden font-sans">
          
          {/* Left Side: High-Fashion Image */}
          <div className="hidden lg:flex w-1/2 relative bg-stone-900 overflow-hidden group">
            <img 
              src="https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg" 
              alt="Velora Beauty" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
            <div className="absolute bottom-16 left-16 right-16 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <h2 className="text-6xl font-serif text-white mb-6 leading-[1.1] tracking-tight">Redefine your<br/>beauty standards.</h2>
              <p className="text-stone-300 text-xl font-light tracking-wide">Join the exclusive Velora community for early access to flash sales and limited edition collections.</p>
            </div>
            <div className="absolute top-10 left-16 text-white font-serif text-4xl font-bold tracking-tight z-10">Velora</div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <div className="lg:hidden text-center mb-12">
                <h1 className="text-5xl tracking-tight text-stone-900 font-serif mb-2">Velora</h1>
              </div>

              <div className="mb-12">
                <h1 className="text-4xl font-serif text-stone-900 mb-3">{authMode === 'login' ? 'Welcome Back.' : 'Create Account.'}</h1>
                <p className="text-stone-500 text-lg">{authMode === 'login' ? 'Enter your details to access your account.' : 'Join us to get started with Velora.'}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-6">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" required className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors text-stone-900 placeholder-stone-400 text-lg" placeholder="Jane Doe" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" required className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors text-stone-900 placeholder-stone-400 text-lg" placeholder="jane@example.com" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-widest">Password</label>
                    {authMode === 'login' && <a href="#" className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors">Forgot?</a>}
                  </div>
                  <input type="password" required className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors text-stone-900 placeholder-stone-400 text-lg" placeholder="••••••••" />
                </div>

                <button type="submit" className="w-full py-5 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mt-10 flex items-center justify-center gap-3 group text-lg">
                  {authMode === 'login' ? 'Sign In' : 'Join Velora'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </form>

              <div className="mt-12 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-8 decoration-stone-200 hover:decoration-stone-900"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (`;

content = content.replace(oldAuthBlockRegex, newAuthBlock);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Attractive auth page injected');
