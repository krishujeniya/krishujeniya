'use client';

import type { FC } from 'react';
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BrainCircuit, Smartphone, Code2 } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

const workExperience = [
  {
    role: 'Freelance ML & Software Engineer',
    company: 'Self-Employed',
    duration: '2023 — Present',
    location: 'Remote',
    description: 'Providing bespoke Machine Learning solutions (MLOps, ZenML, MLflow) and full-stack software development.',
    icon: Briefcase,
    tags: ['Python', 'ZenML', 'MLflow', 'Flutter'],
  },
  {
    role: 'Machine Learning Engineer Intern',
    company: 'Mentorness',
    duration: 'May 2024 — Jul 2024',
    location: 'Remote',
    description: 'Developed predictive models including salary prediction and fraud detection using ML techniques.',
    icon: BrainCircuit,
    tags: ['Scikit-learn', 'Pandas', 'ML Pipelines'],
  },
  {
    role: 'Flutter Developer Intern',
    company: 'Prelax Infotech',
    duration: 'Jul 2023 — Aug 2023',
    location: 'Surat, India — Hybrid',
    description: 'Contributed to the SnapText OCR mobile app, integrating ML capabilities for text recognition.',
    icon: Smartphone,
    tags: ['Flutter', 'Dart', 'ML Kit'],
  },
  {
    role: 'PHP Developer Intern',
    company: 'For Each Next',
    duration: 'Sep 2022 — Oct 2022',
    location: 'Surat, India — On-site',
    description: 'Gained foundational web development experience using PHP, MySQL, HTML, CSS, and JavaScript.',
    icon: Code2,
    tags: ['PHP', 'MySQL', 'JavaScript'],
  },
];

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const ExperienceSection: FC = memo(() => {
  return (
    <AnimatedSection id="experience" className="container mx-auto px-4">
      <h2 className="section-title">
        <span className="section-title-accent">/</span> Experience
      </h2>
      <p className="section-subtitle">
        A timeline of professional milestones and growth in AI, ML, and software engineering.
      </p>

      <div className="timeline">
        {/* Timeline line */}
        <motion.div
          className="timeline-line"
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />

        {workExperience.map((exp, index) => (
          <motion.div
            key={exp.role}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="timeline-item"
          >
            {/* Timeline dot */}
            <div className="timeline-dot">
              <exp.icon className="w-4 h-4" />
            </div>

            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-duration">{exp.duration}</span>
                <span className="timeline-location">{exp.location}</span>
              </div>
              <h3 className="timeline-role">{exp.role}</h3>
              <p className="timeline-company">{exp.company}</p>
              <p className="timeline-desc">{exp.description}</p>
              <div className="timeline-tags">
                {exp.tags.map((tag) => (
                  <span key={tag} className="timeline-tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
});

ExperienceSection.displayName = 'ExperienceSection';
