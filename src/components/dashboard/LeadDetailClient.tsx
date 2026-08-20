'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LeadStatusControl } from './LeadStatusControl';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  User, Mail, Phone, Building, Briefcase, 
  DollarSign, MessageSquare, Globe, Link as LinkIcon, 
  Clock, Trash2, ShieldAlert
} from 'lucide-react';

export function LeadDetailClient({ lead, profile, teamMembers }: any) {
  const router = useRouter();
  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAssign = async (profileId: string | null) => {
    setAssigning(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId })
      });
      if (res.ok) {
        toast('Lead assignment updated successfully.', 'success');
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Failed to assign lead.', 'error');
      }
    } catch {
      toast('Unable to assign lead. Please try again.', 'error');
    }
    setAssigning(false);
  };

  const handleAssignToMe = async () => {
    setAssigning(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}/assign-to-me`, {
        method: 'POST',
      });
      if (res.ok) {
        toast('Lead assigned to you successfully.', 'success');
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Failed to assign lead to you.', 'error');
      }
    } catch {
      toast('Unable to assign lead. Please try again.', 'error');
    }
    setAssigning(false);
  };

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}/claim`, { method: 'POST' });
      if (res.ok) {
        toast('Lead claimed successfully.', 'success');
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Unable to claim this lead. It may have already been assigned.', 'error');
      }
    } catch {
      toast('Unable to claim this lead. Please try again.', 'error');
    }
    setClaiming(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead.id}`, { method: 'DELETE' });
      if (res.ok) { toast('Lead deleted successfully.', 'success'); router.push('/dashboard/leads'); }
      else { const data = await res.json().catch(() => null); toast(data?.error || 'Failed to delete lead.', 'error'); }
    } catch {
      toast('Unable to delete lead. Please try again.', 'error');
    }
    setDeleting(false);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <LeadStatusControl id={lead.id} status={lead.status} />
        </div>
        
        <div className="flex items-center gap-3">
          {profile.role === 'ADMIN' && (
            <div className="flex items-center gap-3 border-l border-stone-200 pl-4">
              <span className="text-sm font-medium text-stone-600">Assigned To:</span>
              <select
                disabled={assigning}
                value={lead.assignedToId || ''}
                onChange={(e) => handleAssign(e.target.value || null)}
                className="bg-stone-50 border border-stone-200 text-sm rounded-lg px-3 py-2 focus:ring-[#f26b38] focus:border-[#f26b38] outline-none"
              >
                <option value="">-- Unassigned --</option>
                {teamMembers.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name || m.email}{m.id === profile.id ? ' (You)' : ''}</option>
                ))}
              </select>

              {lead.assignedToId === profile.id ? (
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                  Assigned to you
                </span>
              ) : (
                <button
                  type="button"
                  disabled={assigning}
                  onClick={handleAssignToMe}
                  className="px-3 py-2 bg-[#f26b38] hover:bg-[#d95b2b] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Assign to me'}
                </button>
              )}
            </div>
          )}

          {profile.role === 'MEMBER' && !lead.assignedToId && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="px-4 py-2 bg-[#f26b38] hover:bg-[#d95b2b] text-white text-sm font-medium rounded-lg transition-colors"
            >
              {claiming ? 'Claiming...' : 'Claim Lead'}
            </button>
          )}

          {profile.role === 'ADMIN' && (
            <button
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ml-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
        </div>
      </div>
      <AlertDialog open={deleteDialogOpen} title="Delete this lead?" description="This action cannot be undone." confirmLabel="Delete Lead" loading={deleting} onCancel={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <User size={18} className="text-[#f26b38]" /> Contact Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Name</p>
              <p className="font-medium text-[#060010]">{lead.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 p-2 rounded-lg text-stone-500"><Mail size={16} /></div>
              <div>
                <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Email</p>
                <a href={`mailto:${lead.email}`} className="font-medium text-[#f26b38] hover:underline">{lead.email}</a>
              </div>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500"><Phone size={16} /></div>
                <div>
                  <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Phone</p>
                  <a href={`tel:${lead.phone}`} className="font-medium text-[#060010] hover:text-[#f26b38]">{lead.phone}</a>
                </div>
              </div>
            )}
            {lead.company && (
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500"><Building size={16} /></div>
                <div>
                  <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Company</p>
                  <p className="font-medium text-[#060010]">{lead.company}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <Briefcase size={18} className="text-[#f26b38]" /> Project Details
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {lead.service && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Service of Interest</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {lead.service}
                </span>
              </div>
            )}
            {lead.budget && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1"><DollarSign size={14} /> Budget</p>
                <p className="font-medium text-[#060010]">{lead.budget}</p>
              </div>
            )}
            {lead.message && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1"><MessageSquare size={14} /> Message</p>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-sm text-stone-700 whitespace-pre-wrap">
                  {lead.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attribution Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <Globe size={18} className="text-[#f26b38]" /> Attribution
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Source</p>
                <p className="font-medium text-[#060010]">{lead.source || 'Direct / Organic'}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Medium</p>
                <p className="font-medium text-[#060010]">{lead.utmMedium || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Campaign</p>
                <p className="font-medium text-[#060010]">{lead.utmCampaign || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Term</p>
                <p className="font-medium text-[#060010]">{lead.utmTerm || '-'}</p>
              </div>
            </div>
            
            {lead.landingPage && (
              <div className="pt-2 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1"><LinkIcon size={14} /> Landing Page</p>
                <p className="text-sm text-stone-600 truncate" title={lead.landingPage}>{lead.landingPage}</p>
              </div>
            )}
            {lead.referrer && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1"><Globe size={14} /> Referrer</p>
                <p className="text-sm text-stone-600 truncate" title={lead.referrer}>{lead.referrer}</p>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#f26b38]" /> System Info
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 p-2 rounded-lg text-stone-500"><Clock size={16} /></div>
              <div>
                <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Created At</p>
                <p className="font-medium text-[#060010]">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 p-2 rounded-lg text-stone-500"><Clock size={16} /></div>
              <div>
                <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Last Updated</p>
                <p className="font-medium text-[#060010]">{new Date(lead.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Welcome Email</p>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  lead.customerNotificationStatus === 'SENT' ? 'bg-green-100 text-green-800' :
                  lead.customerNotificationStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {lead.customerNotificationStatus}
                </span>
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Internal Alert</p>
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  lead.roiNotificationStatus === 'SENT' ? 'bg-green-100 text-green-800' :
                  lead.roiNotificationStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {lead.roiNotificationStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
