import { NextResponse } from 'next/server';
import { SubscriberStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

export async function GET(request: Request) { 
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  
  if (url.searchParams.has('email')) {
    return new NextResponse('<h1>Invalid Request</h1><p>Please use the secure unsubscribe link from your email.</p>', { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  if (!token) {
    return new NextResponse('<h1>Invalid Request</h1><p>Missing unsubscribe token.</p>', { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const email = verifyUnsubscribeToken(token);
  
  if (!email) {
    return new NextResponse('<h1>Invalid or Expired Link</h1><p>This unsubscribe link is invalid or has expired.</p>', { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  await prisma.newsletterSubscriber.updateMany({ 
    where: { email }, 
    data: { status: SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date() } 
  }); 
  
  return new NextResponse('<h1>Unsubscribed</h1><p>You will no longer receive ROI Makers marketing updates.</p>', { headers: { 'content-type': 'text/html; charset=utf-8' } }); 
}
