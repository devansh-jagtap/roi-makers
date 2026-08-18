import { requireProfile } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  return (
    <DashboardShell profile={JSON.parse(JSON.stringify(profile))}>
      {children}
    </DashboardShell>
  );
}
