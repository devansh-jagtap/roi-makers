import { NextResponse } from 'next/server';
import { SubscriptionType, SubscriberStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { sendSubscriberWelcome } from '@/lib/email';
import { WINDOW, getClientIp, rateLimitAll, tooManyRequests } from '@/lib/rate-limit';
import { BodyTooLargeError, readJson } from '@/lib/http';

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimitAll([
    { key: `subscriber:min:${ip}`, limit: 5, windowMs: WINDOW.MINUTE },
    { key: `subscriber:day:${ip}`, limit: 20, windowMs: WINDOW.DAY },
  ]);
  if (!limited.ok) return tooManyRequests(limited);

  try {
    const body = await readJson<Record<string, unknown>>(request, 8 * 1024);
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!isEmail(email) || body.website) return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });

    const requested = body.subscriptionType === 'BLOG' ? SubscriptionType.BLOG : SubscriptionType.NEWSLETTER;
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    let type: SubscriptionType = requested;
    const shouldSendWelcome = true;

    if (existing) {
      if (existing.status === SubscriberStatus.SUBSCRIBED) {
        if (existing.subscriptionType === requested || existing.subscriptionType === SubscriptionType.BOTH) {
          // Case B: Already subscribed to this type or both. Do not send email.
          return NextResponse.json({ success: true });
        }
        // Case D/E: Upgrade to BOTH
        type = SubscriptionType.BOTH;
      } else {
        // Case C: Unsubscribed. Reactivate.
        type = existing.subscriptionType !== requested ? SubscriptionType.BOTH : requested;
      }
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        name: typeof body.name === 'string' ? body.name.trim().slice(0, 150) : null,
        source: typeof body.source === 'string' ? body.source.trim().slice(0, 100) : null,
        subscriptionType: type
      },
      update: {
        status: SubscriberStatus.SUBSCRIBED,
        subscriptionType: type,
        unsubscribedAt: null,
        subscribedAt: new Date()
      }
    });

    if (shouldSendWelcome) {
      try {
        await sendSubscriberWelcome(subscriber);
      } catch (error) {
        console.error('Subscriber email failed', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof BodyTooLargeError) return NextResponse.json({ error: 'Request body too large.' }, { status: 413 });
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    console.error('Subscription failed', error);
    return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 });
  }
}
