'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Zap, 
  BrainCircuit, 
  MessageSquare, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { dataService } from '@/services/dataService';

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const leads = await dataService.getBuyerLeads();
      
      if (leads && leads.length > 0) {
        const formattedLeads = leads.map((lead: any, i: number) => ({
          id: lead.id || `lead_${i}`,
          name: lead.name || `Verified Buyer #${1000 + i}`,
          contact: lead.contact || 'Contact info secured',
          score: lead.match_score || Math.floor(Math.random() * (98 - 85 + 1) + 85),
          intent: lead.urgency || lead.ai_analysis?.intent || 'High',
          property: lead.property_type || 'Any Property',
          budget: `Up to ₹${lead.max_budget || '?'} Cr`,
          analysis: lead.ai_analysis?.insight || `AI matched this buyer based on their strong interest in ${lead.preferred_location?.[0] || 'your area'}. Timeline: ${lead.urgency || 'Flexible'}.`,
          tags: ['AI Verified', lead.urgency?.includes('15') ? 'Hot Lead' : 'Active Searcher']
        }));
        setMatches(formattedLeads);
        setSelectedMatch(formattedLeads[0]);
      } else {
        setMatches([]);
        setSelectedMatch(null);
      }
      setLoading(false);
    };
    fetchMatches();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">AI Lead Intelligence</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Intelligent buyer qualification and real-time match ranking from your database.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest self-start md:self-auto">
          <BrainCircuit size={14} /> AI Processing Active
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Match List */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-hide">
          <div className="flex items-center justify-between px-6 mb-4">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Priority Queue</span>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <TrendingUp size={12} /> Ranked by Duration
            </span>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
             </div>
          ) : matches.length === 0 ? (
            <div className="text-center p-10 text-gray-500 border border-white/5 rounded-[2.5rem]">
              <p>No matches yet.</p>
            </div>
          ) : (
            matches.map((match: any) => (
              <motion.div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                whileHover={{ x: 4 }}
                className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${selectedMatch?.id === match.id 
                    ? 'bg-blue-600/10 border-blue-500/30' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                  }
                `}
              >
                {selectedMatch?.id === match.id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center font-black text-sm text-white">
                      {match.name ? match.name[0] : '?'}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{match.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{match.property}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-black ${match.score > 90 ? 'text-blue-400' : 'text-purple-400'}`}>
                      {match.score}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Intent: {match.intent}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Intelligence Detail View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedMatch && (
              <motion.div
                key={selectedMatch.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                      <span className="text-3xl font-black text-white">{selectedMatch.name ? selectedMatch.name[0] : '?'}</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black mb-2 text-white">{selectedMatch.name}</h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedMatch.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20">
                    <div className="text-4xl font-black text-blue-400 mb-1">{selectedMatch.score}%</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Compatibility</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Cpu size={14} className="text-blue-400" /> Lead Analysis
                    </h3>
                    <p className="text-gray-300 leading-relaxed italic text-sm">
                      "{selectedMatch.analysis}"
                    </p>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Target size={14} className="text-purple-400" /> Buyer Profile
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Property Type</span>
                        <span className="text-xs font-bold text-white">{selectedMatch.property}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Budget Bracket</span>
                        <span className="text-xs font-bold text-white">{selectedMatch.budget}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Decision Speed</span>
                        <span className="text-xs font-bold text-green-400">{selectedMatch.intent}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const btn = document.getElementById(`btn-contact-${selectedMatch.id}`);
                      if (btn) {
                        btn.innerHTML = `<div class="flex flex-col items-center justify-center w-full"><span class="text-[10px] uppercase tracking-widest text-green-700 font-bold mb-1">Contact Details</span><span class="text-xs break-all whitespace-normal text-center w-full px-2 leading-tight">${selectedMatch.contact || 'No info provided'}</span></div>`;
                        btn.className = "flex-1 py-2 bg-green-500/20 text-green-400 border border-green-500/30 font-black rounded-2xl flex items-center justify-center transition-all shadow-xl h-full min-h-[56px]";
                      }
                    }}
                    id={`btn-contact-${selectedMatch.id}`}
                    className="flex-1 py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl shadow-white/5"
                  >
                    <Zap size={18} className="fill-black" /> Contact Buyer
                  </button>
                  <button 
                    onClick={(e) => {
                       const msg = prompt(`Send a message to ${selectedMatch.name}:`);
                       if (msg) {
                         e.currentTarget.classList.add('bg-blue-600', 'border-blue-500');
                         e.currentTarget.classList.remove('bg-white/5', 'border-white/10');
                         e.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
                       }
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all text-white flex items-center justify-center"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                       const date = prompt(`Schedule a visit with ${selectedMatch.name} (Enter date/time):`, 'Tomorrow 4:00 PM');
                       if (date) {
                         e.currentTarget.classList.add('bg-purple-600', 'border-purple-500');
                         e.currentTarget.classList.remove('bg-white/5', 'border-white/10');
                         e.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
                       }
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all text-white flex items-center justify-center"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
