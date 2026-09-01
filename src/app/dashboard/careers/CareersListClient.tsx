'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type CareerApplicationStatus } from '@/lib/domain';
import { Search, Filter, Briefcase, FileText, Download, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type CareerApplicationItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  linkedin: string | null;
  portfolio: string | null;
  experience: string | null;
  message: string;
  resumeName: string | null;
  status: CareerApplicationStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const statusColors: Record<CareerApplicationStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800 border-blue-200',
  REVIEWING: 'bg-amber-100 text-amber-800 border-amber-200',
  SHORTLISTED: 'bg-purple-100 text-purple-800 border-purple-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  HIRED: 'bg-green-100 text-green-800 border-green-200',
};

export function CareersListClient({
  initialApplications,
}: {
  initialApplications: CareerApplicationItem[];
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredApplications = initialApplications.filter((app) => {
    const matchesSearch =
      (app.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (app.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (app.position?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name, email, position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-transparent border border-input rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-ring transition-colors shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="REVIEWING">REVIEWING</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="HIRED">HIRED</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-medium border-b border-stone-200">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Position</th>
                <th className="px-5 py-4">Resume</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/careers/${app.id}`}
                      className="font-semibold text-[#060010] hover:text-[#f26b38]"
                    >
                      {app.name}
                    </Link>
                    <div className="text-stone-500 text-xs mt-0.5 flex items-center gap-2">
                      <span>{app.email}</span>
                      {app.phone && (
                        <>
                          <span className="text-stone-300">&bull;</span>
                          <span>{app.phone}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-800">
                      {app.position}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {app.resumeName ? (
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-stone-400 flex-shrink-0" />
                        <span className="text-xs text-stone-600 truncate max-w-[120px]" title={app.resumeName}>
                          {app.resumeName}
                        </span>
                        <a
                          href={`/api/dashboard/careers/${app.id}/resume?download=1`}
                          title="Download resume"
                          className="text-[#f26b38] hover:text-[#d95b2b] flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download size={13} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        statusColors[app.status] || 'bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-stone-500 text-xs">
                    {new Date(app.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/careers/${app.id}`}
                      className="inline-flex items-center gap-1 text-sm text-[#f26b38] hover:underline font-medium"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-stone-500">
                    <Briefcase className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                    <p className="font-medium text-stone-600">No career applications found</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {search || statusFilter !== 'ALL'
                        ? 'Try adjusting your search query or status filter.'
                        : 'New applications submitted through the careers form will appear here.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
