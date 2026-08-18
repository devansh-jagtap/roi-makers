import { NextResponse } from 'next/server';
import { LeadStatus, Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

const statuses = Object.values(LeadStatus);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();

  if (!statuses.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const existingLead = await prisma.lead.findUnique({ where: { id } });
  if (!existingLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  if (auth.profile.role === 'MEMBER' && existingLead.assignedToId !== auth.profile.id) {
    return NextResponse.json({ error: 'Forbidden: You can only update your own leads' }, { status: 403 });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { status: body.status },
    include: { assignedTo: { select: { id: true, name: true, email: true } } }
  });

  return NextResponse.json(lead);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  
  await prisma.lead.delete({
    where: { id }
  });

  return new NextResponse(null, { status: 204 });
}
