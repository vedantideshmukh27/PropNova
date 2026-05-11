'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Default to owner dashboard if no specific role is found
    // In a real app, you would check the user's actual role from the session
    router.replace('/dashboard/owner');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Redirecting to Intelligence...</p>
      </div>
    </div>
  );
}
