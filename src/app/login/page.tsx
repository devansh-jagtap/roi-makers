'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Use useSearchParams conditionally or handle suspense correctly in Next.js
  // Since we are not using Suspense here, we'll try to just grab params safely
  const [urlError, setUrlError] = useState('');
  
  useEffect(() => {
    // Extract query params without useSearchParams to avoid Suspense boundaries if not wrapped
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const err = searchParams.get('error');
      if (err) {
        setUrlError(decodeURIComponent(err.replace(/\+/g, ' ')));
      }
    }
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setUrlError('');

    const { error: authError } = await createSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.replace('/dashboard');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#060010] relative overflow-hidden p-6">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f26b38]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <span className="font-bold text-4xl tracking-tight text-white inline-block">
            ROI Makers<span className="text-[#f26b38]">.</span>
          </span>
          <p className="text-stone-400 mt-2 text-sm font-medium tracking-wide uppercase">Dashboard Login</p>
        </div>

        <form onSubmit={login} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl">
          {(error || urlError) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
              <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
              <p>{error || urlError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Email Address</label>
            <input 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#f26b38]/50 focus:border-[#f26b38] transition-all" 
              type="email" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Password</label>
            <input 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#f26b38]/50 focus:border-[#f26b38] transition-all" 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f26b38] hover:bg-[#d95b2b] p-3.5 text-white font-semibold transition-all disabled:opacity-70 mt-4 shadow-lg shadow-[#f26b38]/20"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>
        
        <p className="text-center text-stone-500 text-xs mt-8">
          Secure access for ROI Makers team members only.
        </p>
      </div>
    </main>
  );
}
