'use client';

import { useState } from 'react';

type Profile = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  active: boolean;
  createdAt: string;
};

export function TeamClient({ initialTeam }: { initialTeam: Profile[] }) {
  const [team, setTeam] = useState(initialTeam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string, role?: string) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Team</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleInvite} className="bg-white p-4 rounded-xl mb-6 shadow-sm flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm text-stone-600 mb-1">Name</label>
          <input required value={inviteName} onChange={e => setInviteName(e.target.value)} className="border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">Email</label>
          <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="border p-2 rounded" />
        </div>
        <button disabled={loading} className="bg-[#060010] text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Inviting...' : 'Invite Member'}
        </button>
      </form>

      <div className="rounded-xl bg-white overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((p) => (
              <tr className="border-t" key={p.id}>
                <td className="p-3">{p.name ?? '—'}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleAction(p.id, 'setRole', p.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')} disabled={loading} className="text-blue-600 hover:underline">
                    Make {p.role === 'ADMIN' ? 'Member' : 'Admin'}
                  </button>
                  {p.active ? (
                    <button onClick={() => handleAction(p.id, 'disable')} disabled={loading} className="text-red-600 hover:underline">Disable</button>
                  ) : (
                    <button onClick={() => handleAction(p.id, 'enable')} disabled={loading} className="text-green-600 hover:underline">Enable</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
