import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { ChartAreaInteractive } from '@/components/dashboard/ChartAreaInteractive';
import { ChartPieLabelList } from '@/components/dashboard/ChartPieLabelList';
import { ChartBarInteractive } from '@/components/dashboard/ChartBarInteractive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Users, Percent } from 'lucide-react';

export default async function AnalyticsPage() {
  const profile = await requireProfile();
  const isAdmin = profile.role === 'ADMIN';

  const whereClause = isAdmin ? undefined : { assignedToId: profile.id };

  // --- Status breakdown ---
  const byStatus = await prisma.lead.groupBy({
    by: ['status'],
    where: whereClause,
    _count: { _all: true },
  });

  const statusData = byStatus.map((r) => ({
    status: r.status as string,
    count: r._count._all,
  }));

  // --- Service breakdown ---
  const byService = await prisma.lead.groupBy({
    by: ['service'],
    where: whereClause,
    _count: { _all: true },

  });

  const serviceData = byService
    .map((r) => ({
      service: r.service ?? 'Unknown',
      count: r._count._all,
    }))
    .sort((a, b) => b.count - a.count);

  // --- Daily lead activity for the area chart (last 90 days) ---
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentLeads = await prisma.lead.findMany({
    where: {
      ...whereClause,
      createdAt: { gte: ninetyDaysAgo },
    },
    select: { createdAt: true, status: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date
  const dailyMap: Record<string, { leads: number; won: number }> = {};
  for (const lead of recentLeads) {
    const dateKey = lead.createdAt.toISOString().split('T')[0];
    if (!dailyMap[dateKey]) dailyMap[dateKey] = { leads: 0, won: 0 };
    dailyMap[dateKey].leads += 1;
    if (lead.status === 'WON') dailyMap[dateKey].won += 1;
  }

  const dailyData = Object.entries(dailyMap)
    .map(([date, { leads, won }]) => ({ date, leads, won }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- KPI numbers ---
  const totalLeads = await prisma.lead.count({ where: whereClause });
  const wonLeads = await prisma.lead.count({ where: { ...whereClause, status: 'WON' } });
  const lostLeads = await prisma.lead.count({ where: { ...whereClause, status: 'LOST' } });
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const kpis = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Won Deals', value: wonLeads, icon: Trophy, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Lost Leads', value: lostLeads, icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Percent, color: 'text-[#f26b38]', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#060010]">Analytics</h1>
        <p className="text-stone-500 mt-1">Real-time insights from your lead pipeline.</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={kpi.bg}>
              <CardContent className="p-5 flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">{kpi.label}</p>
                  <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/60 shadow-sm">
                  <Icon size={20} className={kpi.color} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <ChartAreaInteractive data={dailyData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartPieLabelList data={serviceData} />
          <ChartBarInteractive data={statusData} />
        </div>
      </div>
    </div>
  );
}
