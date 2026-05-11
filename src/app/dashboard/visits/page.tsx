'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Check, X, CalendarClock, Building2 } from 'lucide-react';
import { dataService } from '@/services/dataService';

export default function VisitsPage() {
  const [role, setRole] = useState('owner');
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = async () => {
    setLoading(true);
    const data = await dataService.getVisits();
    setVisits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'owner');
    fetchVisits();
  }, []);

  const handleAction = async (id: number, action: 'accept' | 'decline' | 'reschedule') => {
    if (action === 'accept') {
      await dataService.updateVisitStatus(id, 'accepted');
    } else if (action === 'decline') {
      await dataService.updateVisitStatus(id, 'declined');
    } else if (action === 'reschedule') {
      const newTime = prompt('Enter new time for the visit:');
      if (newTime) {
        await dataService.updateVisitStatus(id, 'pending', newTime);
      }
    }
    fetchVisits();
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Site Visits</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Manage your property viewings and appointments.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
          <Calendar size={14} /> Schedule Active
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {visits.length === 0 ? (
          <div className="lg:col-span-3 text-center p-20 text-gray-500 border border-white/5 rounded-[3rem]">
            <CalendarClock size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold">No visits scheduled.</p>
            <p className="text-sm mt-1">When buyers book a visit, it will appear here.</p>
          </div>
        ) : (
          visits.map((visit) => (
            <motion.div
              key={visit.id}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Building2 size={24} />
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${visit.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {visit.status}
                </div>
              </div>
              
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{visit.property}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <MapPin size={14} className="text-blue-500/50" /> {visit.location}
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Visitor</span>
                    <span className="text-sm font-bold text-white">{visit.buyer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Time</span>
                    <span className="text-sm font-bold text-blue-400 flex items-center gap-1"><Clock size={14} /> {visit.time}</span>
                  </div>
                </div>
              </div>

              {role === 'owner' && visit.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button onClick={() => handleAction(visit.id, 'accept')} className="py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Check size={16} /> Accept
                  </button>
                  <button onClick={() => handleAction(visit.id, 'reschedule')} className="py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl transition-all">
                    Set Time
                  </button>
                  <button onClick={() => handleAction(visit.id, 'decline')} className="col-span-2 py-3 hover:bg-red-500/10 text-gray-500 hover:text-red-400 font-bold rounded-xl transition-all">
                    Decline Visit
                  </button>
                </div>
              )}
              
              {role === 'owner' && visit.status === 'accepted' && (
                <button onClick={() => handleAction(visit.id, 'reschedule')} className="w-full mt-auto py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl transition-all">
                  Reschedule Time
                </button>
              )}
              
              {role === 'buyer' && (
                <button onClick={() => handleAction(visit.id, 'decline')} className="w-full mt-auto py-3 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 font-bold rounded-xl transition-all">
                  Cancel Visit
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
