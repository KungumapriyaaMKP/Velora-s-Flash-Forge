const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const stateRegex = /const \[devMode, setDevMode\] = useState\(false\);/;
const authState = `const [devMode, setDevMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');`;
content = content.replace(stateRegex, authState);

const renderRegex = /if \(\!devMode\) \{\s*return \(/;
const authRender = `if (!devMode) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden font-sans">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-100/60 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-100/60 rounded-full blur-3xl"></div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200 w-full max-w-md rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-5xl tracking-tight text-stone-900 font-serif mb-3">Velora</h1>
              <p className="text-stone-500 text-sm font-medium">{authMode === 'login' ? 'Welcome back, beautiful.' : 'Join the Velora club.'}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium text-stone-900" placeholder="Jane Doe" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium text-stone-900" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Password</label>
                <input type="password" required className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all font-medium text-stone-900" placeholder="••••••••" />
              </div>

              <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg mt-8 text-lg">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-stone-100 pt-6">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (`
content = content.replace(renderRegex, authRender);

fs.writeFileSync('src/app/page.tsx', content);
try { fs.writeFileSync('frontend/src/app/page.tsx', content); } catch(e){}
console.log('Auth page injected');
