import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { LeadDetailClient } from '@/components/dashboard/LeadDetailClient';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile();
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  if (!lead) {
    notFound();
  }

  // If Member, they can view any lead but not reassign.
  // We'll fetch active team members only for admins so they can assign.
  let teamMembers: { id: string; name: string | null; email: string }[] = [];
  if (profile.role === 'ADMIN') {
    teamMembers = await prisma.profile.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true }
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#060010]">
            Lead Details
          </h1>
          <p className="text-stone-500 mt-1">
            View and manage information for {lead.name}
          </p>
        </div>
      </div>

      <LeadDetailClient 
        lead={JSON.parse(JSON.stringify(lead))}
        profile={JSON.parse(JSON.stringify(profile))}
        teamMembers={JSON.parse(JSON.stringify(teamMembers))}
      />
    </div>
  );
}
