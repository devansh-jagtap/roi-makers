import { LeadStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import Link from 'next/link';
import { 
  Users, UserCheck, Inbox, CheckCircle2, 
  Trophy, UserPlus, ShieldAlert, Clock,
  ArrowRight, Briefcase, FileCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function DashboardPage() {
  const profile = await requireProfile();
  const isAdmin = profile.role === 'ADMIN';

  let metrics;

  if (isAdmin) {
    const [
      total, newLeads, contacted, qualified, won, unassigned, activeMembers,
      totalCareers, newCareers
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'CONTACTED' } }),
      prisma.lead.count({ where: { status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { status: 'WON' } }),
      prisma.lead.count({ where: { assignedToId: null } }),
      prisma.profile.count({ where: { active: true } }),
      prisma.careerApplication.count(),
      prisma.careerApplication.count({ where: { status: 'NEW' } }),
    ]);

    metrics = [
      { label: 'Total Leads', value: total, icon: Users, color: 'text-stone-600', bg: 'bg-white' },
      { label: 'New Leads', value: newLeads, icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Contacted', value: contacted, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Qualified', value: qualified, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Won', value: won, icon: Trophy, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Unassigned', value: unassigned, icon: ShieldAlert, color: 'text-[#f26b38]', bg: 'bg-[#f26b38]/10' },
      { label: 'Career Apps', value: totalCareers, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'New Apps', value: newCareers, icon: FileCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
      { label: 'Active Team', value: activeMembers, icon: UserPlus, color: 'text-stone-600', bg: 'bg-white' }
    ];
  } else {
    const [
      myLeads, availableLeads, myNew, myQualified, myWon
    ] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: profile.id } }),
      prisma.lead.count({ where: { assignedToId: null } }),
      prisma.lead.count({ where: { assignedToId: profile.id, status: 'NEW' } }),
      prisma.lead.count({ where: { assignedToId: profile.id, status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { assignedToId: profile.id, status: 'WON' } })
    ]);

    metrics = [
      { label: 'My Leads', value: myLeads, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Available Leads', value: availableLeads, icon: Inbox, color: 'text-[#f26b38]', bg: 'bg-[#f26b38]/10' },
      { label: 'New', value: myNew, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Qualified', value: myQualified, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Won', value: myWon, icon: Trophy, color: 'text-green-600', bg: 'bg-green-50' }
    ];
  }

  const recentLeads = await prisma.lead.findMany({
    where: isAdmin ? undefined : {
      OR: [
        { assignedToId: profile.id },
        { assignedToId: null }
      ]
    },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#060010]">Dashboard Overview</h1>
        <p className="text-stone-500 mt-1">Welcome back, {profile.name || profile.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className={metric.bg}>
              <CardContent className="p-5 flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                    {metric.label}
                  </p>
                  <p className={`text-3xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-white/60 shadow-sm`}>
                  <Icon size={20} className={metric.color} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-stone-100 pb-4">
          <CardTitle className="text-lg font-semibold text-[#060010]">Recent Leads</CardTitle>
          <Link href="/dashboard/leads" className="text-sm text-[#f26b38] hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight size={16} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-5 py-3">Lead</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Assigned To</th>
                  <th className="px-5 py-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-[#060010] hover:text-[#f26b38]">
                        {lead.name}
                      </Link>
                      <div className="text-stone-500 text-xs mt-0.5">{lead.company || lead.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium 
                        ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-700' :
                          lead.status === 'WON' ? 'bg-green-50 text-green-700' :
                          lead.status === 'LOST' ? 'bg-red-50 text-red-700' :
                          lead.status === 'QUALIFIED' ? 'bg-purple-50 text-purple-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {lead.assignedTo ? (
                        <span className="text-sm text-stone-700">{lead.assignedTo.name || lead.assignedTo.email}</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-stone-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-stone-500">
                      No recent leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
