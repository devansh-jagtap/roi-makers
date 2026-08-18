import { NextResponse } from 'next/server';
import { withinRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!withinRateLimit(`career:${ip}`, 5)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_FROM_EMAIL || !process.env.LEADS_NOTIFICATION_EMAIL) return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
    const formData = await request.formData();
    
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      linkedin: formData.get('linkedin') as string,
      portfolio: formData.get('portfolio') as string,
      experience: formData.get('experience') as string,
      coverLetter: formData.get('coverLetter') as string,
    };
    
    const resume = formData.get('resume') as File | null;
    
    const attachments: { name: string; content: string }[] = [];
    if (resume && resume.size > 0) {
      if (resume.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Resume must be under 5 MB.' }, { status: 400 });
      const buffer = await resume.arrayBuffer();
      attachments.push({
        name: resume.name,
        content: Buffer.from(buffer).toString('base64'),
      });
    }
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
      sender: { email: process.env.BREVO_FROM_EMAIL, name: process.env.BREVO_FROM_NAME ?? 'ROI Makers' },
      to: [{ email: process.env.LEADS_NOTIFICATION_EMAIL }],
      replyTo: { email: data.email },
      subject: `Job Application: ${data.position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #060010; border-bottom: 2px solid #8c7b62; padding-bottom: 10px;">New Job Application</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Position:</strong> ${data.position}</p>
            <p style="margin: 10px 0;"><strong>Experience:</strong> ${data.experience} years</p>
            ${data.linkedin ? `<p style="margin: 10px 0;"><strong>LinkedIn:</strong> <a href="${data.linkedin}">${data.linkedin}</a></p>` : ''}
            ${data.portfolio ? `<p style="margin: 10px 0;"><strong>Portfolio:</strong> <a href="${data.portfolio}">${data.portfolio}</a></p>` : ''}
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #060010; margin-top: 0;">Cover Letter:</h3>
            <p style="white-space: pre-wrap;">${data.coverLetter}</p>
          </div>
          
          ${resume ? '<p style="color: #8c7b62;"><strong>📎 Resume attached</strong></p>' : '<p style="color: #999;">No resume attached</p>'}
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submitted from ROI Makers careers page
          </p>
        </div>
      `,
      attachment: attachments.length > 0 ? attachments : undefined,
      }),
    });

    if (!response.ok) {
      console.error('Brevo error:', response.status);
      return NextResponse.json({ error: 'Unable to send application' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Careers form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
