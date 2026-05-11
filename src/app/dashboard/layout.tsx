'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Calendar, 
  Bell, 
  Settings, 
  Search, 
  Zap,
  ShieldCheck,
  Compass,
  Heart,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group
      ${active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}
    `}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <Icon size={20} className={active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />
    <span className="text-sm font-semibold tracking-wide">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Use a simple state or derived value to keep track of the role context
  // In a real app, this would come from an Auth provider
  const isOwnerContext = pathname.includes('/owner') || pathname.includes('/properties') || pathname.includes('/matches');
  const isBuyerContext = pathname.includes('/buyer') || pathname.includes('/saved') || pathname.includes('/advisor');
  
  // Default to owner if we can't determine, but try to preserve context
  const isOwner = isOwnerContext || (!isBuyerContext && typeof window !== 'undefined' && localStorage.getItem('userRole') === 'owner');
  const isBuyer = isBuyerContext || (typeof window !== 'undefined' && localStorage.getItem('userRole') === 'buyer');


  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0a0a0c] relative z-20">
        <div className="p-8 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight">PropIntel</span>
          </Link>
        </div>

        <nav className="flex-1 mt-4">
          {isOwner ? (
            <>
              <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard/owner" active={pathname === '/dashboard/owner'} />
              <SidebarItem icon={Building2} label="My Properties" href="/dashboard/properties" active={pathname === '/dashboard/properties'} />
              <SidebarItem icon={Users} label="Buyer Matches" href="/dashboard/matches" active={pathname === '/dashboard/matches'} />
              <SidebarItem icon={BarChart3} label="Intelligence" href="/dashboard/analytics" active={pathname === '/dashboard/analytics'} />
              <SidebarItem icon={Calendar} label="Site Visits" href="/dashboard/visits" active={pathname === '/dashboard/visits'} />
            </>
          ) : (
            <>
              <SidebarItem icon={Compass} label="Find Properties" href="/dashboard/buyer" active={pathname === '/dashboard/buyer'} />
              <SidebarItem icon={Heart} label="Saved Units" href="/dashboard/saved" active={pathname === '/dashboard/saved'} />
              <SidebarItem icon={MessageSquare} label="AI Advisor" href="/dashboard/advisor" active={pathname === '/dashboard/advisor'} />
              <SidebarItem icon={Calendar} label="My Visits" href="/dashboard/visits" active={pathname === '/dashboard/visits'} />
            </>
          )}
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <SidebarItem icon={Bell} label="Notifications" href="/dashboard/notifications" active={pathname === '/dashboard/notifications'} />
            <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" active={pathname === '/dashboard/settings'} />
          </div>
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise AI</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
              {isOwner ? "AI Lead Intelligence Engine is active." : "AI Property Matching Engine is active."}
            </p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: '85%' }} className="h-full bg-blue-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-[#0a0a0c]/80 backdrop-blur-xl">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search intelligence..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-white">{isOwner ? 'Property Owner' : 'Property Explorer'}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Verified</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 border border-white/10" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
