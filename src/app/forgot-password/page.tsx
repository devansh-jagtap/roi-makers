'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ShieldAlert, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendReset(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    // The email link lands on /auth/confirm, which verifies the recovery token and forwards to /set-password.
    const { error: resetError } = await createSupabaseBrowserClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/set-password`,
    });

    if (resetError) {
      setError('Could not send the reset email. Please try again in a moment.');
    } else {
      setSent(true);
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
          <p className="text-stone-400 mt-2 text-sm font-medium tracking-wide uppercase">Reset Password</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl text-white">
          <CardHeader>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription className="text-stone-400">
              Enter your account email and we&apos;ll send you a link to choose a new password.
            </CardDescription>
          </CardHeader>
          {sent ? (
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-xl flex items-start gap-3 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-green-400" />
                <p>If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way. Check your inbox and spam folder.</p>
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-stone-300 hover:text-white transition-colors">
                <ArrowLeft size={16} /> Back to sign in
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={sendReset}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
                    <p>{error}</p>
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
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button type="submit" disabled={loading} className="w-full bg-[#f26b38] hover:bg-[#d95b2b] text-white">
                  {loading ? (
                    <><Loader2 size={18} className="mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <>Send Reset Link <ArrowRight size={18} className="ml-2" /></>
                  )}
                </Button>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors">
                  <ArrowLeft size={16} /> Back to sign in
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
