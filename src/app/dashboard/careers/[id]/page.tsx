import { notFound } from 'next/navigation';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { CareerDetailClient } from './CareerDetailClient';

export default async function CareerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireProfile(Role.ADMIN);
  const { id } = await params;

  const application = await prisma.careerApplication.findUnique({
    where: { id },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#060010]">
            Career Application Details
          </h1>
          <p className="text-stone-500 mt-1">
            Application for {application.position} from {application.name}
          </p>
        </div>
      </div>

      <CareerDetailClient application={application} />
    </div>
  );
}
