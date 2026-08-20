import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { CareersListClient } from './CareersListClient';

export default async function CareerApplicationsPage() {
  await requireProfile(Role.ADMIN);

  const applications = await prisma.careerApplication.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#060010]">
            Career Applications
          </h1>
          <p className="text-stone-500 mt-1">
            Review and manage job applications submitted through the careers portal.
          </p>
        </div>
      </div>

      <CareersListClient initialApplications={applications} />
    </div>
  );
}
