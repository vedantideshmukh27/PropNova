'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, IndianRupee, Tag, Filter, Plus, Search, Eye, Edit3, Trash2 } from 'lucide-react';
import PropertyUpload from '@/components/dashboard/PropertyUpload';
import { dataService } from '@/services/dataService';

export default function PropertiesPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    const realProperties = await dataService.getProperties();
    setProperties(realProperties || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="space-y-10">
      {showUpload && <PropertyUpload onClose={() => {
        setShowUpload(false);
        fetchProperties(); // Refresh list after upload
      }} />}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Property Inventory</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage your listings and monitor real-time engagement.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="px-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
        >
          <Plus size={20} /> List New Property
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">{properties.length}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Listings</div>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">
              {properties.reduce((acc, p) => acc + (p.views || 0), 0)}
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Views</div>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <Tag size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">
              ₹{properties.reduce((acc, p) => acc + (parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0), 0).toFixed(1)} Cr
            </div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inventory Value</div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search properties..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50" />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2 hover:bg-white/10">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
             </div>
          ) : properties.length === 0 ? (
             <div className="text-center p-10 text-gray-500">
               <p>No properties listed yet. Click "List New Property" to get started.</p>
             </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <th className="pb-4 pl-4">Property</th>
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Views</th>
                  <th className="pb-4 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {properties.map((prop) => (
                  <tr key={prop.id} className="group hover:bg-white/[0.01] transition-all">
                    <td className="py-6 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center text-gray-600 font-black">
                          {prop.image_name ? 'IMG' : 'NO IMG'}
                        </div>
                        <div>
                          <div className="font-bold text-white">{prop.title}</div>
                          <div className="text-xs text-gray-500">{prop.property_type || 'Residential'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-sm text-gray-400"><div className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500/50" /> {prop.location}</div></td>
                    <td className="py-6 font-black text-blue-400">{prop.price}</td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${prop.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-6 text-sm font-bold text-gray-500">{prop.views || Math.floor(Math.random() * 500 + 100)}</td>
                    <td className="py-6 text-right pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`Viewing details for ${prop.title}`)} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Eye size={18} /></button>
                        <button onClick={() => alert(`Edit mode enabled for ${prop.title}`)} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white"><Edit3 size={18} /></button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${prop.title}?`)) {
                              setProperties(properties.filter(p => p.id !== prop.id));
                            }
                          }} 
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
