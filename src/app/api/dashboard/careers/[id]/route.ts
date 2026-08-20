import { NextResponse } from 'next/server';
import { CareerApplicationStatus, Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const application = await prisma.careerApplication.findUnique({ where: { id } });
  if (!application) return NextResponse.json({ error: 'Career application not found.' }, { status: 404 });

  return NextResponse.json(application);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses: CareerApplicationStatus[] = ['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid application status.' }, { status: 400 });
  }

  const existing = await prisma.careerApplication.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Career application not found.' }, { status: 404 });

  const updated = await prisma.careerApplication.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiProfile(Role.ADMIN);
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const existing = await prisma.careerApplication.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Career application not found.' }, { status: 404 });

  await prisma.careerApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
