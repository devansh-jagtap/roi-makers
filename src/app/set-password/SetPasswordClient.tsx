'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export function SetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please try again.');
      setLoading(false);
    } else {
      router.replace('/dashboard');
    }
  };

  const isMatching = password && confirmPassword && password === confirmPassword;

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
          <p className="text-stone-400 mt-2 text-sm font-medium tracking-wide">Complete your account setup</p>
        </div>
        
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5 shadow-2xl">
          <h1 className="text-2xl font-semibold text-white mb-6">Set Your Password</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
              <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">New Password</label>
            <input 
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#f26b38]/50 focus:border-[#f26b38] transition-all" 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Confirm Password</label>
            <div className="relative">
              <input 
                className={`w-full bg-black/20 border rounded-xl p-3.5 text-white placeholder-stone-500 focus:outline-none focus:ring-2 transition-all ${
                  isMatching ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/50' : 'border-white/10 focus:ring-[#f26b38]/50 focus:border-[#f26b38]'
                }`} 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={6}
              />
              {isMatching && (
                <CheckCircle2 size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </div>
          
          <button 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f26b38] hover:bg-[#d95b2b] p-3.5 text-white font-semibold transition-all disabled:opacity-70 mt-4 shadow-lg shadow-[#f26b38]/20"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Saving...</>
            ) : (
              <>Save Password <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
