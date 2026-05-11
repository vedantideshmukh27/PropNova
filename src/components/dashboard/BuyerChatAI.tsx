'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Building2, MapPin, IndianRupee, Zap, CheckCircle2 } from 'lucide-react';
import { dataService } from '@/services/dataService';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface Profile {
  area: string;
  budget: number;
  type: string;
  duration: string;
}



// Parse budget string like "2 Cr", "50 lakh", "5.5 Cr" to a number (Cr)
function parseBudget(text: string): number {
  const t = text.toLowerCase();
  const num = parseFloat(t.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return 0;
  if (t.includes('lakh')) return num / 100;
  return num; // assume Cr
}

// Compute a match score for a property vs. profile
function computeMatch(prop: any, profile: Profile): number {
  let score = 50;
  if (profile.area && prop.location?.toLowerCase().includes(profile.area.toLowerCase())) score += 30;
  if (profile.type) {
    const t = profile.type.toLowerCase();
    if (prop.property_type?.toLowerCase().includes(t) || prop.title?.toLowerCase().includes(t)) score += 15;
  }
  if (profile.budget > 0) {
    const propPrice = parseFloat(String(prop.price).replace(/[^0-9.]/g, ''));
    if (!isNaN(propPrice) && propPrice <= profile.budget) score += 15;
    else if (!isNaN(propPrice) && propPrice <= profile.budget * 1.2) score += 5;
    else score -= 20;
  }
  return Math.min(99, Math.max(30, score));
}

const STEPS = [
  { key: 'name',     q: "Hi! I'm PropIntel's AI Advisor 🤖. To personalize your matches, what is your name?" },
  { key: 'area',     q: (name: string) => `Nice to meet you, ${name}! Which city or area are you looking to buy in? (e.g., Bandra, Worli, Navi Mumbai)` },
  { key: 'budget',   q: (area: string) => `Perfect — ${area} is an excellent choice. What is your budget range? (e.g., 2 Cr, 50 Lakh, 5–8 Cr)` },
  { key: 'type',     q: (budget: string) => `Got it — budget noted at ${budget}. What type of property are you looking for? (Apartment, Villa, Studio, Plot, Penthouse)` },
  { key: 'duration', q: (type: string) => `Excellent! Looking for a ${type}. How soon do you plan to close the deal? (e.g., Within 15 days, 1 month, 3 months, Just exploring)` },
];

export default function BuyerChatAI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: STEPS[0].q }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({ name: '', area: '', budget: 0, type: '', duration: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [matchedProperties, setMatchedProperties] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, matchedProperties]);

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    const msg: Message = { id: Date.now().toString() + role, role, content };
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || done) return;
    setInput('');
    addMessage('user', text);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsTyping(false);

    const newProfile = { ...profile };

    if (step === 0) {
      newProfile.name = text;
      const nextQ = typeof STEPS[1].q === 'function' ? STEPS[1].q(text) : STEPS[1].q;
      addMessage('assistant', nextQ);
    } else if (step === 1) {
      newProfile.area = text;
      const nextQ = typeof STEPS[2].q === 'function' ? STEPS[2].q(text) : STEPS[2].q;
      addMessage('assistant', nextQ);
    } else if (step === 2) {
      newProfile.budget = parseBudget(text);
      const nextQ = typeof STEPS[3].q === 'function' ? STEPS[3].q(text) : STEPS[3].q;
      addMessage('assistant', nextQ);
    } else if (step === 3) {
      newProfile.type = text;
      const nextQ = typeof STEPS[4].q === 'function' ? STEPS[4].q(text) : STEPS[4].q;
      addMessage('assistant', nextQ);
    } else if (step === 4) {
      newProfile.duration = text;
      // Final step - match properties
      addMessage('assistant', `🧠 Analyzing your preferences... Searching our inventory for ${newProfile.type}s in ${newProfile.area} within your budget...`);
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsTyping(false);

      // Fetch and filter from real DB or demo
      let props = await dataService.getProperties({
        area: newProfile.area,
        maxBudget: newProfile.budget,
        type: newProfile.type,
      });

      if (props.length === 0) {
        addMessage('assistant', `⚠️ I couldn't find exact matches for ${newProfile.type}s in ${newProfile.area} within that budget right now. However, I have saved your profile and notified all owners in the network! You will be alerted the moment a match is listed.`);
        setDone(true);
        setMatchedProperties([]);
      } else {
        // Score and sort
        const scored = props.map((p: any) => ({ ...p, _score: computeMatch(p, newProfile) }))
          .sort((a: any, b: any) => b._score - a._score)
          .slice(0, 4);

        setMatchedProperties(scored);

        const urgencyTag = newProfile.duration.toLowerCase().includes('15') ? 'CRITICAL' :
                           newProfile.duration.toLowerCase().includes('month') ? 'HIGH' : 'MEDIUM';

        addMessage('assistant', `✅ Analysis complete! I found ${scored.length} properties matching your profile. Your intent has been classified as **${urgencyTag}** — property owners will be notified.`);
        setDone(true);
      }

      // Save buyer profile
      const userContact = typeof window !== 'undefined' ? localStorage.getItem('userContact') || 'No contact provided' : '';
      await dataService.saveBuyerProfile({
        name: newProfile.name,
        contact: userContact,
        preferred_location: [newProfile.area],
        min_budget: 0,
        max_budget: newProfile.budget,
        urgency: newProfile.duration,
        property_type: newProfile.type,
        ai_analysis: { intent: 'High', source: 'ChatAI', duration: newProfile.duration }
      });

      const urgencyTag = newProfile.duration.toLowerCase().includes('15') ? 'CRITICAL' :
                         newProfile.duration.toLowerCase().includes('month') ? 'HIGH' : 'MEDIUM';

      addMessage('assistant', `✅ Analysis complete! I found ${scored.length} properties matching your profile. Your intent has been classified as **${urgencyTag}** — property owners will be notified.`);
      setDone(true);
    }

    setProfile(newProfile);
    setStep(prev => Math.min(prev + 1, 5));
  };

  return (
    <div className="flex flex-col rounded-[2.5rem] bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Bot size={18} />
          </div>
          <div>
            <div className="text-sm font-black text-white">PropIntel AI Advisor</div>
            <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
            </div>
          </div>
        </div>
        <div className="text-[10px] text-gray-500 font-bold bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
          Step {Math.min(step + 1, 4)} / 4
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 max-h-96">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-white/[0.04] border border-white/5 text-gray-200'
                : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        {/* Property Results */}
        {matchedProperties.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Sparkles size={12} /> AI-Matched Properties
            </div>
            {matchedProperties.map((prop, i) => (
              <motion.div
                key={prop.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{prop.title}</div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                        <MapPin size={10} /> {prop.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-blue-400 font-black text-sm flex items-center gap-0.5">
                      <IndianRupee size={12} />{prop.price}
                    </div>
                    <div className="text-[10px] font-bold text-green-400 mt-0.5">
                      {prop._score || prop.match_score || 85}% Match
                    </div>
                  </div>
                </div>
                {prop.ai_intel && (
                  <p className="text-[10px] text-gray-500 mt-3 leading-relaxed border-t border-white/5 pt-2">
                    🧠 {prop.ai_intel}
                  </p>
                )}
                <button className="mt-3 w-full py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600/30 transition-all flex items-center justify-center gap-1.5">
                  <Zap size={12} /> Request Site Visit
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={done ? 'AI analysis complete. Visit your matches above ✓' : 'Type your response...'}
            disabled={done || isTyping}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 pl-5 pr-14 text-sm focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || done || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all disabled:opacity-40 shadow-lg shadow-blue-600/20"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
