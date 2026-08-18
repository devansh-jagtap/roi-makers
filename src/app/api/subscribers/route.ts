import { NextResponse } from 'next/server';
import { SubscriptionType, SubscriberStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendSubscriberWelcome } from '@/lib/email';
import { withinRateLimit } from '@/lib/rate-limit';
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'; if (!withinRateLimit(`subscriber:${ip}`)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  try { const body = await request.json(); const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''; if (!isEmail(email) || body.website) return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 }); const requested = body.subscriptionType === 'BLOG' ? SubscriptionType.BLOG : SubscriptionType.NEWSLETTER; const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } }); const type = existing && existing.subscriptionType !== requested ? SubscriptionType.BOTH : requested; const subscriber = await prisma.newsletterSubscriber.upsert({ where: { email }, create: { email, name: typeof body.name === 'string' ? body.name.trim().slice(0, 150) : null, source: typeof body.source === 'string' ? body.source.trim().slice(0, 100) : null, subscriptionType: type }, update: { status: SubscriberStatus.SUBSCRIBED, subscriptionType: type, unsubscribedAt: null, subscribedAt: new Date() } }); try { await sendSubscriberWelcome(subscriber); } catch (error) { console.error('Subscriber email failed', error); } return NextResponse.json({ success: true }); } catch (error) { console.error('Subscription failed', error); return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 }); }
}
