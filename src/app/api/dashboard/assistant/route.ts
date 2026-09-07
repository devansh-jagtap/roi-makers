import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { ChatAudience, ChatRole } from '@prisma/client';
import { requireApiProfile } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { chatModel, generationLimits, isAiConfigured } from '@/lib/ai/provider';
import { dashboardSystemPrompt } from '@/lib/ai/prompts';
import { dashboardTools } from '@/lib/ai/tools/dashboard';
import {
  appendMessage,
  dashboardSessionKey,
  getOrCreateConversation,
  loadHistory,
  loadUIHistory,
  maybeSummarise,
  purgeExpired,
  textFromUIMessage,
} from '@/lib/ai/memory';

/**
 * Agent 2 — the internal assistant for signed-in employees.
 *
 * Read-only against the CRM. Authentication is checked here; authorisation is
 * checked again inside every tool against the caller's own profile, so the model
 * cannot reach data the employee could not open in the dashboard themselves.
 */

// The assistant chains several read tools before answering; 30s proved too tight.
export const maxDuration = 60;

/** Replays this employee's own thread when the panel mounts. */
export async function GET() {
  const auth = await requireApiProfile();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const conversation = await prisma.chatConversation.findUnique({
    where: { sessionKey: dashboardSessionKey(auth.profile.id) },
    select: { id: true, expiresAt: true },
  });

  if (!conversation || conversation.expiresAt <= new Date()) {
    return NextResponse.json({ messages: [] });
  }

  return NextResponse.json({ messages: await loadUIHistory(conversation.id) });
}

export async function POST(request: Request) {
  const auth = await requireApiProfile();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: 'The assistant is not configured on this environment.' },
      { status: 503 },
    );
  }

  const { profile } = auth;

  let incoming: UIMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body?.messages)) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }
    incoming = body.messages as UIMessage[];
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const latest = incoming.at(-1);
  if (!latest || latest.role !== 'user') {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const userText = textFromUIMessage(latest);
  if (!userText || userText.length > 4000) {
    return NextResponse.json(
      { error: 'Message must be between 1 and 4000 characters.' },
      { status: 400 },
    );
  }

  void purgeExpired();

  try {
    const conversation = await getOrCreateConversation({
      audience: ChatAudience.DASHBOARD,
      sessionKey: dashboardSessionKey(profile.id),
      profileId: profile.id,
    });

    const history = await loadHistory(conversation);
    const latestModelMessages = await convertToModelMessages([latest]);

    await appendMessage({
      conversationId: conversation.id,
      role: ChatRole.USER,
      content: userText,
    });

    const result = streamText({
      model: chatModel,
      ...generationLimits,
      maxOutputTokens: 1600,
      system: dashboardSystemPrompt({
        name: profile.name,
        email: profile.email,
        role: profile.role,
      }),
      messages: [...history, ...latestModelMessages],
      tools: dashboardTools(profile),
      // Several read tools may be chained before an answer (find a lead, then
      // pull its detail, then draft), so allow a few more steps than the public bot.
      stopWhen: stepCountIs(8),
      onError: ({ error }) => {
        console.error('[ai] dashboard assistant stream failed', error);
      },
    });

    return result.toUIMessageStreamResponse({
      // Fires once the response has reached the client, with the assembled
      // assistant message including which tools ran.
      onFinish: async ({ responseMessage }) => {
        await appendMessage({
          conversationId: conversation.id,
          role: ChatRole.ASSISTANT,
          content: textFromUIMessage(responseMessage),
          parts: responseMessage.parts,
        });
        await maybeSummarise(conversation.id);
      },
      onError: (error) => {
        console.error('[ai] dashboard assistant stream error', error);
        return 'Something went wrong reaching the model. Please try that again.';
      },
    });
  } catch (error) {
    console.error('[ai] dashboard assistant failed', error);
    return NextResponse.json({ error: 'Unable to generate a response.' }, { status: 500 });
  }
}
