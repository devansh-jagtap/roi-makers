'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LeadStatus } from '@prisma/client';
import { Search, Filter, LayoutGrid, List, CheckCircle, Clock } from 'lucide-react';

type Profile = {
  id: string;
  role: 'ADMIN' | 'MEMBER';
};

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  status: LeadStatus;
  createdAt: string;
  assignedToId: string | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
};

export function LeadsClient({ initialLeads, profile }: { initialLeads: Lead[], profile: Profile }) {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [claiming, setClaiming] = useState<string | null>(null);
  const router = useRouter();

  const filteredLeads = initialLeads.filter(lead => {
    const matchesSearch = (lead.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (lead.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
                          (lead.company?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClaim = async (leadId: string) => {
    setClaiming(leadId);
    try {
      const res = await fetch(`/api/dashboard/leads/${leadId}/claim`, { method: 'POST' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to claim lead. It might already be assigned.');
      }
    } catch (e) {
      alert('Error claiming lead');
    }
    setClaiming(null);
  };

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800 border-blue-200',
    CONTACTED: 'bg-amber-100 text-amber-800 border-amber-200',
    QUALIFIED: 'bg-purple-100 text-purple-800 border-purple-200',
    PROPOSAL: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    WON: 'bg-green-100 text-green-800 border-green-200',
    LOST: 'bg-red-100 text-red-800 border-red-200',
  };

  const renderTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-medium border-b border-stone-200">
            <tr>
              <th className="px-5 py-4">Name / Company</th>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Assigned To</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-[#060010] hover:text-[#f26b38]">
                    {lead.name}
                  </Link>
                  <div className="text-stone-500 text-xs mt-1">{lead.company || lead.email}</div>
                </td>
                <td className="px-5 py-4 text-stone-600">{lead.service || '-'}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[lead.status] || 'bg-stone-100 text-stone-800 border-stone-200'}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600">
                        {(lead.assignedTo.name || lead.assignedTo.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-stone-700">{lead.assignedTo.name || lead.assignedTo.email}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-stone-100 text-stone-600">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-stone-500 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  {!lead.assignedToId && profile.role === 'MEMBER' && (
                    <button 
                      onClick={() => handleClaim(lead.id)}
                      disabled={claiming === lead.id}
                      className="px-3 py-1.5 bg-[#f26b38] hover:bg-[#d95b2b] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {claiming === lead.id ? 'Claiming...' : 'Claim'}
                    </button>
                  )}
                  {profile.role === 'ADMIN' && (
                    <Link href={`/dashboard/leads/${lead.id}`} className="text-sm text-stone-500 hover:text-[#060010] font-medium">
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-stone-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderKanban = () => {
    const columns = Object.values(LeadStatus);
    
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)]">
        {columns.map(status => {
          const colLeads = filteredLeads.filter(l => l.status === status);
          return (
            <div key={status} className="flex-shrink-0 w-80 bg-stone-100/50 rounded-xl p-3 flex flex-col h-full border border-stone-200">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-semibold text-sm text-stone-700 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]?.split(' ')[0] || 'bg-stone-300'}`} />
                  {status}
                </h3>
                <span className="text-xs font-medium bg-white text-stone-500 px-2 py-0.5 rounded-full shadow-sm">
                  {colLeads.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colLeads.map(lead => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 hover:border-[#f26b38]/50 transition-colors cursor-pointer relative group">
                    <Link href={`/dashboard/leads/${lead.id}`} className="absolute inset-0 z-0" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-[#060010] text-sm line-clamp-1">{lead.name}</h4>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      {lead.company && <p className="text-xs text-stone-500 mb-3">{lead.company}</p>}
                      
                      <div className="flex items-center justify-between mt-4">
                        {lead.assignedTo ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-medium text-stone-600" title={lead.assignedTo.name || lead.assignedTo.email}>
                              {(lead.assignedTo.name || lead.assignedTo.email).charAt(0).toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                            Unassigned
                          </span>
                        )}
                        
                        {!lead.assignedToId && profile.role === 'MEMBER' && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClaim(lead.id); }}
                            disabled={claiming === lead.id}
                            className="px-2 py-1 bg-white border border-[#f26b38] text-[#f26b38] hover:bg-[#f26b38] hover:text-white text-[10px] font-medium rounded transition-colors disabled:opacity-50"
                          >
                            {claiming === lead.id ? '...' : 'Claim'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        <div className="flex-1 w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f26b38]/20 focus:border-[#f26b38] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#f26b38]/20 focus:border-[#f26b38] transition-all"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="flex bg-stone-100 rounded-lg p-1 border border-stone-200">
            <button 
              onClick={() => setView('table')}
              className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm text-[#060010]' : 'text-stone-400 hover:text-stone-600'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-[#060010]' : 'text-stone-400 hover:text-stone-600'}`}
              title="Kanban View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {view === 'table' ? renderTable() : renderKanban()}
    </div>
  );
}
