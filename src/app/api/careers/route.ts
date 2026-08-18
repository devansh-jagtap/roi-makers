import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
    }

    const resend = new Resend(apiKey);
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
    
    const attachments = [];
    if (resume && resume.size > 0) {
      const buffer = await resume.arrayBuffer();
      attachments.push({
        filename: resume.name,
        content: Buffer.from(buffer),
      });
    }
    
    const { error } = await resend.emails.send({
      from: 'ROI Makers <devanshjagtap2@gmail.com>',
      to: 'info@roimakers.in',
      replyTo: data.email,
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
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Careers form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
