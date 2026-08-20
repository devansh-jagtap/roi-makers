import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { TeamClient } from './TeamClient';

export default async function TeamPage() { 
  await requireProfile(Role.ADMIN); 
  const team = await prisma.profile.findMany({ orderBy: { createdAt: 'asc' } }); 
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#060010]">Team Management</h1>
        <p className="text-stone-500 mt-1">Invite and manage team members.</p>
      </div>
      <TeamClient initialTeam={team} />
    </div>
  );
}
