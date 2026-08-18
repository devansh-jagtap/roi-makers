'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export function SetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'Failed to update password.');
      setLoading(false);
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-[#060010] p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-8 space-y-5">
        <h1 className="text-3xl font-bold">Set Your Password</h1>
        <p className="text-stone-600">Please choose a password to complete your account setup.</p>
        
        <label className="block">
          Password
          <input 
            className="mt-1 w-full border rounded-lg p-3" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
        </label>
        
        <label className="block">
          Confirm Password
          <input 
            className="mt-1 w-full border rounded-lg p-3" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            minLength={6}
          />
        </label>
        
        {error && <p className="text-red-600 bg-red-50 p-3 rounded text-sm">{error}</p>}
        
        <button 
          disabled={loading} 
          className="w-full rounded-full bg-[#060010] p-3 text-white disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Password'}
        </button>
      </form>
    </main>
  );
}
