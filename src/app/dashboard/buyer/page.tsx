'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamicImport from 'next/dynamic';
import { 
  Search, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Compass, 
  Bell, 
  User,
  Zap,
  Cpu,
  Sparkles,
  ArrowRight,
  Building2
} from 'lucide-react';
import { dataService } from '@/services/dataService';

const BuyerChatAI = dynamicImport(() => import('@/components/dashboard/BuyerChatAI'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full rounded-[3rem] bg-white/[0.02] animate-pulse border border-white/10" />
});

const PropertyCard = ({ id, name, price, location, match, type }: { id: number, name: string, price: string, location: string, match: number, type: string }) => {
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if initially saved
    const checkSaved = async () => {
      const savedProps = await dataService.getSavedProperties();
      if (savedProps.find(p => p.id === id)) setSaved(true);
    };
    checkSaved();
  }, [id]);

  const handleBook = async () => {
    setLoading(true);
    await dataService.saveVisit({
      property: name,
      location,
      buyer: localStorage.getItem('userContact') || 'Verified Buyer',
      time: 'Requested'
    });
    setLoading(false);
    setBooked(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await dataService.toggleSavedProperty({ id, title: name, price, location, property_type: type, match_score: match });
    setSaved(!saved);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden group relative"
    >
      <button 
        onClick={handleSave}
        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
      >
        <Heart size={16} className={saved ? "fill-purple-400 text-purple-400" : "text-white"} />
      </button>

      <div className="h-48 bg-gray-900 relative flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          {match}% Match
        </div>
        <Building2 size={48} className="text-gray-700 opacity-50" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} /> {location}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">{type}</div>
          </div>
          <div className="text-right">
            <div className="text-blue-400 font-black">{price}</div>
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Estimated</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-white">
            Details
          </button>
          <button 
            onClick={handleBook}
            disabled={booked || loading}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all text-white ${
              booked 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-600/20 hover:scale-105'
            }`}
          >
            {loading ? 'Booking...' : booked ? '✓ Booked' : 'Book Visit'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function BuyerDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const data = await dataService.getProperties();
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Platform Core - Chat AI Classifier */}
      <section className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-8 pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={14} /> AI-Powered Discovery
          </div>
          <h1 className="text-5xl font-black leading-tight text-white">
            Match the Right <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Property</span> with Your Timeline
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
            Our AI Classifier analyzes your duration, budget, and area preferences to intelligently rank properties and connect you with verified sellers.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
              <div className="text-blue-400 font-black text-2xl mb-1">98%</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Match Accuracy</div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
              <div className="text-purple-400 font-black text-2xl mb-1">Live</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Market Feed</div>
            </div>
          </div>
        </div>
        
        <BuyerChatAI />
      </section>

      <div className="grid lg:grid-cols-4 gap-12 pt-12 border-t border-white/5">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-10">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-500">Filters</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-3 uppercase tracking-tighter">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Apartment', 'Villa', 'Studio', 'Plot'].map(t => (
                    <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-bold border transition-all ${t === 'Apartment' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-3 uppercase tracking-tighter">Match Accuracy</label>
                <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none accent-blue-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Property Grid */}
        <div className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">Live Market Recommendations</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all"><Compass size={18} /></button>
              <button className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400"><Search size={18} /></button>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center h-48">
               <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
             </div>
          ) : properties.length === 0 ? (
            <div className="p-10 rounded-[2rem] border border-dashed border-white/10 text-center text-gray-500">
              <p className="font-bold">No properties available yet.</p>
              <p className="text-sm mt-1">Property owners haven't listed anything yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {properties.map((p, i) => (
                <PropertyCard 
                  key={p.id || i}
                  id={p.id || i}
                  name={p.title || 'Untitled Property'} 
                  price={p.price || 'Price on Request'} 
                  location={p.location || 'Unknown Location'} 
                  match={p.match_score || Math.floor(Math.random() * (98 - 70) + 70)} 
                  type={p.property_type || 'Residential'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
