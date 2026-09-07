import { NextResponse } from 'next/server';
import { createLead, text } from '@/lib/leads';
import { withinRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!withinRateLimit(`lead:${ip}`)) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });

  try {
    const body = await request.json();
    if (text(body.website)) return NextResponse.json({ success: true }); // honeypot

    const result = await createLead(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ success: true, id: result.lead.id }, { status: 201 });
  } catch (error) {
    console.error('Lead submission failed', error);
    return NextResponse.json({ error: 'Unable to save your enquiry. Please try again.' }, { status: 500 });
  }
}
