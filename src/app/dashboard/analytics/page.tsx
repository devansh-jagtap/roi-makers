import { prisma } from '@/lib/prisma';
import { ChartAreaInteractive } from '@/components/dashboard/ChartAreaInteractive';
import { ChartPieLabelList } from '@/components/dashboard/ChartPieLabelList';
import { ChartBarInteractive } from '@/components/dashboard/ChartBarInteractive';

export default async function AnalyticsPage() { 
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#060010]">Analytics</h1>
        <p className="text-stone-500 mt-1">Visualize lead distributions and metrics.</p>
      </div>
      <div className="grid gap-6">
        <ChartAreaInteractive />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartPieLabelList />
          <ChartBarInteractive />
        </div>
      </div>
    </div>
  ); 
}
