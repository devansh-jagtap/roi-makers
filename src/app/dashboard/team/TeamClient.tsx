'use client';

import { useState } from 'react';
import { Mail, UserPlus, Shield, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';

type Profile = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  active: boolean;
  createdAt: string | Date;
};

export function TeamClient({ initialTeam }: { initialTeam: Profile[] }) {
  const [team, setTeam] = useState(initialTeam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string; action: string; role?: string } | null>(null);
  const { toast } = useToast();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/dashboard/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: inviteName, email: inviteEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to invite user');
      
      setTeam([...team, { ...data.profile, createdAt: new Date(data.profile.createdAt).toISOString() }]);
      setInviteName('');
      setInviteEmail('');
      toast('Invitation sent successfully.', 'success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!pendingAction) return;
    const { id, action, role } = pendingAction;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/dashboard/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      
      setTeam(team.map(p => p.id === id ? { ...p, ...data.profile, createdAt: new Date(data.profile.createdAt).toISOString() } : p));
      toast(action === 'disable' ? 'Team member disabled successfully.' : 'Team member updated successfully.', 'success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3 shadow-sm">
          <ShieldAlert size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#060010] flex items-center gap-2">
            <UserPlus size={20} className="text-[#f26b38]" /> Invite New Member
          </h2>
          <p className="text-sm text-stone-500 mt-1">Send an invitation email to a new team member.</p>
        </div>
        
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">Name</label>
            <input 
              required 
              value={inviteName} 
              onChange={e => setInviteName(e.target.value)} 
              placeholder="John Doe"
              className="w-full border border-stone-200 bg-stone-50 focus:bg-white p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#f26b38] transition-all" 
            />
          </div>
          <div className="w-full sm:w-1/3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                required 
                type="email" 
                value={inviteEmail} 
                onChange={e => setInviteEmail(e.target.value)} 
                placeholder="john@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-stone-200 bg-stone-50 focus:bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#f26b38] transition-all" 
              />
            </div>
          </div>
          <button 
            disabled={loading} 
            className="w-full sm:w-auto bg-[#060010] hover:bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Inviting...' : 'Send Invitation'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center gap-2">
          <Shield size={20} className="text-[#060010]" />
          <h2 className="text-lg font-semibold text-[#060010]">Active Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-5 py-4">Name / Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {team.map((p) => (
                <tr className="hover:bg-stone-50/50 transition-colors" key={p.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm font-medium text-stone-600">
                        {(p.name || p.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#060010]">{p.name || '—'}</div>
                        <div className="text-xs text-stone-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase ${
                      p.role === 'ADMIN' ? 'bg-[#f26b38]/10 text-[#f26b38]' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {p.active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700">
                        <XCircle size={12} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-stone-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-xs font-medium">
                      <button 
                        onClick={() => setPendingAction({ id: p.id, action: 'setRole', role: p.role === 'ADMIN' ? 'MEMBER' : 'ADMIN' })} 
                        disabled={loading} 
                        className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
                      >
                        Make {p.role === 'ADMIN' ? 'Member' : 'Admin'}
                      </button>
                      <span className="text-stone-300">|</span>
                      {p.active ? (
                        <button 
                          onClick={() => setPendingAction({ id: p.id, action: 'disable' })} 
                          disabled={loading} 
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                        >
                          Disable
                        </button>
                      ) : (
                        <button 
                          onClick={() => setPendingAction({ id: p.id, action: 'enable' })} 
                          disabled={loading} 
                          className="text-green-600 hover:text-green-800 disabled:opacity-50 transition-colors"
                        >
                          Enable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AlertDialog open={!!pendingAction} title={pendingAction?.action === 'disable' ? 'Disable this team member?' : 'Update this team member?'} description={pendingAction?.action === 'disable' ? 'They will no longer be able to access the dashboard.' : 'This change will update this member’s dashboard access.'} confirmLabel={pendingAction?.action === 'disable' ? 'Disable Member' : 'Confirm Update'} loading={loading} onCancel={() => setPendingAction(null)} onConfirm={handleAction} />
    </div>
  );
}
