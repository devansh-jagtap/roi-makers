'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Sparkles, X } from 'lucide-react';
import { ChatMarkdown } from '@/components/chat/ChatMarkdown';

/**
 * The internal assistant, docked to the right of the dashboard.
 *
 * Read-only by design: it answers questions about the pipeline and drafts
 * follow-ups, but never changes a record. The server enforces that — this panel
 * just makes it legible, showing which tool is running so the employee can see
 * where an answer came from.
 */

type Props = {
  open: boolean;
  onClose: () => void;
  role: 'ADMIN' | 'MEMBER';
  name: string | null;
};

/** Tool names shown as activity chips while a lookup runs. */
const TOOL_LABELS: Record<string, string> = {
  'tool-myLeads': 'Reading your leads',
  'tool-searchLeads': 'Searching leads',
  'tool-getLead': 'Opening lead',
  'tool-leadStats': 'Counting the pipeline',
  'tool-subscriberStats': 'Reading subscribers',
  'tool-careerApplications': 'Reading applications',
  'tool-teamOverview': 'Reading the team',
  'tool-draftFollowUp': 'Pulling lead context',
};

const MEMBER_STARTERS = [
  'What are my open leads?',
  'Which of my leads went quiet?',
  'How many leads came in this month?',
];

const ADMIN_STARTERS = [
  'How is the pipeline looking this month?',
  'Which leads are still unassigned?',
  'Show me leads from the site chatbot',
];

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

/** Every tool this message touched, with whether it has finished. */
function toolActivity(message: UIMessage) {
  return message.parts
    .filter((part) => part.type.startsWith('tool-'))
    .map((part) => ({
      label: TOOL_LABELS[part.type] ?? part.type.replace(/^tool-/, ''),
      done: (part as { state?: string }).state === 'output-available',
    }));
}

export function AssistantPanel({ open, onClose, role, name }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // A ref, not state: StrictMode double-invokes effects in development, and a
  // state flag would make the second pass skip the restore entirely.
  const restoredRef = useRef(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/dashboard/assistant' }),
    [],
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Pick the thread back up where it was left, from server-side memory.
  useEffect(() => {
    if (!open || restoredRef.current) return;
    restoredRef.current = true;

    fetch('/api/dashboard/assistant')
      .then((response) => (response.ok ? response.json() : { messages: [] }))
      .then((data: { messages?: UIMessage[] }) => {
        if (!data.messages?.length) return;
        // Never clobber a thread the employee has already started typing into.
        setMessages((current) => (current.length === 0 ? data.messages! : current));
      })
      .catch(() => {
        /* A missing thread just means starting fresh. */
      });
  }, [open, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel, matching the mobile nav overlay behaviour.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  function submit(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput('');
    void sendMessage({ text: message });
  }

  const starters = role === 'ADMIN' ? ADMIN_STARTERS : MEMBER_STARTERS;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-black/10 bg-[#f7f4ee] text-[#060010] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#060010] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f26b38]/20">
              <Sparkles size={18} className="text-[#f26b38]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-none">Assistant</h2>
              <p className="mt-1 text-xs text-stone-400">
                Read-only · answers from your dashboard data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thread */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-stone-600">
                {name ? `Hi ${name.split(' ')[0]}. ` : ''}Ask me about your leads, the
                pipeline, or get a follow-up email drafted. I can read your dashboard data
                but I can&apos;t change anything.
              </p>
              <div className="space-y-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => submit(starter)}
                    className="block w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-left text-sm text-stone-700 transition-colors hover:border-[#f26b38] hover:text-[#060010]"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = messageText(message);
            const tools = message.role === 'assistant' ? toolActivity(message) : [];
            if (!text && !tools.length) return null;

            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={message.role === 'user' ? 'max-w-[85%]' : 'w-full'}>
                  {tools.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {tools.map((tool, index) => (
                        <span
                          key={`${tool.label}-${index}`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            tool.done
                              ? 'bg-[#f26b38]/10 text-[#b84d24]'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tool.done ? 'bg-[#f26b38]' : 'animate-pulse bg-stone-500'
                            }`}
                          />
                          {tool.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {text && (
                    <div
                      className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'whitespace-pre-wrap bg-[#060010] text-white'
                          : 'border border-black/5 bg-white text-[#060010]'
                      }`}
                    >
                      {message.role === 'user' ? text : <ChatMarkdown text={text} />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === 'submitted' && (
            <div className="flex gap-1 px-1 text-stone-500">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce [animation-delay:0.1s]">•</span>
              <span className="animate-bounce [animation-delay:0.2s]">•</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              Something went wrong reaching the assistant. Please try again.
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="border-t border-black/10 bg-white p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              rows={1}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about your leads…"
              disabled={busy}
              className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#f26b38] disabled:opacity-60"
            />
            <button
              onClick={() => submit(input)}
              disabled={busy || !input.trim()}
              className="rounded-lg bg-[#060010] px-4 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="mt-2 px-1 text-[11px] text-stone-500">
            Read-only. Always double-check anything before acting on it.
          </p>
        </div>
      </aside>
    </>
  );
}
