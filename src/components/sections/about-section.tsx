'use client';

import type { FC } from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Award } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';

const aboutData = [
  {
    title: 'Who I Am',
    content: 'A dedicated Machine Learning Engineer and Data Scientist based in India, specializing in bridging the gap between cutting-edge AI research and production-to-scale implementation.',
    icon: User,
  },
  {
    title: 'Background',
    content: 'Deeply rooted in Mathematics and Software Engineering, I have built and deployed numerous end-to-end ML systems, from computer vision applications to complex LLM-powered agents.',
    icon: GraduationCap,
  },
  {
    title: 'Why Hire Me',
    content: 'I focus on building resilient, observable, and scalable systems. My expertise in MLOps ensures that models don\'t just perform well in notebooks but deliver consistent business value in production.',
    icon: Award,
  },
];

export const AboutSection: FC = memo(() => {
  return (
    <AnimatedSection id="about" className="container mx-auto px-4">
      <h2 className="section-title">
        <span className="section-title-accent">/</span> About Me
      </h2>
      <p className="section-subtitle">
        A glimpse into my journey, expertise, and why I am the right partner for your next intelligent system.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
        {aboutData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <GlassCard className="h-full p-8 flex flex-col gap-4 border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                {item.content}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
});

AboutSection.displayName = 'AboutSection';
