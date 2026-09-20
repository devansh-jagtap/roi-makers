'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * The lightweight entry point for the public assistant.
 *
 * `ChatWidget` drags the AI SDK, react-markdown and remark-gfm into the bundle,
 * which every public page was paying for on first load even though most
 * visitors never open the chat. This component renders only the launcher
 * button; the real widget (and its dependencies) is fetched the first time the
 * visitor clicks it, and then stays mounted so the thread survives close/reopen.
 *
 * The button markup mirrors the FAB inside `ChatWidget` exactly, so the swap
 * on first click is invisible.
 */
const ChatWidget = dynamic(() => import('./ChatWidget').then((m) => m.ChatWidget), {
  ssr: false,
});

export function ChatLauncher() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) return <ChatWidget initialOpen />;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
      <span className="absolute inset-[-6px] rounded-full bg-primary opacity-20 animate-ping [animation-delay:0.4s]" />

      <button
        onClick={() => setLoaded(true)}
        onMouseEnter={() => void import('./ChatWidget')}
        onFocus={() => void import('./ChatWidget')}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition-transform duration-200 hover:scale-110"
        aria-label="Open ROI Makers assistant"
      >
        <span className="text-sm font-bold tracking-wide">AI</span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
          1
        </span>
      </button>
    </div>
  );
}
