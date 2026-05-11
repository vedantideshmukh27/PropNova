'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  ArrowRight, 
  Zap, 
  BrainCircuit, 
  Mail, 
  Phone, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface RoleCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  onSelect: () => void;
  color: string;
}

const RoleCard = ({ title, subtitle, description, icon: Icon, onSelect, color }: RoleCardProps) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="group relative p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl cursor-pointer overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-blue-500/30 shadow-2xl"
  >
    <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 group-hover:opacity-30 transition-opacity bg-${color}-500`} />
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/10 bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <div className="mb-8">
        <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">{subtitle}</p>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className={`mt-auto flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all group-hover:gap-5 text-${color}-400`}>
        Continue <ArrowRight size={20} />
      </div>
    </div>
  </motion.div>
);

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<string>('role'); // 'role' | 'auth' | 'otp'
  const [role, setRole] = useState<string | null>(searchParams.get('role'));
  const [method, setMethod] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const [contact, setContact] = useState('');

  useEffect(() => {
    if (role) setStep('auth');
  }, [role]);

  const handleRoleSelect = (r: string) => {
    setRole(r);
    localStorage.setItem('userRole', r);
    setStep('auth');
  };

  const handleMethodSelect = (m: string) => {
    setMethod(m);
    if (m === 'google') {
      router.push(role === 'owner' ? '/dashboard/owner' : '/dashboard/buyer');
    } else {
      setStep('collect');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim()) setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    if (newOtp.every(digit => digit !== '')) {
      // Simulate real auth success
      if (typeof window !== 'undefined') {
        localStorage.setItem('userContact', contact);
      }
      setTimeout(() => router.push(role === 'owner' ? '/dashboard/owner' : '/dashboard/buyer'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl w-full relative z-10"
          >
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-black mb-6">Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Experience</span></h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Select your role to unlock personalized AI intelligence.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <RoleCard title="Property Owner" subtitle="For sellers & agents" description="Upload properties, receive AI-ranked buyers, and manage lead insights." icon={Building2} color="blue" onSelect={() => handleRoleSelect('owner')} />
              <RoleCard title="Buyer / Client" subtitle="For property seekers" description="Explore AI-matched properties and discover listings tailored to you." icon={Users} color="purple" onSelect={() => handleRoleSelect('buyer')} />
            </div>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative z-10 shadow-2xl"
          >
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Zap className="text-white fill-white" size={32} />
              </div>
              <h2 className="text-3xl font-black mb-2">Secure Access</h2>
              <p className="text-gray-500 text-sm font-medium">Continue as <span className="text-blue-400 font-bold uppercase tracking-widest">{role}</span></p>
            </div>
            <div className="space-y-4">
              <button onClick={() => handleMethodSelect('google')} className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                <Globe size={20} /> Continue with Google
              </button>
              <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">or secure with OTP</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>
              <button onClick={() => handleMethodSelect('email')} className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-3 hover:bg-white/[0.05] transition-all">
                <Mail size={20} className="text-blue-400" /> Continue with Email
              </button>
              <button onClick={() => handleMethodSelect('phone')} className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-3 hover:bg-white/[0.05] transition-all">
                <Phone size={20} className="text-purple-400" /> Continue with Phone
              </button>
            </div>
            <button onClick={() => setStep('role')} className="mt-8 w-full text-center text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors">Change Role</button>
          </motion.div>
        )}

        {step === 'collect' && (
          <motion.div
            key="collect"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative z-10 shadow-2xl"
          >
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                {method === 'email' ? <Mail className="text-blue-400" size={32} /> : <Phone className="text-purple-400" size={32} />}
              </div>
              <h2 className="text-3xl font-black mb-2">Verification Required</h2>
              <p className="text-gray-500 text-sm font-medium">Enter your {method} to receive a secure code.</p>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="relative">
                {method === 'email' ? (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                ) : (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                )}
                <input
                  autoFocus
                  required
                  type={method === 'email' ? 'email' : 'tel'}
                  placeholder={method === 'email' ? 'name@company.com' : '+91 XXXXX XXXXX'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                Send Code <ArrowRight size={20} />
              </button>
            </form>
            <button onClick={() => setStep('auth')} className="mt-8 w-full text-center text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors">Back to Options</button>
          </motion.div>
        )}


        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-lg p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl relative z-10 shadow-2xl flex flex-col items-center"
          >
            <h2 className="text-3xl font-black mb-2">Verify Identity</h2>
            <p className="text-xs text-gray-400 mb-8 text-center leading-relaxed">We've sent a 6-digit verification code to your {method}.</p>
            <div className="flex gap-2 mb-10">
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-12 h-14 bg-white/[0.03] border border-white/10 rounded-xl text-center text-xl font-black text-blue-400 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
              ))}
            </div>
            <button className="text-xs text-blue-400 font-bold uppercase tracking-widest">Resend Code</button>
            <button onClick={() => setStep('auth')} className="mt-10 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-gray-300 transition-colors">Back to Options</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center">Loading Intelligence...</div>}>
      <AuthContent />
    </Suspense>
  );
}
