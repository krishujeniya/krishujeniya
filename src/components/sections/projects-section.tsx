'use client';

import type { FC } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection } from '@/components/ui/animated-section';

const projects = [
  {
    title: 'Salary Predictions For Data Professions',
    category: 'Machine Learning / MLOps',
    imageUrl: 'https://github.com/krishujeniya/krishujeniya/blob/main/images/m1.png?raw=true',
    description: 'Engineered an ML pipeline using ZenML to predict data professional salaries, enabling data-driven compensation strategies.',
    link: 'https://huggingface.co/spaces/krishujeniya/Salary_Predictions_For_Data_Professions',
    aiHint: 'data science dashboard graph salary',
    techStack: ['Python', 'ZenML', 'Scikit-learn', 'MLflow'],
  },
  {
    title: 'Face Lock Desktop App',
    category: 'Python / Computer Vision',
    imageUrl: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER/raw/main/logo.png',
    description: 'Created a desktop application using Tkinter and face recognition technology to secure access via facial identification.',
    link: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER',
    aiHint: 'face recognition security software',
    techStack: ['Python', 'Tkinter', 'OpenCV', 'face_recognition'],
  },
  {
    title: 'SnapText — OCR App',
    category: 'Flutter / Computer Vision',
    imageUrl: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER/raw/main/assets/Screenshot%20from%202024-06-17%2011-33-12.png',
    description: 'Built a Flutter-based OCR app for easy text extraction from images on mobile devices.',
    link: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER',
    aiHint: 'mobile app document scanner',
    techStack: ['Flutter', 'Dart', 'ML Kit'],
  },
  {
    title: 'Fitness Tracker ML Analysis',
    category: 'Machine Learning / Data Analysis',
    imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/5817988/9548984/ffc2841e628ea82c25a8b08b56b873ff/dataset-cover.png?t=2024-10-04-18-47-18',
    description: 'Analyzed fitness data using ML techniques in Jupyter to uncover patterns and insights.',
    link: 'https://github.com/krishujeniya/Fitness-Tracker-ML',
    aiHint: 'fitness data dashboard',
    techStack: ['Python', 'Jupyter', 'Pandas', 'Matplotlib'],
  },
  {
    title: 'EchoNest — Social Media',
    category: 'Flutter Mobile App',
    imageUrl: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App/raw/main/assets/iw.png',
    description: 'Developed a cross-platform social media app focusing on real-time features and engagement.',
    link: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App',
    aiHint: 'mobile social media',
    techStack: ['Flutter', 'Dart', 'Firebase'],
  },
  {
    title: 'All-In-One Discord Bot',
    category: 'JavaScript / Bot',
    imageUrl: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS/raw/main/docs/.gitbook/assets/strange.png',
    description: 'Developed a multi-functional Discord bot enhancing server interaction and management.',
    link: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS',
    aiHint: 'discord bot interface',
    techStack: ['JavaScript', 'Node.js', 'Discord.js'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateY: -5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const ProjectsSection: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <AnimatedSection id="projects" className="container mx-auto px-4">
      <motion.div style={{ y: parallaxY }}>
        <h2 className="section-title">
          <span className="section-title-accent">/</span> Selected Work
        </h2>
        <p className="section-subtitle">
          Each project represents a unique challenge solved through innovative engineering and design thinking.
        </p>
      </motion.div>

      <div ref={containerRef} className="portfolio-grid">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="portfolio-card group"
          >
            <div className="portfolio-card-image">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="portfolio-card-img"
                data-ai-hint={project.aiHint}
                priority={index < 2}
                loading={index < 2 ? undefined : 'lazy'}
              />
              <div className="portfolio-card-overlay">
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-card-link"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Project</span>
                </Link>
              </div>
            </div>

            <div className="portfolio-card-content">
              <span className="portfolio-card-category">{project.category}</span>
              <h3 className="portfolio-card-title">{project.title}</h3>
              <p className="portfolio-card-desc">{project.description}</p>
              <div className="portfolio-card-tags">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="portfolio-badge">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};
