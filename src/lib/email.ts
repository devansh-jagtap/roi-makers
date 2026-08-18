import { Lead, NewsletterSubscriber } from '@prisma/client';
import { createUnsubscribeToken } from './unsubscribe';

const esc = (value: string | null | undefined) => (value ?? 'Not provided').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const wrap = (body: string) => `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#060010">${body}<p style="color:#777;font-size:12px">ROI Makers</p></div>`;
async function send(to: string, subject: string, htmlContent: string, textContent: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !process.env.BREVO_FROM_EMAIL) throw new Error('Brevo is not configured');
  const response = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': apiKey, 'content-type': 'application/json' }, body: JSON.stringify({ sender: { email: process.env.BREVO_FROM_EMAIL, name: process.env.BREVO_FROM_NAME ?? 'ROI Makers' }, to: [{ email: to }], subject, htmlContent, textContent }) });
  if (!response.ok) throw new Error(`Brevo request failed (${response.status})`);
}
export async function sendLeadEmails(lead: Lead) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/dashboard/leads/${lead.id}`;
  const detail = `<p><b>Name:</b> ${esc(lead.name)}<br><b>Email:</b> ${esc(lead.email)}<br><b>Company:</b> ${esc(lead.company)}<br><b>Phone:</b> ${esc(lead.phone)}<br><b>Service:</b> ${esc(lead.service)}<br><b>Budget:</b> ${esc(lead.budget)}</p><p><b>Message:</b><br>${esc(lead.message)}</p><p><b>Source:</b> ${esc(lead.source)}<br><b>UTM:</b> ${esc(lead.utmSource)} / ${esc(lead.utmMedium)} / ${esc(lead.utmCampaign)}</p><p>Lead ID: ${esc(lead.id)}<br><a href="${esc(link)}">Open in dashboard</a></p>`;
  return Promise.allSettled([
    send(process.env.LEADS_NOTIFICATION_EMAIL!, `New Lead — ${lead.name} from ${lead.company ?? 'an unknown company'}`, wrap(`<h2>New lead</h2>${detail}`), `New lead from ${lead.name} (${lead.email})`),
    send(lead.email, 'Thank you for contacting ROI Makers', wrap(`<h2>Thanks, ${esc(lead.name)}</h2><p>We received your enquiry and our team will review it shortly. We’ll be in touch soon.</p>`), 'We received your enquiry and will be in touch soon.'),
  ]);
}
export async function sendSubscriberWelcome(subscriber: NewsletterSubscriber) {
  const token = createUnsubscribeToken(subscriber.email);
  const unsubscribe = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/unsubscribe?token=${token}`;
  const topic = subscriber.subscriptionType === 'BLOG' ? 'blog updates' : subscriber.subscriptionType === 'BOTH' ? 'newsletter and blog updates' : 'newsletter updates';
  return send(subscriber.email, 'Welcome to ROI Makers', wrap(`<h2>Welcome to ROI Makers</h2><p>You're subscribed to ${topic}. Expect useful growth and marketing insights.</p><p><a href="${unsubscribe}">Unsubscribe</a></p>`), `You're subscribed to ROI Makers ${topic}. Unsubscribe: ${unsubscribe}`);
}
