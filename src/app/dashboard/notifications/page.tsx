'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, Users, Calendar, ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { dataService } from '@/services/dataService';

export default function NotificationsPage() {
  const [role, setRole] = useState('owner');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem('userRole') || 'owner');
    const fetchNotifs = async () => {
      setLoading(true);
      const data = await dataService.getNotifications();
      setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifs();
  }, []);

  return (
    <div className="space-y-10 pb-20 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Notifications</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Real-time alerts and AI intelligence updates.</p>
        </div>
        <button className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-20 text-gray-500 border border-white/5 rounded-[3rem]">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold">You're all caught up!</p>
            <p className="text-sm mt-1">New activity will appear here as the AI matches properties.</p>
          </div>
        ) : (
          notifications.map((notif: any) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-[2.5rem] border transition-all duration-300 relative group
                ${notif.read ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-white/[0.03] border-white/10 hover:border-blue-500/30'}
              `}
            >
              {!notif.read && (
                <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
              <div className="flex gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                  ${notif.type === 'match' ? 'bg-blue-500/10 text-blue-400' : 
                    notif.type === 'visit' ? 'bg-purple-500/10 text-purple-400' : 'bg-green-500/10 text-green-400'}
                `}>
                  {notif.type === 'match' ? <Zap size={20} /> : notif.type === 'visit' ? <Calendar size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-white">{notif.title}</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{notif.time || 'Just now'}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{notif.content}</p>
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                      Take Action <ArrowRight size={14} />
                    </button>
                    <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dismiss</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
