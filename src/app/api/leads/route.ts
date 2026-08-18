import { NextResponse } from 'next/server';
import { NotificationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendLeadEmails } from '@/lib/email';
import { withinRateLimit } from '@/lib/rate-limit';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value: unknown, max = 5000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!withinRateLimit(`lead:${ip}`)) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  try {
    const body = await request.json();
    if (text(body.website)) return NextResponse.json({ success: true }); // honeypot
    const name = text(body.name, 150), email = text(body.email, 254).toLowerCase(), service = text(body.service, 150), message = text(body.message, 5000);
    if (!name || !emailPattern.test(email) || !service || !message) return NextResponse.json({ error: 'Please provide a name, valid email, service, and message.' }, { status: 400 });
    const lead = await prisma.lead.create({ data: { name, email, service, message, company: text(body.company, 200) || null, phone: text(body.phone, 50) || null, budget: text(body.budget, 100) || null, source: text(body.source, 100) || null, utmSource: text(body.utmSource, 200) || null, utmMedium: text(body.utmMedium, 200) || null, utmCampaign: text(body.utmCampaign, 200) || null, utmTerm: text(body.utmTerm, 200) || null, utmContent: text(body.utmContent, 200) || null, landingPage: text(body.landingPage, 2048) || null, referrer: text(body.referrer, 2048) || null } });
    const result = await sendLeadEmails(lead);
    await prisma.lead.update({ where: { id: lead.id }, data: { roiNotificationStatus: result[0].status === 'fulfilled' ? NotificationStatus.SENT : NotificationStatus.FAILED, customerNotificationStatus: result[1].status === 'fulfilled' ? NotificationStatus.SENT : NotificationStatus.FAILED } });
    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) { console.error('Lead submission failed', error); return NextResponse.json({ error: 'Unable to save your enquiry. Please try again.' }, { status: 500 }); }
}
