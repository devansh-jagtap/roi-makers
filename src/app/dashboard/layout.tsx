import Link from 'next/link';
import { requireProfile } from '@/lib/auth';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const links = [['Overview', '/dashboard'], ['Leads', '/dashboard/leads'], ['Analytics', '/dashboard/analytics'], ['Subscribers', '/dashboard/subscribers'], ['Export', '/dashboard/export'], ...(profile.role === 'ADMIN' ? [['Team', '/dashboard/team']] : [])];
  return <div className="min-h-screen bg-[#f7f4ee] text-[#060010]"><header className="bg-[#060010] px-5 py-4 text-white flex flex-wrap justify-between gap-4"><Link href="/dashboard" className="font-bold">ROI Makers</Link><nav className="flex flex-wrap gap-4 text-sm">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><form action="/api/auth/logout" method="post"><button>Logout</button></form></header><main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main></div>;
}
