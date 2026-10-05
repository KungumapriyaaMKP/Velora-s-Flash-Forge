let supabaseClient: any = null;

try {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dqzqbplwdmlfybqtgoqu.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxenFicGx3ZG1sZnlicXRnb3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjI1NzIsImV4cCI6MjEwNjczODU3Mn0.ScfUlPor2cSXJU0l4oKnXHJYtan50tUJs7j_J2zNTV8';
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch {
  // Safe mock client fallback when package is loading
  supabaseClient = {
    rpc: async () => ({ data: null, error: new Error('Supabase client fallback') })
  };
}

export const supabase = supabaseClient;
