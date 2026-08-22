'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I’m the ROI Makers assistant. How can I help you today?',
    },
  ]);

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
        headers: {
          'Content-Type': 'application/json',
        },
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

        assistantMessage += decoder.decode(value, {
          stream: true,
        });

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
          content:
            'Sorry, I’m having trouble responding right now. Please try again.',
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
            <div>
              <h2 className="font-semibold">ROI Makers Assistant</h2>
              <p className="text-xs opacity-70">
                Usually replies instantly
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xl"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content ||
                    (loading && index === messages.length - 1
                      ? 'Thinking...'
                      : '')}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Ask something..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white shadow-xl"
        aria-label="Open ROI Makers assistant"
      >
        {open ? '×' : 'AI'}
      </button>
    </>
  );
}