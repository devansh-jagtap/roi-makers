import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const { profileId } = await request.json();

  // Validate the lead exists
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

  // If profileId is null, unassign
  if (profileId === null) {
    const updated = await prisma.lead.update({ 
      where: { id }, 
      data: { assignedToId: null },
      include: { assignedTo: { select: { id: true, name: true, email: true } } }
    });
    return NextResponse.json(updated);
  }

  // Validate the target profile exists and is active
  const targetProfile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!targetProfile || !targetProfile.active) {
    return NextResponse.json({ error: 'Target team member not found or inactive.' }, { status: 400 });
  }

  const updated = await prisma.lead.update({ 
    where: { id }, 
    data: { assignedToId: profileId },
    include: { assignedTo: { select: { id: true, name: true, email: true } } }
  });
  return NextResponse.json(updated);
}
