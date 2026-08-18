import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  
  const { id } = await params;
  
  try {
    const { action, role } = await request.json();
    
    const targetProfile = await prisma.profile.findUnique({ where: { id } });
    if (!targetProfile) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    // Prevent disabling or demoting the last active admin
    if (targetProfile.role === Role.ADMIN && targetProfile.active) {
      const isDemotingOrDisabling = (action === 'setRole' && role === Role.MEMBER) || action === 'disable';
      if (isDemotingOrDisabling) {
        const activeAdmins = await prisma.profile.count({
          where: { role: Role.ADMIN, active: true }
        });
        if (activeAdmins <= 1) {
          return NextResponse.json({ error: 'Cannot modify the last active admin.' }, { status: 400 });
        }
      }
    }

    if (action === 'setRole') {
      if (role !== Role.ADMIN && role !== Role.MEMBER) {
        return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
      }
      const updated = await prisma.profile.update({
        where: { id },
        data: { role }
      });
      return NextResponse.json({ success: true, profile: updated });
    } 
    
    if (action === 'disable') {
      const updated = await prisma.profile.update({
        where: { id },
        data: { active: false }
      });
      
      // Disable auth access
      const { error } = await supabaseAdmin.auth.admin.updateUserById(targetProfile.authUserId, {
        ban_duration: '876000h' // Effectively permanently banned
      });
      
      if (error) console.error('Failed to ban user in Supabase', error);
      
      return NextResponse.json({ success: true, profile: updated });
    }
    
    if (action === 'enable') {
      const updated = await prisma.profile.update({
        where: { id },
        data: { active: true }
      });
      
      // Enable auth access
      const { error } = await supabaseAdmin.auth.admin.updateUserById(targetProfile.authUserId, {
        ban_duration: 'none'
      });
      
      if (error) console.error('Failed to unban user in Supabase', error);
      
      return NextResponse.json({ success: true, profile: updated });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    
  } catch (err) {
    console.error('Team member update error', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
