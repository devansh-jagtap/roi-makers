'use client';

import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders an assistant reply as markdown inside a chat bubble.
 *
 * Both assistants answer in markdown — bold names, bullet lists, and links to
 * site pages — so dumping the raw text shows asterisks and brackets. The styles
 * are kept tight so a bubble still reads like a message, not a document.
 */
type Props = {
  text: string;
  className?: string;
};

const components: Components = {
  p: ({ children }) => <p className="my-0 [&+*]:mt-2">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-current/60">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-current/60">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5 [&>p]:my-0">{children}</li>,
  h1: ({ children }) => <p className="mt-3 mb-1 font-semibold first:mt-0">{children}</p>,
  h2: ({ children }) => <p className="mt-3 mb-1 font-semibold first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mt-3 mb-1 font-semibold first:mt-0">{children}</p>,
  h4: ({ children }) => <p className="mt-2 mb-1 font-semibold first:mt-0">{children}</p>,
  hr: () => <hr className="my-3 border-current/15" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-current/25 pl-3 opacity-90">{children}</blockquote>
  ),
  code: ({ children, className }) => {
    const block = Boolean(className);
    return block ? (
      <code className="block overflow-x-auto rounded-lg bg-black/5 px-3 py-2 font-mono text-[0.8em] leading-relaxed">
        {children}
      </code>
    ) : (
      <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
    );
  },
  pre: ({ children }) => <pre className="my-2 whitespace-pre-wrap">{children}</pre>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-[0.9em]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-current/20 px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-current/10 px-2 py-1 align-top">{children}</td>,
  a: ({ href, children }) => {
    const url = href ?? '#';
    const internal = url.startsWith('/');
    const cls = 'font-medium text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-2 hover:decoration-[var(--brand)]';
    return internal ? (
      <Link href={url} className={cls}>
        {children}
      </Link>
    ) : (
      <a href={url} className={cls} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  },
};

export function ChatMarkdown({ text, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default ChatMarkdown;
