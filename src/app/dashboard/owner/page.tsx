'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamicImport from 'next/dynamic';
import { Building2, Users, Zap, TrendingUp, Plus, BarChart3, MapPin, Cpu } from 'lucide-react';
import Link from 'next/link';
import { dataService } from '@/services/dataService';

const PropertyUpload = dynamicImport(() => import('@/components/dashboard/PropertyUpload'), { ssr: false });

const StatCard = ({ label, value, icon: Icon, trend, color = 'blue' }: any) => (
  <motion.div whileHover={{ scale: 1.02 }} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase tracking-widest">{trend}</div>
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{label}</div>
  </motion.div>
);

export default function OwnerDashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [buyerLeads, setBuyerLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [props, leads] = await Promise.all([
      dataService.getProperties(),
      dataService.getBuyerLeads(),
    ]);
    setProperties(props || []);
    setBuyerLeads(leads || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const totalValue = properties.reduce((sum, p) => {
    const n = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="space-y-10 pb-20">
      {showUpload && <PropertyUpload onClose={() => { setShowUpload(false); loadData(); }} />}

      {/* Welcome */}
      <section className="relative p-10 rounded-[3rem] overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent border border-white/5">
        <div className="max-w-2xl relative z-10">
          <h1 className="text-4xl font-black mb-3 text-white">Owner Intelligence Hub</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {buyerLeads.length > 0
              ? `${buyerLeads.length} buyers have been classified by AI and are waiting for your properties.`
              : 'Your AI lead engine is active. Add properties to start attracting buyers.'}
          </p>
          <div className="flex gap-4">
            <button onClick={() => setShowUpload(true)} className="px-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-all">
              <Plus size={18} /> Add Property
            </button>
            <Link href="/dashboard/properties" className="px-6 py-3 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center text-white">
              View All Listings
            </Link>
          </div>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex gap-4 items-end h-32">
          {[40, 70, 45, 90, 65].map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-3 bg-blue-500/20 rounded-full" />
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Your Listings" value={loading ? '—' : properties.length} icon={Building2} trend="Live" />
        <StatCard label="Buyer Leads" value={loading ? '—' : buyerLeads.length} icon={Users} trend="Active" color="purple" />
        <StatCard label="Inventory Value" value={loading ? '—' : `${totalValue.toFixed(1)} Cr`} icon={TrendingUp} trend="+12%" color="green" />
        <StatCard label="AI Score" value="98.2" icon={Zap} trend="Critical" color="yellow" />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent properties */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white">Your Recent Listings</h2>
            <Link href="/dashboard/properties" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">See All</Link>
          </div>
          {properties.length === 0 && !loading ? (
            <div className="p-10 rounded-[2rem] border border-dashed border-white/10 text-center text-gray-500">
              <Building2 size={32} className="mx-auto mb-4 opacity-40" />
              <p className="font-bold">No properties yet.</p>
              <p className="text-sm mt-1">Add your first listing to start attracting AI-matched buyers.</p>
              <button onClick={() => setShowUpload(true)} className="mt-4 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all text-white">
                + Add Property
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 5).map((p, i) => (
                <motion.div key={p.id || i} whileHover={{ x: 6 }} className="flex items-center justify-between p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Building2 size={20} /></div>
                    <div>
                      <div className="font-bold text-white text-sm">{p.title}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10} />{p.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-blue-400 text-sm">{p.price}</div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.status || 'Active'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* AI Buyer Leads Panel */}
        <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Cpu size={14} /> Recent Buyer Leads
            </div>
            {buyerLeads.length === 0 ? (
              <p className="text-gray-500 text-sm leading-relaxed">No buyer leads yet. As buyers complete the AI chat, their preferences appear here.</p>
            ) : (
              <div className="space-y-4">
                {buyerLeads.slice(0, 4).map((lead, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-sm font-bold text-white">{lead.preferred_location?.[0] || 'Any Area'}</div>
                    <div className="text-[10px] text-gray-500 mt-1">Budget: ₹{lead.max_budget || '?'} Cr • {lead.property_type || 'Any'} • {lead.urgency || 'Flexible'}</div>
                    <div className="text-[9px] font-bold text-green-400 mt-1 uppercase tracking-widest">Intent: {lead.ai_analysis?.intent || 'Medium'}</div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/matches" className="mt-6 block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black text-xs shadow-lg shadow-blue-600/20 hover:scale-105 transition-all text-white">
              View All Leads →
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
