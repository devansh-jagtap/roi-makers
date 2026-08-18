import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function GET() {
  const auth = await requireApiProfile();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const members = await prisma.profile.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, role: true }
  });

  return NextResponse.json({ members });
}
