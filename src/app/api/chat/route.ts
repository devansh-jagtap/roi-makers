import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { roiMakersSystemPrompt } from '@/lib/ai/prompt';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage || trimmedMessage.length > 2000) {
      return Response.json(
        { error: 'Message must be between 1 and 2000 characters.' },
        { status: 400 }
      );
    }

    const result = streamText({
      model: google('gemini-3.6-flash'),
      system: roiMakersSystemPrompt,
      prompt: trimmedMessage,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI chat error:', error);

    return Response.json(
      { error: 'Unable to generate a response.' },
      { status: 500 }
    );
  }
}