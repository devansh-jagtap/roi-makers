import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import { requireApiProfile } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) { 
  const auth = await requireApiProfile(); 
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status }); 
  
  const { kind } = await params; 
  if (!['leads', 'subscribers'].includes(kind)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 }); 
  }

  const format = new URL(request.url).searchParams.get('format') === 'csv' ? 'csv' : 'xlsx'; 
  
  const rows = kind === 'leads' ? (await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })).map((l) => ({ 'Lead ID': l.id, Name: l.name, Email: l.email, Company: l.company, Phone: l.phone, Service: l.service, Budget: l.budget, Message: l.message, Status: l.status, Source: l.source, 'UTM Source': l.utmSource, 'UTM Medium': l.utmMedium, 'UTM Campaign': l.utmCampaign, 'UTM Term': l.utmTerm, 'UTM Content': l.utmContent, 'Landing Page': l.landingPage, Referrer: l.referrer, 'Created At': l.createdAt.toISOString(), 'Updated At': l.updatedAt.toISOString() })) : (await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } })).map((s) => ({ 'Subscriber ID': s.id, Name: s.name, Email: s.email, Source: s.source, 'Subscription Type': s.subscriptionType, Status: s.status, 'Subscribed At': s.subscribedAt.toISOString(), 'Unsubscribed At': s.unsubscribedAt?.toISOString() ?? '', 'Created At': s.createdAt.toISOString(), 'Updated At': s.updatedAt.toISOString() })); 
  
  const sheet = XLSX.utils.json_to_sheet(rows); 
  const book = XLSX.utils.book_new(); 
  XLSX.utils.book_append_sheet(book, sheet, kind); 
  const data = format === 'csv' ? XLSX.utils.sheet_to_csv(sheet) : XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }); 
  return new NextResponse(data, { headers: { 'content-type': format === 'csv' ? 'text/csv; charset=utf-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'content-disposition': `attachment; filename="roi-makers-${kind}.${format}"` } }); 
}
