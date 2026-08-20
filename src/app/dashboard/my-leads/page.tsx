import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { LeadsClient } from '@/components/dashboard/LeadsClient';

export default async function MyLeadsPage() {
  const profile = await requireProfile();
  
  const leads = await prisma.lead.findMany({
    where: { assignedToId: profile.id },
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
            My Leads
          </h1>
          <p className="text-stone-500 mt-1">
            Manage leads that are currently assigned to you.
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
