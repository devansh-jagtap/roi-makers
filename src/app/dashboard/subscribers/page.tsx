import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireProfile } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Download, CheckCircle2, XCircle } from 'lucide-react';

export default async function SubscribersPage() {
  await requireProfile();
  
  const subscribers = await prisma.newsletterSubscriber.findMany({ 
    orderBy: { createdAt: 'desc' }, 
    take: 100 
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#060010]">
            Subscribers
          </h1>
          <p className="text-stone-500 mt-1">
            View newsletter and blog subscribers from the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export/subscribers"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#060010] hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Download size={14} /> Export XLSX
          </a>
          <a
            href="/api/export/subscribers?format=csv"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors border border-stone-200"
          >
            <Download size={14} /> CSV
          </a>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-medium border-b border-stone-200">
              <tr>
                <th className="px-5 py-4">Subscriber</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4 text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#060010]">{s.name || 'Anonymous'}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{s.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700">
                      {s.subscriptionType}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {s.status === 'SUBSCRIBED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 size={12} /> Subscribed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
                        <XCircle size={12} /> Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-stone-600 text-xs">
                    {s.source || 'Website Footer'}
                  </td>
                  <td className="px-5 py-4 text-right text-stone-500 text-xs">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-stone-500">
                    <Mail className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                    <p className="font-medium text-stone-600">No subscribers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
