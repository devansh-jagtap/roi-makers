import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google('gemini-3.6-flash'),
      prompt: message,
    });

    return Response.json({
      message: result.text,
    });
  } catch (error) {
    console.error('AI chat error:', error);

    return Response.json(
      { error: 'Unable to generate a response.' },
      { status: 500 }
    );
  }
}