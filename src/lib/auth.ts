import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { prisma } from './prisma';
import { createSupabaseServerClient } from './supabase-server';
export async function currentProfile() { const supabase = await createSupabaseServerClient(); const { data: { user } } = await supabase.auth.getUser(); return user ? prisma.profile.findUnique({ where: { authUserId: user.id } }) : null; }
export async function requireProfile(role?: Role) { const profile = await currentProfile(); if (!profile || !profile.active) redirect('/login'); if (role && profile.role !== role) redirect('/dashboard'); return profile; }
export async function requireApiProfile(role?: Role) { const profile = await currentProfile(); if (!profile || !profile.active) return { error: 'Unauthenticated', status: 401 } as const; if (role && profile.role !== role) return { error: 'Forbidden', status: 403 } as const; return { profile } as const; }
