'use client';

import { useEffect, useRef } from 'react';

export function AlertDialog({ open, title, description, confirmLabel, loading, onCancel, onConfirm }: {
  open: boolean; title: string; description: string; confirmLabel: string; loading?: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) cancelRef.current?.focus(); }, [open]);
  if (!open) return null;
  return <div role="presentation" className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel(); }}>
    <div role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 text-stone-950 shadow-2xl">
      <h2 id="dialog-title" className="text-lg font-semibold">{title}</h2><p id="dialog-description" className="mt-2 text-sm text-stone-600">{description}</p>
      <div className="mt-6 flex justify-end gap-3"><button ref={cancelRef} type="button" onClick={onCancel} disabled={loading} className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 disabled:opacity-50">Cancel</button><button type="button" onClick={onConfirm} disabled={loading} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{loading ? 'Working...' : confirmLabel}</button></div>
    </div>
  </div>;
}
