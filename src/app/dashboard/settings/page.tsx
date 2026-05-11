'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Globe, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

const SettingItem = ({ icon: Icon, label, description, rightContent, danger }: any) => (
  <div className={`p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all
    ${danger ? 'hover:border-red-500/30' : 'hover:border-blue-500/30'}
  `}>
    <div className="flex items-center gap-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
        ${danger ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}
      `}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className={`font-black text-sm ${danger ? 'text-red-400' : 'text-white'}`}>{label}</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {rightContent}
      <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
    </div>
  </div>
);

export default function SettingsPage() {
  return (
    <div className="space-y-12 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-gray-400 text-sm font-medium mt-1">Configure your AI intelligence profile and platform preferences.</p>
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">Profile Architecture</h2>
          <div className="space-y-3">
            <SettingItem 
              icon={User} 
              label="Intelligence Identity" 
              description="Manage your verified profile and role" 
              rightContent={<div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12} /> Verified</div>}
            />
            <SettingItem 
              icon={Lock} 
              label="Security Protocol" 
              description="OTP verification and biometric access" 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">System Preferences</h2>
          <div className="space-y-3">
            <SettingItem 
              icon={Bell} 
              label="Neural Alerts" 
              description="Configure AI match notifications" 
              rightContent={<div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>}
            />
            <SettingItem 
              icon={Globe} 
              label="Geographic Intelligence" 
              description="Manage target market focus zones" 
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-4">Billing & Infrastructure</h2>
          <div className="space-y-3">
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 mb-4">
                    <Zap size={16} className="fill-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Plan</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">₹14,999/mo</h3>
                  <p className="text-gray-400 text-xs font-medium max-w-xs">Unlimited AI match scoring, real-time lead ranking, and priority site visits.</p>
                </div>
                <button className="px-6 py-3 bg-white text-black font-black rounded-2xl text-xs hover:bg-gray-100 transition-all">Upgrade Now</button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            </div>
            <SettingItem 
              icon={CreditCard} 
              label="Payment Infrastructure" 
              description="Manage credit cards and invoicing" 
            />
          </div>
        </section>

        <section className="pt-10 border-t border-white/5">
          <SettingItem 
            icon={LogOut} 
            label="Deactivate Protocol" 
            description="Sign out of your active session" 
            danger={true}
          />
        </section>
      </div>
    </div>
  );
}
