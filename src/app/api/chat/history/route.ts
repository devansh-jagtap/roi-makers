import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { PUBLIC_SESSION_COOKIE, loadUIHistory } from '@/lib/ai/memory';

/**
 * Replays the visitor's thread after a page reload.
 *
 * Reads only the conversation the caller's own httpOnly cookie points at, so a
 * visitor can never fetch someone else's transcript. Returns an empty list when
 * there is no cookie, no conversation, or the conversation has expired.
 */
export async function GET() {
  try {
    const sessionId = (await cookies()).get(PUBLIC_SESSION_COOKIE)?.value;
    if (!sessionId) return Response.json({ messages: [] });

    const conversation = await prisma.chatConversation.findUnique({
      where: { sessionKey: sessionId },
      select: { id: true, expiresAt: true },
    });

    if (!conversation || conversation.expiresAt <= new Date()) {
      return Response.json({ messages: [] });
    }

    return Response.json({ messages: await loadUIHistory(conversation.id) });
  } catch (error) {
    console.error('[ai] chat history failed', error);
    return Response.json({ messages: [] });
  }
}
