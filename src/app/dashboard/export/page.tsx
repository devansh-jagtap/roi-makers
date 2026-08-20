import { requireProfile } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileSpreadsheet, Users, Mail, Briefcase } from 'lucide-react';

export default async function ExportPage() {
  const profile = await requireProfile();
  const isAdmin = profile.role === 'ADMIN';

  const exportOptions = [
    {
      kind: 'leads',
      title: isAdmin ? 'All Leads' : 'My Assigned Leads',
      description: isAdmin 
        ? 'Download all lead records including contact information, UTM sources, and assignment statuses.'
        : 'Download your assigned lead records with contact details and project requirements.',
      icon: Users,
      color: 'text-[#f26b38]',
      bg: 'bg-orange-50',
    },
    ...(isAdmin ? [
      {
        kind: 'subscribers',
        title: 'Newsletter Subscribers',
        description: 'Download active and unsubscribed email newsletter and blog subscribers.',
        icon: Mail,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        kind: 'careers',
        title: 'Career Applications',
        description: 'Download all applicant records, job positions, portfolio links, and review statuses.',
        icon: Briefcase,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
      },
    ] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#060010]">Export Data</h1>
        <p className="text-stone-500 mt-1">
          Download live database records in XLSX spreadsheet or CSV format.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <Card key={opt.kind} className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${opt.bg} ${opt.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-[#060010]">{opt.title}</h2>
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                      {opt.kind}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                  {opt.description}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <a
                    href={`/api/export/${opt.kind}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#060010] hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <FileSpreadsheet size={14} /> Excel (XLSX)
                  </a>
                  <a
                    href={`/api/export/${opt.kind}?format=csv`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors border border-stone-200"
                  >
                    <Download size={14} /> CSV
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
