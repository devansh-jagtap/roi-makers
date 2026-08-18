import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  
  // Atomic claim: only update if currently unassigned
  const lead = await prisma.lead.updateMany({
    where: { id, assignedToId: null },
    data: { assignedToId: auth.profile.id }
  });

  if (lead.count === 0) {
    // Check if lead exists
    const exists = await prisma.lead.findUnique({ where: { id }, select: { assignedToId: true } });
    if (!exists) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    return NextResponse.json({ error: 'This lead has already been claimed by another team member.' }, { status: 409 });
  }

  const updated = await prisma.lead.findUnique({ 
    where: { id }, 
    include: { assignedTo: { select: { id: true, name: true, email: true } } } 
  });
  return NextResponse.json(updated);
}
