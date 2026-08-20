'use client';

import { useState } from 'react';
import { LeadStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function LeadStatusControl({ id, status }: { id: string; status: LeadStatus }) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function save() {
    setSaving(true);
    try {
      const response = await fetch(`/api/dashboard/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      });
      if (response.ok) {
        toast('Lead status updated successfully.', 'success');
        router.refresh();
      } else {
        const data = await response.json().catch(() => null);
        toast(data?.error || 'Unable to update the lead.', 'error');
      }
    } catch {
      toast('Unable to update the lead. Please try again.', 'error');
    }
    setSaving(false);
  }

  const hasChanged = value !== status;

  const statusColors: Record<string, string> = {
    NEW: 'text-blue-700 bg-blue-50 border-blue-200',
    CONTACTED: 'text-amber-700 bg-amber-50 border-amber-200',
    QUALIFIED: 'text-purple-700 bg-purple-50 border-purple-200',
    PROPOSAL: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    WON: 'text-green-700 bg-green-50 border-green-200',
    LOST: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value as LeadStatus)}
          className={`appearance-none font-medium text-sm rounded-lg pl-3 pr-8 py-2 border outline-none focus:ring-2 focus:ring-[#f26b38] transition-colors ${statusColors[value] || 'bg-white border-stone-200 text-stone-700'}`}
        >
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      
      {hasChanged && (
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 rounded-lg bg-[#060010] hover:bg-black px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-70"
        >
          {saving ? (
            <span className="flex items-center gap-2">Saving...</span>
          ) : (
            <>
              <Save size={16} /> Save Status
            </>
          )}
        </button>
      )}
    </div>
  );
}
