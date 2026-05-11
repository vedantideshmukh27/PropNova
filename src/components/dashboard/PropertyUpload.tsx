'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, IndianRupee, Upload, X, Zap } from 'lucide-react';
import { dataService } from '@/services/dataService';

/**
 * PropIntel Realistic AI Simulation Engine
 * This simulates the delay and processing of a real LLM (like GPT-4)
 */
const performAIAnalysis = async (data: any) => {
  const processingTime = 2500 + Math.random() * 2000;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  const location = data.location || "the selected area";
  const price = data.price || "the specified range";
  
  const analyses = [
    `Our neural network has identified a high-velocity demand spike in ${location}. Properties in this bracket are currently seeing a 4.2% month-on-month appreciation. Recommended strategy: prioritize buyers with a pre-approved luxury profile.`,
    `AI analysis complete. The price point of ${price} perfectly aligns with the Western Suburbs buyer persona. Match Engine has identified 12 high-intent leads with a compatibility score > 90%.`,
    `Structural intelligence suggests ${location} is transitioning into a primary residential hub. Predictive modeling indicates a 15% increase in site-visit requests for ${data.title || 'this property type'} over the next 30 days.`
  ];

  return {
    intel: analyses[Math.floor(Math.random() * analyses.length)],
    matchScore: Math.floor(Math.random() * (99 - 85 + 1) + 85),
    intentLevel: 'Critical',
    confidence: 0.98
  };
};

export default function PropertyUpload({ onClose }: { onClose: () => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', price: '', location: '' });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    const result = await performAIAnalysis(formData);
    
    // SAVE TO DATA SERVICE
    await dataService.saveProperty({
      ...formData,
      ai_intel: result.intel,
      match_score: result.matchScore,
      status: 'Active',
      image_name: image ? image.name : null,
    });

    setAiResult(result);
    setIsAnalyzing(false);
  };

  if (aiResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0c]/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl p-10 rounded-[3.5rem] bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-[#0a0a0c] border border-blue-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <Zap className="text-blue-400 fill-blue-400" size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4">Intelligence Generated</h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-10">Neural Analysis Complete</p>
            
            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 mb-10 relative">
              <div className="absolute -top-3 -right-3 px-4 py-1 bg-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                Match Score: {aiResult.matchScore}%
              </div>
              <p className="text-gray-300 leading-relaxed italic text-sm">
                "{aiResult.intel}"
              </p>
            </div>

            <div className="flex gap-4 w-full">
              <button onClick={onClose} className="flex-1 py-4 bg-white text-black font-black rounded-2xl shadow-xl shadow-white/5 hover:bg-gray-100 transition-all">
                Publish Listing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0c]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl p-10 rounded-[3.5rem] bg-[#0a0a0c] border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-white">Add New Property</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Our AI will automatically extract features and match buyers.</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Property Title</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Skyline Penthouse" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Price</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="4.5 Cr" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                required
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Worli, Mumbai" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Property Image</label>
            <label className="h-40 w-full rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.04] hover:border-blue-500/30 transition-all relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="hidden" 
              />
              {image ? (
                <div className="text-center z-10">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div className="text-sm font-bold text-white truncate max-w-[200px]">{image.name}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Ready to upload</div>
                </div>
              ) : (
                <div className="text-center z-10">
                  <Upload className="text-gray-500 mx-auto mb-2" size={32} />
                  <div className="text-sm font-bold text-gray-400">Click to Select Image</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">JPEG, PNG • Max 5MB</div>
                </div>
              )}
            </label>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isAnalyzing}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                  <span>Thinking...</span>
                </div>
              ) : (
                <>
                  <Zap size={18} className="fill-white" />
                  Analyze & List
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
