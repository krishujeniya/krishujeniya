'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Layers, 
  Calendar, 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity, 
  ExternalLink, 
  ChevronDown 
} from 'lucide-react';

export const HeroSection: FC = () => {
  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden bg-white dark:bg-zinc-950 font-sans"
    >
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Availability Badge - Top Right */}
      <div className="absolute top-6 right-4 sm:top-10 sm:right-10 z-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 backdrop-blur-md shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 whitespace-nowrap">
            Open for projects · Replies &lt;24h
          </span>
        </motion.div>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Profile Photo - Native img with WebP fallback */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", damping: 15 }}
          className="mb-8 relative"
        >
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <picture>
              <source srcSet="/krishujeniya/images/1765004211200.webp" type="image/webp" />
              <img 
                src="/krishujeniya/images/1765004211200.jpg" 
                alt="Krish Ujeniya" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </picture>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-900 p-2 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-800"
          >
            <Activity className="w-5 h-5 text-blue-500" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4 uppercase">
            Krish Ujeniya
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-2xl font-medium text-zinc-600 dark:text-zinc-400 max-w-3xl mb-12 leading-relaxed"
        >
          Freelance ML Engineer | <span className="text-blue-600 dark:text-blue-400">RAG Systems</span>, AI Agents & MLOps | Shipped in &lt;4 weeks
        </motion.p>

        {/* Metric Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-4xl"
        >
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">6+ Projects Delivered</span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">3 Domains: RAG · Agents · MLOps</span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/10">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Available Now</span>
          </div>
        </motion.div>

        {/* Trust Badges Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">ZenML Certified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
            <Activity className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">MLflow Master</span>
          </div>
          <a 
            href="https://huggingface.co/krishujeniya" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-500">HuggingFace Expert</span>
            <ExternalLink className="w-3 h-3 text-yellow-600 dark:text-yellow-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <a 
            href="https://calendly.com/krishujeniya" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group w-full sm:min-w-[220px] min-h-[56px] px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <span>Book 15-min call</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <button 
            onClick={handleScrollToProjects}
            className="w-full sm:min-w-[200px] min-h-[56px] px-8 py-4 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold transition-all flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-800 active:scale-[0.98]"
          >
            <span>View my work</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-600"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
