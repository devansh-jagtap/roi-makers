import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const supabaseError = searchParams.get('error_description');
  const rawNext = searchParams.get('next') ?? '/set-password';
  // Ensure no open redirects by forcing paths relative to the origin
  const next = rawNext.startsWith('/') ? rawNext : '/set-password';

  // Supabase already rejected the link (expired, reused, etc.) and forwarded its reason
  if (supabaseError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(`${supabaseError}. Please request a new link.`)}`);
  }

  const supabase = await createSupabaseServerClient();

  // Links built with {{ .TokenHash }} (our invite template)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Links built with {{ .ConfirmationURL }} (Supabase default templates, e.g. Reset Password):
  // Supabase verifies the token itself, then redirects here with a PKCE code to exchange.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Handle invalid/expired tokens safely without exposing Supabase internals
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('This link is invalid or has expired. Please request a new one (or ask an administrator for a new invitation).')}`);
}
