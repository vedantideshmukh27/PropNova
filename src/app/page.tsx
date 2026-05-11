'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Building2, 
  Users, 
  BarChart3, 
  Cpu, 
  Target, 
  BrainCircuit,
  Globe,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        <Zap className="text-white fill-white" size={20} />
      </div>
      <span className="text-2xl font-bold tracking-tight text-white">PropIntel</span>
    </div>
    
    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
      <a href="#features" className="hover:text-white transition-colors">Features</a>
      <a href="#intelligence" className="hover:text-white transition-colors">AI Intelligence</a>
      <a href="#about" className="hover:text-white transition-colors">About</a>
      <Link href="/auth" className="px-6 py-2.5 bg-white text-black rounded-xl hover:bg-gray-100 transition-all font-bold">
        Get Started
      </Link>
    </div>
  </nav>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  delay: number;
}

const FeatureCard = ({ title, description, icon: Icon, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all group"
  >
    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-8"
          >
            <BrainCircuit size={14} />
            <span>Next-Gen Real Estate Infrastructure</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            AI-Powered <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              Property Intelligence
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Match the right buyers with the right properties using intelligent lead ranking and AI-powered buyer insights.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/auth?role=owner" className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl shadow-white/5">
              Join as Property Owner <ArrowRight size={20} />
            </Link>
            <Link href="/auth?role=buyer" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              Explore Properties
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-10 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Intelligent Real Estate Infrastructure</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            PropIntel uses AI-powered lead intelligence and buyer analysis to help property owners connect with the most relevant buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="AI Match Scoring" 
            description="Analyze buyer preferences and generate intelligent compatibility scores automatically." 
            icon={Target} 
            delay={0.1} 
          />
          <FeatureCard 
            title="Buyer Intelligence" 
            description="Understand buyer intent, urgency, budget fit, and property preferences in real-time." 
            icon={BrainCircuit} 
            delay={0.2} 
          />
          <FeatureCard 
            title="Lead Prioritization" 
            description="Our AI ranks leads based on conversion probability, so you focus on the most relevant deals." 
            icon={BarChart3} 
            delay={0.3} 
          />
          <FeatureCard 
            title="Property Analytics" 
            description="Track property performance and buyer engagement with advanced data visualizations." 
            icon={Zap} 
            delay={0.4} 
          />
          <FeatureCard 
            title="AI Assistant" 
            description="An intelligent conversational agent that qualifies leads and answers buyer queries 24/7." 
            icon={Cpu} 
            delay={0.5} 
          />
          <FeatureCard 
            title="Global Infrastructure" 
            description="Scalable technology designed to handle complex real-estate transactions across borders." 
            icon={Globe} 
            delay={0.6} 
          />
        </div>
      </section>

      {/* Intelligence Section */}
      <section id="intelligence" className="py-32 px-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8">Neural Matching <br /> Engine</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Our proprietary matching engine doesn't just look at budget and area. It analyzes 50+ data points including buyer intent, search velocity, and emotional compatibility with property features.
            </p>
            <ul className="space-y-6">
              {[
                "Predictive Lead Qualification",
                "Automated Intent Classification",
                "Dynamic Price Optimization AI",
                "Fraud Detection & Buyer Verification"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <ShieldCheck size={14} className="text-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="relative p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Processing Intelligence</div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150" />
                </div>
              </div>
              <div className="space-y-6">
                {[85, 92, 78].map((w, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>Neural Link {i+1}</span>
                      <span>{w}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${w}%` }} className="h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-10 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-8">
          <Users size={14} />
          <span>Our Vision</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-8">The Future of Real Estate <br /> is Intelligent</h2>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed mb-16">
          PropIntel was born from a simple observation: the real estate market is flooded with data but starved for intelligence. We're building the infrastructure that makes every transaction smarter, faster, and more transparent.
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="text-4xl font-black text-white mb-2">10M+</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Data Points Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">15K+</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Verified Buyers</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">98%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Match Accuracy</div>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center text-gray-600 text-sm font-medium">
        <div className="flex items-center justify-center gap-3 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Zap size={16} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">PropIntel</span>
        </div>
        <p>© 2026 PropIntel AI. All rights reserved. • Built for the future of real estate.</p>
      </footer>
    </div>
  );
}
