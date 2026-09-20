import { NextResponse } from 'next/server';
import { createLead, text } from '@/lib/leads';
import { WINDOW, getClientIp, rateLimitAll, tooManyRequests } from '@/lib/rate-limit';
import { BodyTooLargeError, readJson } from '@/lib/http';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimitAll([
    { key: `lead:min:${ip}`, limit: 5, windowMs: WINDOW.MINUTE },
    { key: `lead:day:${ip}`, limit: 30, windowMs: WINDOW.DAY },
  ]);
  if (!limited.ok) return tooManyRequests(limited);

  try {
    const body = await readJson<Record<string, unknown>>(request, 32 * 1024);
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    if (text(body.website)) return NextResponse.json({ success: true }); // honeypot

    const result = await createLead(body);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({ success: true, id: result.lead.id }, { status: 201 });
  } catch (error) {
    if (error instanceof BodyTooLargeError) return NextResponse.json({ error: 'Request body too large.' }, { status: 413 });
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    console.error('Lead submission failed', error);
    return NextResponse.json({ error: 'Unable to save your enquiry. Please try again.' }, { status: 500 });
  }
}
