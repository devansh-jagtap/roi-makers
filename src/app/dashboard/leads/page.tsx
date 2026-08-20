import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { LeadsClient } from '@/components/dashboard/LeadsClient';

export default async function LeadsPage() {
  const profile = await requireProfile();
  
  const leads = await prisma.lead.findMany({
    where: profile.role === 'ADMIN' ? undefined : { assignedToId: null },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#060010]">
            {profile.role === 'ADMIN' ? 'All Leads' : 'Available Leads'}
          </h1>
          <p className="text-stone-500 mt-1">
            {profile.role === 'ADMIN' 
              ? 'Manage and assign leads across the team.' 
              : 'View available leads and claim them.'}
          </p>
        </div>
      </div>
      
      <LeadsClient 
        initialLeads={leads} 
        profile={profile} 
      />
    </div>
  );
}
