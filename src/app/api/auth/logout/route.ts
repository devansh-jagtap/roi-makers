import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isSameOrigin } from '@/lib/http';

export async function POST(request: Request) {
  // Session cookies are SameSite=Lax, which still travels on a cross-site
  // top-level form POST — so a third-party page could log staff out.
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
