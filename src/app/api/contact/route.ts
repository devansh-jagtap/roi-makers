import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const data = await request.json();
    
    const { error } = await resend.emails.send({
      from: 'ROI Makers <devanshjagtap2@gmail.com>',
      to: 'info@roimakers.in',
      replyTo: data.email,
      subject: `New Contact Form: ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #060010; border-bottom: 2px solid #8c7b62; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p style="margin: 10px 0;"><strong>Company:</strong> ${data.company || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${data.service}</p>
            <p style="margin: 10px 0;"><strong>Budget:</strong> ${data.budget}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #060010; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submitted from ROI Makers contact form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
