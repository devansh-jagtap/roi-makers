'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Mail, 
  Briefcase,
  BarChart3, 
  Download, 
  Shield, 
  Menu, 
  X, 
  LogOut 
} from 'lucide-react';

type Profile = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  active: boolean;
  createdAt?: string | Date;
};

export function DashboardShell({ 
  profile, 
  children 
}: { 
  profile: Profile; 
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: profile.role === 'ADMIN' ? 'Leads' : 'Available Leads', href: '/dashboard/leads', icon: Users },
    { label: 'My Leads', href: '/dashboard/my-leads', icon: UserCheck },
    { label: 'Subscribers', href: '/dashboard/subscribers', icon: Mail },
    ...(profile.role === 'ADMIN' ? [{ label: 'Career Applications', href: '/dashboard/careers', icon: Briefcase }] : []),
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Export', href: '/dashboard/export', icon: Download },
    ...(profile.role === 'ADMIN' ? [{ label: 'Team', href: '/dashboard/team', icon: Shield }] : []),
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f4ee] text-[#060010]">
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#060010] text-white z-50 flex items-center justify-between px-4">
        <span className="font-bold text-xl">ROI Makers</span>
        <button onClick={toggleMobileMenu} className="p-2 text-stone-300 hover:text-white focus:outline-none">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#060010] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 hidden lg:block">
          <span className="font-bold text-2xl tracking-tight text-white">
            ROI Makers<span className="text-[#f26b38]">.</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto mt-16 lg:mt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-sm font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#f26b38]' : 'group-hover:text-stone-300'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {profile.name || 'User'}
              </p>
              <p className="text-xs text-stone-400 truncate">
                {profile.email}
              </p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              profile.role === 'ADMIN' ? 'bg-[#f26b38]/20 text-[#f26b38]' : 'bg-stone-800 text-stone-300'
            }`}>
              {profile.role}
            </span>
          </div>
          <form action="/api/auth/logout" method="post" className="w-full">
            <button 
              type="submit" 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-400 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen w-full overflow-hidden mt-16 lg:mt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
