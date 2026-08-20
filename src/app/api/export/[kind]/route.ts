import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) { 
  const auth = await requireApiProfile(); 
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status }); 
  
  const { kind } = await params; 
  if (!['leads', 'subscribers', 'careers'].includes(kind)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 }); 
  }

  if ((kind === 'subscribers' || kind === 'careers') && auth.profile.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const format = new URL(request.url).searchParams.get('format') === 'csv' ? 'csv' : 'xlsx'; 
  
  let rows: Record<string, unknown>[] = [];

  if (kind === 'leads') {
    const leads = await prisma.lead.findMany({ 
      where: auth.profile.role === 'MEMBER' ? { assignedToId: auth.profile.id } : undefined,
      orderBy: { createdAt: 'desc' } 
    });
    rows = leads.map((l) => ({
      'Lead ID': l.id,
      Name: l.name,
      Email: l.email,
      Company: l.company,
      Phone: l.phone,
      Service: l.service,
      Budget: l.budget,
      Message: l.message,
      Status: l.status,
      Source: l.source,
      'UTM Source': l.utmSource,
      'UTM Medium': l.utmMedium,
      'UTM Campaign': l.utmCampaign,
      'UTM Term': l.utmTerm,
      'UTM Content': l.utmContent,
      'Landing Page': l.landingPage,
      Referrer: l.referrer,
      'Created At': l.createdAt.toISOString(),
      'Updated At': l.updatedAt.toISOString(),
    }));
  } else if (kind === 'subscribers') {
    const subscribers = await prisma.newsletterSubscriber.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    rows = subscribers.map((s) => ({
      'Subscriber ID': s.id,
      Name: s.name,
      Email: s.email,
      Source: s.source,
      'Subscription Type': s.subscriptionType,
      Status: s.status,
      'Subscribed At': s.subscribedAt.toISOString(),
      'Unsubscribed At': s.unsubscribedAt?.toISOString() ?? '',
      'Created At': s.createdAt.toISOString(),
      'Updated At': s.updatedAt.toISOString(),
    }));
  } else if (kind === 'careers') {
    const applications = await prisma.careerApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    rows = applications.map((a) => ({
      'Application ID': a.id,
      Name: a.name,
      Email: a.email,
      Phone: a.phone ?? '',
      Position: a.position,
      LinkedIn: a.linkedin ?? '',
      Portfolio: a.portfolio ?? '',
      Experience: a.experience ?? '',
      Message: a.message,
      'Resume Name': a.resumeName ?? '',
      Status: a.status,
      'Created At': a.createdAt.toISOString(),
      'Updated At': a.updatedAt.toISOString(),
    }));
  }
  
  const sheet = XLSX.utils.json_to_sheet(rows); 
  const book = XLSX.utils.book_new(); 
  XLSX.utils.book_append_sheet(book, sheet, kind); 
  const data = format === 'csv' ? XLSX.utils.sheet_to_csv(sheet) : XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }); 
  return new NextResponse(data, {
    headers: {
      'content-type': format === 'csv' ? 'text/csv; charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-disposition': `attachment; filename="roi-makers-${kind}.${format}"`
    }
  }); 
}
