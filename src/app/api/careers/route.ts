import { NextResponse } from 'next/server';
import { WINDOW, getClientIp, rateLimitAll, tooManyRequests } from '@/lib/rate-limit';
import { bodyExceeds } from '@/lib/http';
import { prisma } from '@/lib/prisma';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
// Raw PDF plus multipart/field overhead; anything larger is rejected before parsing.
const MAX_BODY_BYTES = MAX_RESUME_BYTES + 256 * 1024;

const escapeHtml = (unsafe: string | null | undefined) =>
  (unsafe || '').replace(/[&<"'>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c as '&' | '<' | '>' | '"' | "'"]);

/** Trimmed, length-capped string field. Non-string values (e.g. a File) become ''. */
const field = (value: FormDataEntryValue | null, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

/** Only http(s) links are rendered as anchors in the notification email. */
const safeHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

/** Strip characters that could break a multipart filename or a Content-Disposition header. */
const safeFilename = (name: string) =>
  name.replace(/[\\/:*?"<>|\r\n\0]/g, '_').replace(/\.\.+/g, '.').slice(0, 120) || 'resume.pdf';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimitAll([
      { key: `career:min:${ip}`, limit: 3, windowMs: WINDOW.MINUTE },
      { key: `career:day:${ip}`, limit: 10, windowMs: WINDOW.DAY },
    ]);
    if (!limited.ok) return tooManyRequests(limited, 'Too many requests. Please try again later.');

    if (bodyExceeds(request, MAX_BODY_BYTES)) {
      return NextResponse.json({ error: 'Upload too large. Resume must be under 5 MB.' }, { status: 413 });
    }

    const formData = await request.formData();

    // Honeypot: real applicants never see this field.
    if (field(formData.get('website'), 10)) return NextResponse.json({ success: true });

    const rawName = field(formData.get('name'), 150);
    const rawEmail = field(formData.get('email'), 254).toLowerCase();
    const rawPhone = field(formData.get('phone'), 50);
    const rawPosition = field(formData.get('position'), 150);
    const rawLinkedin = field(formData.get('linkedin'), 500);
    const rawPortfolio = field(formData.get('portfolio'), 500);
    const rawExperience = field(formData.get('experience'), 50);
    const rawMessage = field(formData.get('message') ?? formData.get('coverLetter'), 5000);

    if (!rawName || !rawEmail || !rawPosition || !rawMessage) {
      return NextResponse.json({ error: 'Name, email, position, and message are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const resumeEntry = formData.get('resume');
    const resume = resumeEntry instanceof File ? resumeEntry : null;
    let resumeAttachment: { name: string; content: string } | null = null;
    let resumeName: string | null = null;

    if (resume && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json({ error: 'Resume must be under 5 MB.' }, { status: 400 });
      }
      const buffer = Buffer.from(await resume.arrayBuffer());
      // Check the bytes, not the client-declared type or extension: both are
      // trivially forged, and this file is later served back to staff as a PDF.
      if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
        return NextResponse.json({ error: 'Resume must be a PDF file.' }, { status: 400 });
      }
      resumeName = safeFilename(resume.name);
      if (!resumeName.toLowerCase().endsWith('.pdf')) resumeName += '.pdf';
      resumeAttachment = { name: resumeName, content: buffer.toString('base64') };
    }

    // Stored raw. Escaping happens where the text is rendered (the dashboard
    // uses React, the email below uses escapeHtml); escaping before storage
    // would corrupt names like O'Brien in the database and every export.
    const data = {
      name: rawName,
      email: rawEmail,
      phone: rawPhone || null,
      position: rawPosition,
      linkedin: rawLinkedin || null,
      portfolio: rawPortfolio || null,
      experience: rawExperience || null,
      message: rawMessage,
      resumeName,
    };

    // 1. Persistence-first: Save to Prisma database
    const application = await prisma.careerApplication.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        experience: data.experience,
        message: data.message,
        resumeName: data.resumeName,
        resumeData: resumeAttachment ? resumeAttachment.content : null,
        status: 'NEW',
      },
    });

    // 2. Attempt to send Brevo notification email (non-blocking failure)
    try {
      const apiKey = process.env.BREVO_API_KEY;
      const fromEmail = process.env.BREVO_FROM_EMAIL;
      const leadsEmail = process.env.LEADS_NOTIFICATION_EMAIL;

      if (apiKey && fromEmail && leadsEmail) {
        const linkedinUrl = data.linkedin ? safeHttpUrl(data.linkedin) : null;
        const portfolioUrl = data.portfolio ? safeHttpUrl(data.portfolio) : null;
        const brevoPayload: Record<string, unknown> = {
          sender: { email: fromEmail, name: process.env.BREVO_FROM_NAME ?? 'ROI Makers' },
          to: [{ email: leadsEmail }],
          replyTo: { email: data.email },
          subject: `New Career Application Received — ${data.position.replace(/[\r\n]/g, ' ')}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #060010;">
              <h2 style="color: #060010; border-bottom: 2px solid #8c7b62; padding-bottom: 10px;">New Career Application Received</h2>
              
              <div style="margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>Applicant Name:</strong> ${escapeHtml(data.name)}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> ${escapeHtml(data.phone) || 'Not provided'}</p>
                <p style="margin: 8px 0;"><strong>Position Applied:</strong> ${escapeHtml(data.position)}</p>
                ${data.experience ? `<p style="margin: 8px 0;"><strong>Experience:</strong> ${escapeHtml(data.experience)} years</p>` : ''}
                ${linkedinUrl ? `<p style="margin: 8px 0;"><strong>LinkedIn:</strong> <a href="${escapeHtml(linkedinUrl)}">${escapeHtml(linkedinUrl)}</a></p>` : data.linkedin ? `<p style="margin: 8px 0;"><strong>LinkedIn:</strong> ${escapeHtml(data.linkedin)}</p>` : ''}
                ${portfolioUrl ? `<p style="margin: 8px 0;"><strong>Portfolio:</strong> <a href="${escapeHtml(portfolioUrl)}">${escapeHtml(portfolioUrl)}</a></p>` : data.portfolio ? `<p style="margin: 8px 0;"><strong>Portfolio:</strong> ${escapeHtml(data.portfolio)}</p>` : ''}
              </div>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #060010; margin-top: 0;">Message / Cover Letter:</h3>
                <p style="white-space: pre-wrap; margin-bottom: 0;">${escapeHtml(data.message)}</p>
              </div>
              
              ${resumeAttachment ? `<p style="color: #8c7b62;"><strong>📎 Resume attached:</strong> ${escapeHtml(data.resumeName)}</p>` : '<p style="color: #999;">No resume attached</p>'}
              
              <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                Application ID: ${application.id} &bull; Submitted from ROI Makers Careers page
              </p>
            </div>
          `,
        };

        if (resumeAttachment) {
          brevoPayload.attachment = [resumeAttachment];
        }

        const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': apiKey, 'content-type': 'application/json' },
          body: JSON.stringify(brevoPayload),
        });

        if (!emailResponse.ok) {
          console.error('Brevo notification email failed with status:', emailResponse.status);
        }
      }
    } catch (emailErr) {
      console.error('Brevo notification email sending failed:', emailErr);
    }

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error('Careers submission error:', error);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
