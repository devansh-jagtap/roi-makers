'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const BOT_NAME = 'Remy';
const BOT_TAGLINE = 'ROI Makers AI — always online';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm ${BOT_NAME}, your ROI Makers assistant 👋 How can I help you today?`,
    },
  ]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear unread badge when chat is opened
  useEffect(() => {
    if (open) setHasUnread(false);
  }, [open]);

  async function sendMessage() {
    const message = input.trim();
    if (!message || loading) return;

    setInput('');
    setMessages((current) => [
      ...current,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value, { stream: true });

        setMessages((current) => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((current) => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, I'm having trouble responding right now. Please try again.`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Chat Panel ── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-zinc-900">
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

            <button
              onClick={() => setOpen(false)}
              className="text-2xl opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content ||
                    (loading && index === messages.length - 1 ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce [animation-delay:0.1s]">•</span>
                        <span className="animate-bounce [animation-delay:0.2s]">•</span>
                      </span>
                    ) : (
                      ''
                    ))}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage();
                }}
                placeholder="Ask something..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-black px-4 py-2 text-sm text-white transition-opacity disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB Toggle Button with pulse rings ── */}
      <div className="fixed bottom-6 right-6 z-50">
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