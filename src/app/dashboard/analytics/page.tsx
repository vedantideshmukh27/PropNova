'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  PieChart, 
  Globe, 
  Zap,
  ArrowUpRight,
  Download
} from 'lucide-react';

const MetricCard = ({ label, value, trend, isUp }: { label: string, value: string, trend: string, isUp: boolean }) => (
  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</div>
      <div className={`flex items-center gap-1 text-[10px] font-black ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
      </div>
    </div>
    <div className="text-3xl font-black text-white mb-6 tracking-tight">{value}</div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '70%' }}
        className={`h-full ${isUp ? 'bg-blue-500' : 'bg-purple-500'}`} 
      />
    </div>
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Market Analytics</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Deep insights into buyer behavior and market trends.</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
          <Download size={18} /> Export Intel Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Lead Conversion" value="24.8%" trend="+4.2%" isUp={true} />
        <MetricCard label="Average Match Score" value="92.4" trend="+1.5%" isUp={true} />
        <MetricCard label="Inquiry Velocity" value="12/Day" trend="-0.8%" isUp={false} />
        <MetricCard label="Retention Rate" value="88.2%" trend="+12.0%" isUp={true} />
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-black flex items-center gap-3"><Activity className="text-blue-400" size={24} /> Engagement Growth</h3>
            <div className="flex gap-2">
              {['1W', '1M', '3M', '1Y'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${t === '1M' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[40, 65, 35, 85, 55, 95, 75, 45, 80, 60, 90, 100].map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05 }}
                className="w-full rounded-t-xl bg-gradient-to-t from-blue-600/20 to-blue-400/40 border-x border-t border-blue-500/10 hover:from-blue-500/40 hover:to-blue-300/60 transition-all cursor-pointer relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h}% Growth
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Insight Panel */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6">
                <Zap size={24} className="text-white fill-white" />
              </div>
              <h4 className="text-xl font-black mb-2 text-white">AI Prediction</h4>
              <p className="text-white/70 text-xs leading-relaxed font-medium mb-6">Based on current velocity, Bandra West properties will see a 12% price appreciation in the next quarter.</p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                Learn More <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Globe size={14} className="text-purple-400" /> Geography Split
            </h4>
            <div className="space-y-4">
              {[
                { name: 'South Mumbai', val: 45 },
                { name: 'Western Suburbs', val: 35 },
                { name: 'Central Mumbai', val: 20 }
              ].map(item => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{item.name}</span>
                    <span className="text-gray-400">{item.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full">
                    <div className="h-full bg-blue-500/50 rounded-full" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
