import { requireProfile } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  return (
    <section className="dashboard-theme">
    <DashboardShell profile={profile}>
      {children}
    </DashboardShell>
    </section>
  );
}
