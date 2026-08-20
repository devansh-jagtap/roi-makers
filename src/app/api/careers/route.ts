import { NextResponse } from 'next/server';
import { withinRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!withinRateLimit(`career:${ip}`, 5)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();

    const escapeHtml = (unsafe: string | null | undefined) =>
      (unsafe || '').replace(/[&<"'>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c as keyof typeof escapeHtml]);

    const rawName = (formData.get('name') as string)?.trim();
    const rawEmail = (formData.get('email') as string)?.trim();
    const rawPhone = (formData.get('phone') as string)?.trim();
    const rawPosition = (formData.get('position') as string)?.trim();
    const rawLinkedin = (formData.get('linkedin') as string)?.trim();
    const rawPortfolio = (formData.get('portfolio') as string)?.trim();
    const rawExperience = (formData.get('experience') as string)?.trim();
    const rawMessage = ((formData.get('message') || formData.get('coverLetter')) as string)?.trim();

    if (!rawName || !rawEmail || !rawPosition || !rawMessage) {
      return NextResponse.json({ error: 'Name, email, position, and message are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const resume = formData.get('resume') as File | null;
    let resumeAttachment: { name: string; content: string } | null = null;

    if (resume && resume.size > 0) {
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Resume must be under 5 MB.' }, { status: 400 });
      }
      if (!resume.type.includes('pdf') && !resume.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({ error: 'Resume must be a PDF file.' }, { status: 400 });
      }
      const buffer = await resume.arrayBuffer();
      resumeAttachment = {
        name: escapeHtml(resume.name),
        content: Buffer.from(buffer).toString('base64'),
      };
    }

    const data = {
      name: escapeHtml(rawName),
      email: escapeHtml(rawEmail),
      phone: rawPhone ? escapeHtml(rawPhone) : null,
      position: escapeHtml(rawPosition),
      linkedin: rawLinkedin ? escapeHtml(rawLinkedin) : null,
      portfolio: rawPortfolio ? escapeHtml(rawPortfolio) : null,
      experience: rawExperience ? escapeHtml(rawExperience) : null,
      message: escapeHtml(rawMessage),
      resumeName: resume && resume.size > 0 ? resume.name : null,
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
        const brevoPayload: Record<string, unknown> = {
          sender: { email: fromEmail, name: process.env.BREVO_FROM_NAME ?? 'ROI Makers' },
          to: [{ email: leadsEmail }],
          replyTo: { email: data.email },
          subject: `New Career Application Received — ${data.position}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #060010;">
              <h2 style="color: #060010; border-bottom: 2px solid #8c7b62; padding-bottom: 10px;">New Career Application Received</h2>
              
              <div style="margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>Applicant Name:</strong> ${data.name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                <p style="margin: 8px 0;"><strong>Position Applied:</strong> ${data.position}</p>
                ${data.experience ? `<p style="margin: 8px 0;"><strong>Experience:</strong> ${data.experience} years</p>` : ''}
                ${data.linkedin ? `<p style="margin: 8px 0;"><strong>LinkedIn:</strong> <a href="${data.linkedin}">${data.linkedin}</a></p>` : ''}
                ${data.portfolio ? `<p style="margin: 8px 0;"><strong>Portfolio:</strong> <a href="${data.portfolio}">${data.portfolio}</a></p>` : ''}
              </div>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #060010; margin-top: 0;">Message / Cover Letter:</h3>
                <p style="white-space: pre-wrap; margin-bottom: 0;">${data.message}</p>
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
