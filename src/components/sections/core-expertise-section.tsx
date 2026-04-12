'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Bot, BrainCircuit, GitBranchPlus } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

const coreServices = [
  {
    title: 'AI Agent Development',
    description: 'Building autonomous agents capable of complex reasoning, tool usage, and task execution to automate workflows.',
    icon: Bot,
    number: '01',
  },
  {
    title: 'LLM Solutions & RAG',
    description: 'Implementing and fine-tuning Large Language Models, including advanced Retrieval Augmented Generation for knowledge access.',
    icon: BrainCircuit,
    number: '02',
  },
  {
    title: 'MLOps Pipelines',
    description: 'Designing and deploying robust, scalable MLOps pipelines using ZenML and MLflow for efficient model lifecycle management.',
    icon: GitBranchPlus,
    number: '03',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const CoreExpertiseSection: FC = () => {
  return (
    <AnimatedSection id="expertise" className="container mx-auto px-4">
      <h2 className="section-title">
        <span className="section-title-accent">/</span> Core Expertise
      </h2>
      <p className="section-subtitle">
        Leveraging cutting-edge AI to deliver tangible business value through specialized development and deployment services.
      </p>

      <div className="expertise-grid">
        {coreServices.map((service, index) => (
          <motion.div
            key={service.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="expertise-card group"
          >
            <span className="expertise-card-number">{service.number}</span>
            <div className="expertise-card-icon-wrapper">
              <service.icon className="expertise-card-icon" strokeWidth={1.5} />
            </div>
            <h3 className="expertise-card-title">{service.title}</h3>
            <p className="expertise-card-desc">{service.description}</p>
            <div className="expertise-card-reveal">
              <span className="text-xs text-white/70 font-medium tracking-wider uppercase">Discover Solutions →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};
