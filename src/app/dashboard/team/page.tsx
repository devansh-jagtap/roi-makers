import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { TeamClient } from './TeamClient';

export default async function TeamPage() { 
  await requireProfile(Role.ADMIN); 
  const team = await prisma.profile.findMany({ orderBy: { createdAt: 'asc' } }); 
  
  return <TeamClient initialTeam={JSON.parse(JSON.stringify(team))} />; 
}
