'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import dynamicImport from 'next/dynamic';
import { Sparkles } from 'lucide-react';

const BuyerChatAI = dynamicImport(() => import('@/components/dashboard/BuyerChatAI'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full rounded-[3rem] bg-white/[0.02] animate-pulse border border-white/10" />
});

export default function AdvisorPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">AI Advisor</h1>
          <p className="text-gray-400 text-sm mt-1">Talk to PropIntel to find your perfect property match.</p>
        </div>
      </div>
      
      <div className="max-w-4xl">
        <BuyerChatAI />
      </div>
    </div>
  );
}
