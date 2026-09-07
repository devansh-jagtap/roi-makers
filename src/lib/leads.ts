import { NotificationStatus, type Lead } from '@prisma/client';
import { prisma } from './prisma';
import { sendLeadEmails } from './email';

/**
 * Lead creation, in one place.
 *
 * Both the contact form (`/api/leads`) and the AI assistant's `captureLead` tool
 * go through here, so an enquiry raised in chat is validated, truncated, stored
 * and notified exactly the same way as one typed into the form. Keeping this
 * shared is what stops the two paths from drifting apart.
 */

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const text = (value: unknown, max = 5000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

export type LeadInput = {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
  company?: unknown;
  phone?: unknown;
  budget?: unknown;
  source?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmTerm?: unknown;
  utmContent?: unknown;
  landingPage?: unknown;
  referrer?: unknown;
};

export type CreateLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: string };

/**
 * Validate and persist a lead, then fire the notification emails.
 *
 * Email delivery is best effort: a lead is never lost because Brevo was down.
 * The outcome is recorded on the row instead, which is what the dashboard's
 * notification-status columns read.
 */
export async function createLead(input: LeadInput): Promise<CreateLeadResult> {
  const name = text(input.name, 150);
  const email = text(input.email, 254).toLowerCase();
  const service = text(input.service, 150);
  const message = text(input.message, 5000);

  if (!name || !emailPattern.test(email) || !service || !message) {
    return { ok: false, error: 'Please provide a name, valid email, service, and message.' };
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      service,
      message,
      company: text(input.company, 200) || null,
      phone: text(input.phone, 50) || null,
      budget: text(input.budget, 100) || null,
      source: text(input.source, 100) || null,
      utmSource: text(input.utmSource, 200) || null,
      utmMedium: text(input.utmMedium, 200) || null,
      utmCampaign: text(input.utmCampaign, 200) || null,
      utmTerm: text(input.utmTerm, 200) || null,
      utmContent: text(input.utmContent, 200) || null,
      landingPage: text(input.landingPage, 2048) || null,
      referrer: text(input.referrer, 2048) || null,
    },
  });

  await notifyLead(lead);

  return { ok: true, lead };
}

async function notifyLead(lead: Lead): Promise<void> {
  try {
    const result = await sendLeadEmails(lead);
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        roiNotificationStatus:
          result[0].status === 'fulfilled' ? NotificationStatus.SENT : NotificationStatus.FAILED,
        customerNotificationStatus:
          result[1].status === 'fulfilled' ? NotificationStatus.SENT : NotificationStatus.FAILED,
      },
    });
  } catch (error) {
    console.error('Lead email process failed', error);
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        roiNotificationStatus: NotificationStatus.FAILED,
        customerNotificationStatus: NotificationStatus.FAILED,
      },
    });
  }
}
