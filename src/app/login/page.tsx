'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [urlError, setUrlError] = useState('');
  
  useEffect(() => {
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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f26b38]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <span className="font-bold text-4xl tracking-tight text-white inline-block">
            ROI Makers<span className="text-[#f26b38]">.</span>
          </span>
          <p className="text-stone-400 mt-2 text-sm font-medium tracking-wide uppercase">Dashboard Login</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl text-white">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription className="text-stone-400">Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <form onSubmit={login}>
            <CardContent className="space-y-4">
              {(error || urlError) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                  <p>{error || urlError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-300">Email Address</Label>
                <Input 
                  id="email"
                  className="bg-black/20 border-white/10 text-white placeholder-stone-500 focus-visible:ring-[#f26b38] focus-visible:border-[#f26b38]" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-300">Password</Label>
                <Input 
                  id="password"
                  className="bg-black/20 border-white/10 text-white placeholder-stone-500 focus-visible:ring-[#f26b38] focus-visible:border-[#f26b38]" 
                  type="password" 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit"
                disabled={loading} 
                className="w-full bg-[#f26b38] hover:bg-[#d95b2b] text-white"
              >
                {loading ? (
                  <><Loader2 size={18} className="mr-2 animate-spin" /> Authenticating...</>
                ) : (
                  <>Sign In <ArrowRight size={18} className="ml-2" /></>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-stone-500 text-xs mt-8">
          Secure access for ROI Makers team members only.
        </p>
      </div>
    </main>
  );
}
