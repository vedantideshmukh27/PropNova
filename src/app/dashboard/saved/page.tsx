'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Building2, Search, Compass } from 'lucide-react';
import { dataService } from '@/services/dataService';

export default function SavedPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const data = await dataService.getSavedProperties();
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const removeSaved = async (property: any) => {
    await dataService.toggleSavedProperty(property);
    setProperties(properties.filter(p => p.id !== property.id));
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Saved Properties</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Properties you've bookmarked for later.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">
          <Heart size={14} className="fill-purple-400" /> {properties.length} Saved
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center p-20 text-gray-500 border border-white/5 rounded-[3rem]">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No saved properties.</p>
          <p className="text-sm mt-1">When you favorite a property, it will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {properties.map((p, i) => (
            <motion.div
              key={p.id || i}
              whileHover={{ y: -10 }}
              className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden group"
            >
              <div className="h-48 bg-gray-900 relative flex items-center justify-center">
                <button 
                  onClick={() => removeSaved(p)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Heart size={16} className="fill-red-400" />
                </button>
                <Building2 size={48} className="text-gray-700 opacity-50" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{p.title || 'Untitled Property'}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={12} /> {p.location || 'Unknown Location'}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">{p.property_type || 'Residential'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-black">{p.price || 'Price on Request'}</div>
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Estimated</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-white">
                    Details
                  </button>
                  <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 text-white">
                    Book Visit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
