import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  
  const team = await prisma.profile.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, authUserId: true, name: true, email: true, role: true, active: true, createdAt: true }
  });
  
  return NextResponse.json({ team });
}

export async function POST(request: Request) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  
  try {
    const { email, name } = await request.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedName = typeof name === 'string' ? name.trim().slice(0, 150) : null;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }
    
    // Check for duplicate in profiles
    const existing = await prisma.profile.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }
    
    const supabaseAdmin = createSupabaseAdminClient();
    
    // Invite Supabase Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      data: { name: normalizedName },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`
    });
    
    let authUserId = authData?.user?.id ?? null;
    let createdAuthUser = Boolean(authUserId);
    
    // The auth user can already exist (e.g. a previous invite whose profile row was never created).
    // Reuse it instead of failing, and resend the invite so they still get a link.
    if (authError && authError.code === 'email_exists') {
      const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const existingAuth = list?.users.find(u => (u.email ?? '').toLowerCase() === normalizedEmail);
      if (listError || !existingAuth) {
        console.error('Auth user exists but could not be looked up', listError);
        return NextResponse.json({ error: 'Failed to invite user in authentication system.' }, { status: 500 });
      }
      authUserId = existingAuth.id;
      createdAuthUser = false;
      await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: normalizedEmail }).catch(() => null);
    } else if (authError || !authUserId) {
      console.error('Failed to invite auth user', authError);
      return NextResponse.json({ error: 'Failed to invite user in authentication system.' }, { status: 500 });
    }
    
    // Create Prisma Profile
    try {
      const profile = await prisma.profile.create({
        data: {
          authUserId,
          email: normalizedEmail,
          name: normalizedName,
          role: Role.MEMBER,
          active: true
        }
      });
      
      return NextResponse.json({ success: true, profile }, { status: 201 });
    } catch (profileError) {
      console.error('Failed to create profile, rolling back auth user', profileError);
      // Only roll back an auth user this request created
      if (createdAuthUser) await supabaseAdmin.auth.admin.deleteUser(authUserId);
      return NextResponse.json({ error: 'Failed to create user profile.' }, { status: 500 });
    }
    
  } catch (err) {
    console.error('Invite error', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
