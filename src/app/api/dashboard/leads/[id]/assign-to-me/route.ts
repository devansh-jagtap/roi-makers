import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  // Validate the lead exists
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

  const updated = await prisma.lead.update({
    where: { id },
    data: { assignedToId: auth.profile.id },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(updated);
}
