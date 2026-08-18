import { NextResponse } from 'next/server';
import { SubscriberStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
export async function GET(request: Request) { const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase(); if (email) await prisma.newsletterSubscriber.updateMany({ where: { email }, data: { status: SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date() } }); return new NextResponse('<h1>Unsubscribed</h1><p>You will no longer receive ROI Makers marketing updates.</p>', { headers: { 'content-type': 'text/html; charset=utf-8' } }); }
