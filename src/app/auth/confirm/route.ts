import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/set-password';

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (!error) {
      // Ensure no open redirects by forcing paths relative to the origin
      if (next.startsWith('/')) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`${origin}/set-password`);
      }
    }
  }

  // Handle invalid/expired tokens safely without exposing Supabase internals
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Your invitation link is invalid or has expired. Please ask an administrator to send a new invitation.')}`);
}
