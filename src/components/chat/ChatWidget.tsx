'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ChatMarkdown } from './ChatMarkdown';

type Props = {
  /** Rendered only on the public site; the dashboard has its own assistant. */
  enabled?: boolean;
};

const BOT_NAME = 'Remy';
const BOT_TAGLINE = 'ROI Makers AI — always online';

const GREETING: UIMessage = {
  id: 'greeting',
  role: 'assistant',
  parts: [
    {
      type: 'text',
      text: `Hi! I'm ${BOT_NAME}, your ROI Makers assistant 👋 How can I help you today?`,
    },
  ],
};

const STARTERS = [
  'What services do you offer?',
  'Show me some results you have delivered',
  'I want a quote',
];

/** Tool names the visitor is told about while they run. Others stay silent. */
const TOOL_LABELS: Record<string, string> = {
  'tool-lookupService': 'Looking that service up…',
  'tool-listServices': 'Checking the service list…',
  'tool-listCaseStudies': 'Pulling up client results…',
  'tool-getFaqs': 'Checking the FAQs…',
  'tool-getOpenRoles': 'Checking open roles…',
  'tool-listBlogPosts': 'Finding articles…',
  'tool-getCompanyInfo': 'Checking company details…',
  'tool-captureLead': 'Sending your details to the team…',
};

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

/** The label for whichever tool is still running on this message, if any. */
function activeToolLabel(message: UIMessage): string | null {
  for (const part of message.parts) {
    if (!part.type.startsWith('tool-')) continue;
    const state = (part as { state?: string }).state;
    if (state === 'output-available' || state === 'output-error') continue;
    return TOOL_LABELS[part.type] ?? 'Looking that up…';
  }
  return null;
}

export function ChatWidget({ enabled = true }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  // A ref, not state: StrictMode double-invokes effects in development, and a
  // state flag plus an abort-on-cleanup would cancel the only fetch that ran.
  const restoredRef = useRef(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport,
    messages: [GREETING],
  });

  const busy = status === 'submitted' || status === 'streaming';

  // Restore the visitor's thread from server-side memory. The transcript lives
  // behind an httpOnly cookie, so this is the only way the client can see it.
  useEffect(() => {
    if (!open || restoredRef.current) return;
    restoredRef.current = true;

    fetch('/api/chat/history')
      .then((response) => (response.ok ? response.json() : { messages: [] }))
      .then((data: { messages?: UIMessage[] }) => {
        if (!data.messages?.length) return;
        // Only seed a thread the visitor has not started typing into, so a
        // late response can never clobber a live conversation.
        setMessages((current) =>
          current.length <= 1 ? [GREETING, ...data.messages!] : current,
        );
      })
      .catch(() => {
        /* An unrestorable thread is not worth surfacing — the greeting stands. */
      });
  }, [open, setMessages]);

  // Drive the container's own scrollTop rather than scrollIntoView: Lenis
  // hijacks scrollIntoView, which would scroll the page behind the widget
  // instead of the thread inside it.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, expanded]);

  useEffect(() => {
    if (open) setHasUnread(false);
    // Reopening should give the visitor the small card back, not whatever size
    // they happened to leave it at.
    else setExpanded(false);
  }, [open]);

  // Escape steps back one level: expanded → card → closed.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (expanded) setExpanded(false);
      else setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, expanded]);

  function submit(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput('');
    void sendMessage({ text: message });
  }

  if (!enabled) return null;

  const showStarters = messages.length <= 1 && !busy;

  return (
    <>
      {/* Backdrop, expanded only — clicking away drops back to the small card. */}
      {open && expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setExpanded(false)}
          aria-hidden
        />
      )}

      {/* ── Chat Panel ── */}
      {open && (
        <div
          className={
            expanded
              ? 'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[520px] flex-col overflow-hidden border-l border-black/10 bg-white shadow-2xl dark:bg-zinc-900'
              : 'fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-zinc-900'
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-black px-5 py-4 text-white dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              {/* Bot avatar with live dot */}
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {BOT_NAME[0]}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold leading-none">{BOT_NAME}</h2>
                <p className="mt-0.5 text-xs opacity-60">{BOT_TAGLINE}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded((value) => !value)}
                className="rounded-lg p-1.5 opacity-70 transition-opacity hover:bg-white/10 hover:opacity-100"
                aria-label={expanded ? 'Collapse chat' : 'Expand chat'}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="px-1 text-2xl leading-none opacity-70 transition-opacity hover:opacity-100"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages.
              data-lenis-prevent is load-bearing, not decoration: LenisProvider
              runs with smoothWheel, which preventDefaults wheel events across
              the document, so without this opt-out the thread cannot scroll at
              all once it overflows. */}
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4"
          >
            {messages.map((message) => {
              const text = messageText(message);
              const tool = message.role === 'assistant' ? activeToolLabel(message) : null;
              if (!text && !tool) return null;

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'whitespace-pre-wrap bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'user' ? text : <ChatMarkdown text={text} />}
                    {tool && (
                      <span className={`block text-xs italic opacity-60 ${text ? 'mt-1' : ''}`}>
                        {tool}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator, shown until the first token lands */}
            {status === 'submitted' && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-900">
                  <span className="flex items-center gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:0.1s]">•</span>
                    <span className="animate-bounce [animation-delay:0.2s]">•</span>
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">
                  Sorry, I&apos;m having trouble responding right now. Please try again.
                </div>
              </div>
            )}

            {showStarters && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => submit(starter)}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:border-primary hover:text-primary"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submit(input);
                }}
                placeholder="Ask something..."
                disabled={busy}
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => submit(input)}
                disabled={busy || !input.trim()}
                className="rounded-xl bg-black px-4 py-2 text-sm text-white transition-opacity disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB Toggle Button with pulse rings ──
          Hidden while expanded: the drawer runs to the bottom-right corner, so
          the FAB would sit on top of its own panel. */}
      <div className={`fixed bottom-6 right-6 z-50 ${open && expanded ? 'hidden' : ''}`}>
        {/* Pulse ring animations (only when chat is closed) */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
            <span className="absolute inset-[-6px] rounded-full bg-primary opacity-20 animate-ping [animation-delay:0.4s]" />
          </>
        )}

        <button
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition-transform duration-200 hover:scale-110"
          aria-label="Open ROI Makers assistant"
        >
          {open ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="text-sm font-bold tracking-wide">AI</span>
          )}

          {/* Red unread badge */}
          {!open && hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
              1
            </span>
          )}
        </button>
      </div>
    </>
  );
}
