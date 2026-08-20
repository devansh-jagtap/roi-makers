'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareerApplicationStatus } from '@prisma/client';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  FileText,
  Clock,
  Trash2,
  ShieldAlert,
  ExternalLink,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { CareerApplicationItem } from '../CareersListClient';

const statusColors: Record<CareerApplicationStatus, string> = {
  NEW: 'text-blue-700 bg-blue-50 border-blue-200',
  REVIEWING: 'text-amber-700 bg-amber-50 border-amber-200',
  SHORTLISTED: 'text-purple-700 bg-purple-50 border-purple-200',
  REJECTED: 'text-red-700 bg-red-50 border-red-200',
  HIRED: 'text-green-700 bg-green-50 border-green-200',
};

export function CareerDetailClient({
  application,
}: {
  application: CareerApplicationItem;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<CareerApplicationStatus>(application.status);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const hasStatusChanged = status !== application.status;

  const handleSaveStatus = async () => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/dashboard/careers/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast('Application status updated successfully.', 'success');
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Failed to update application status.', 'error');
      }
    } catch {
      toast('Unable to update application status. Please try again.', 'error');
    }
    setSavingStatus(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/careers/${application.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast('Application deleted successfully.', 'success');
        router.push('/dashboard/careers');
      } else {
        const data = await res.json().catch(() => null);
        toast(data?.error || 'Failed to delete application.', 'error');
      }
    } catch {
      toast('Unable to delete application. Please try again.', 'error');
    }
    setDeleting(false);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CareerApplicationStatus)}
              className={`appearance-none font-medium text-sm rounded-lg pl-3 pr-8 py-2 border outline-none focus:ring-2 focus:ring-[#f26b38] transition-colors ${
                statusColors[status] || 'bg-white border-stone-200 text-stone-700'
              }`}
            >
              <option value="NEW">NEW</option>
              <option value="REVIEWING">REVIEWING</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="HIRED">HIRED</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {hasStatusChanged && (
            <button
              onClick={handleSaveStatus}
              disabled={savingStatus}
              className="flex items-center gap-1.5 rounded-lg bg-[#060010] hover:bg-black px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-70"
            >
              {savingStatus ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={16} /> Save Status
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleting}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16} /> Delete Application
          </button>
        </div>
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        title="Delete this career application?"
        description="This action cannot be undone and will permanently remove this application."
        confirmLabel="Delete Application"
        loading={deleting}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <User size={18} className="text-[#f26b38]" /> Applicant Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Full Name</p>
              <p className="font-medium text-[#060010]">{application.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 p-2 rounded-lg text-stone-500">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Email</p>
                <a href={`mailto:${application.email}`} className="font-medium text-[#f26b38] hover:underline">
                  {application.email}
                </a>
              </div>
            </div>
            {application.phone && (
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-semibold">Phone</p>
                  <a href={`tel:${application.phone}`} className="font-medium text-[#060010] hover:text-[#f26b38]">
                    {application.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Position & Profiles */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <Briefcase size={18} className="text-[#f26b38]" /> Position & Links
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Position Applied</p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {application.position}
              </span>
            </div>

            {application.experience && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold">Experience</p>
                <p className="font-medium text-[#060010]">{application.experience} years</p>
              </div>
            )}

            {application.linkedin && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Globe size={14} /> LinkedIn
                </p>
                <a
                  href={application.linkedin.startsWith('http') ? application.linkedin : `https://${application.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#f26b38] hover:underline"
                >
                  {application.linkedin} <ExternalLink size={12} />
                </a>
              </div>
            )}

            {application.portfolio && (
              <div>
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Globe size={14} /> Portfolio / Website
                </p>
                <a
                  href={application.portfolio.startsWith('http') ? application.portfolio : `https://${application.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#f26b38] hover:underline"
                >
                  {application.portfolio} <ExternalLink size={12} />
                </a>
              </div>
            )}

            {application.resumeName && (
              <div className="pt-2 border-t border-stone-100">
                <p className="text-xs text-stone-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <FileText size={14} /> Resume File
                </p>
                <p className="text-sm font-medium text-stone-700 flex items-center gap-1.5">
                  📎 {application.resumeName}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message / Cover Letter */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <FileText size={18} className="text-[#f26b38]" /> Message / Cover Letter
            </h2>
          </div>
          <div className="p-5">
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
              {application.message}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <h2 className="font-semibold text-[#060010] flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#f26b38]" /> System Record Info
            </h2>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Submitted At</p>
                  <p className="font-medium text-[#060010] text-sm">
                    {new Date(application.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Last Updated</p>
                  <p className="font-medium text-[#060010] text-sm">
                    {new Date(application.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-stone-100 p-2 rounded-lg text-stone-500">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Application ID</p>
                  <p className="font-medium text-stone-700 text-xs truncate max-w-[180px]" title={application.id}>
                    {application.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
