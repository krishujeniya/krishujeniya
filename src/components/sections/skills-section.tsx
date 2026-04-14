'use client';

import type { FC } from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  BrainCircuit, 
  GitMerge, 
  Layout, 
  type LucideIcon 
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';

interface SkillCategory {
  title: string;
  icon: LucideIcon;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Machine Learning',
    icon: BrainCircuit,
    skills: ['Python', 'Scikit-learn', 'OpenCV', 'TensorFlow', 'PyTorch'],
  },
  {
    title: 'Generative AI',
    icon: Bot,
    skills: ['LLMs', 'RAG', 'LangChain', 'OpenAI', 'Anthropic'],
  },
  {
    title: 'MLOps & Dev',
    icon: GitMerge,
    skills: ['ZenML', 'MLflow', 'MLOps', 'Docker', 'GitHub Actions'],
  },
  {
    title: 'App Dev & Cloud',
    icon: Layout,
    skills: ['Flutter', 'Firebase', 'TypeScript', 'Next.js', 'PostgreSQL'],
  },
];

const skills = [
  "Python", "ZenML", "MLflow", "LLMs", "RAG", "MLOps", "Flutter", "OpenCV", "Firebase", "Scikit-learn"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    } as const,
  },
};

export const SkillsSection: FC = memo(() => {
  return (
    <AnimatedSection id="skills" className="container mx-auto px-4">
      <h2 className="section-title">
        <span className="section-title-accent">/</span> Technical Skills
      </h2>
      <p className="section-subtitle">
        A diverse toolkit focused on building high-performance ML systems and modern applications.
      </p>

      <div className="max-w-4xl mx-auto mt-12">
        <motion.div 
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {skills.map((skill) => (
            <motion.div key={skill} variants={itemVariants}>
              <Badge 
                variant="outline" 
                className="px-6 py-2 text-sm md:text-base font-medium bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default py-3"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-20">
        {skillCategories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 h-full flex flex-col gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-white/70 group-hover:text-white transition-colors">
                <cat.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(s => (
                  <span key={s} className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
});

SkillsSection.displayName = 'SkillsSection';
