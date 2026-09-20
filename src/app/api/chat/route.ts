import { cookies } from 'next/headers';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { ChatAudience, ChatRole } from '@prisma/client';
import { chatModel, generationLimits, isAiConfigured } from '@/lib/ai/provider';
import { publicSystemPrompt } from '@/lib/ai/prompts';
import { publicTools } from '@/lib/ai/tools/public';
import {
  PUBLIC_SESSION_COOKIE,
  appendMessage,
  getOrCreateConversation,
  loadHistory,
  maybeSummarise,
  newSessionId,
  purgeExpired,
  retentionCookieMaxAge,
  textFromUIMessage,
} from '@/lib/ai/memory';
import { WINDOW, getClientIp, rateLimitAll, tooManyRequests } from '@/lib/rate-limit';
import { BodyTooLargeError, readJson } from '@/lib/http';

/**
 * Agent 1 — the public site assistant.
 *
 * Anonymous, rate limited, grounded in `src/data/site.ts`, and backed by a
 * 7-day conversation memory keyed to an httpOnly cookie. Its only write is
 * creating a lead, which requires the visitor's explicit confirmation first.
 */

// A tool-using turn can chain several model calls; 30s proved too tight in practice.
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isAiConfigured()) {
    return Response.json(
      { error: 'The assistant is not available right now.' },
      { status: 503 },
    );
  }

  // Anonymous, httpOnly session id. This is the only thing tying a visitor to
  // their thread — no login, no profiling, and it expires with the transcript.
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(PUBLIC_SESSION_COOKIE)?.value;
  const hadSession = Boolean(sessionId);

  // Layered limits: a burst cap per minute, then hourly and daily ceilings so
  // one visitor (or one IP) cannot run the model bill up over a long session.
  // Keyed on both the IP and the session cookie — spoofing one still hits the other.
  const ip = getClientIp(request);
  const limited = rateLimitAll([
    // Site-wide budget guard: even if every per-client key is defeated
    // (spoofed headers, no cookie), total model spend stays bounded.
    { key: 'chat:global:hour', limit: 600, windowMs: WINDOW.HOUR },
    { key: 'chat:global:day', limit: 3000, windowMs: WINDOW.DAY },
    { key: `chat:ip:min:${ip}`, limit: 12, windowMs: WINDOW.MINUTE },
    { key: `chat:ip:hour:${ip}`, limit: 80, windowMs: WINDOW.HOUR },
    { key: `chat:ip:day:${ip}`, limit: 250, windowMs: WINDOW.DAY },
    ...(hadSession
      ? [
          { key: `chat:sid:min:${sessionId}`, limit: 10, windowMs: WINDOW.MINUTE },
          { key: `chat:sid:day:${sessionId}`, limit: 150, windowMs: WINDOW.DAY },
        ]
      : []),
  ]);
  if (!limited.ok) {
    return tooManyRequests(limited, 'You are sending messages too quickly. Please wait a moment.');
  }

  let incoming: UIMessage[];
  try {
    // 64 KB is generous for a chat turn; the widget only sends the thread text.
    const body = await readJson<{ messages?: unknown; message?: unknown }>(request, 64 * 1024);

    // The widget sends `messages`; `message` is kept for older callers.
    if (Array.isArray(body?.messages)) {
      incoming = body.messages as UIMessage[];
    } else if (typeof body?.message === 'string') {
      incoming = [
        { id: 'legacy', role: 'user', parts: [{ type: 'text', text: body.message }] },
      ];
    } else {
      return Response.json({ error: 'Message is required.' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return Response.json({ error: 'Request body too large.' }, { status: 413 });
    }
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const latest = incoming.at(-1);
  if (!latest || latest.role !== 'user') {
    return Response.json({ error: 'Message is required.' }, { status: 400 });
  }

  const userText = textFromUIMessage(latest);
  if (!userText || userText.length > 2000) {
    return Response.json(
      { error: 'Message must be between 1 and 2000 characters.' },
      { status: 400 },
    );
  }

  void purgeExpired();

  if (!sessionId) {
    sessionId = newSessionId();
    cookieStore.set(PUBLIC_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: retentionCookieMaxAge(),
    });
  }

  try {
    const conversation = await getOrCreateConversation({
      audience: ChatAudience.PUBLIC,
      sessionKey: sessionId,
    });

    const history = await loadHistory(conversation);
    // Only the visitor's text is forwarded. Rebuilding the message from
    // `userText` drops any file/image/data parts a crafted client could attach,
    // which would otherwise be passed straight to the model.
    const latestModelMessages = await convertToModelMessages([
      { role: 'user', parts: [{ type: 'text', text: userText }] },
    ]);

    await appendMessage({
      conversationId: conversation.id,
      role: ChatRole.USER,
      content: userText,
    });

    const result = streamText({
      model: chatModel,
      ...generationLimits,
      system: publicSystemPrompt,
      messages: [...history, ...latestModelMessages],
      tools: publicTools({
        conversationId: conversation.id,
        // The widget fetches from the page the visitor is reading, so `referer`
        // is that page. Where they arrived from is not knowable here, so the
        // lead's `referrer` is left unset rather than filled with a wrong value.
        landingPage: request.headers.get('referer'),
      }),
      stopWhen: stepCountIs(5),
      onError: ({ error }) => {
        console.error('[ai] public chat stream failed', error);
      },
    });

    return result.toUIMessageStreamResponse({
      // Persist from here rather than from streamText: this fires once the
      // response has actually reached the client, and hands over the assembled
      // assistant message (tool parts included) that the widget will replay.
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
        console.error('[ai] public chat stream error', error);
        return "Sorry, I'm having trouble responding right now. Please try again.";
      },
    });
  } catch (error) {
    console.error('[ai] public chat failed', error);
    return Response.json({ error: 'Unable to generate a response.' }, { status: 500 });
  }
}
