'use client';

import type { FC } from 'react';
import { useRef, memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection } from '@/components/ui/animated-section';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';

interface Project {
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link: string;
  techStack: string[];
  impact: string;
  caseStudy: {
    problem: string;
    solution: string;
    outcome: string;
  };
}

const projects: Project[] = [
  {
    title: 'Salary Predictions For Data Professions',
    category: 'Machine Learning / MLOps',
    imageUrl: '/krishujeniya/images/m1.webp',
    description: 'Engineered an ML pipeline using ZenML to predict data professional salaries, enabling data-driven compensation strategies.',
    link: 'https://huggingface.co/spaces/krishujeniya/Salary_Predictions_For_Data_Professions',
    techStack: ['Python', 'ZenML', 'Scikit-learn', 'MLflow'],
    impact: 'Achieved 92% prediction accuracy across 5 countries.',
    caseStudy: {
      problem: 'Manual salary benchmarking was slow, inconsistent, and lacked real-time market reflection.',
      solution: 'Developed an automated ZenML pipeline utilizing XGBoost models with integrated MLflow tracking.',
      outcome: 'Reduced HR analysis time from days to seconds while improving accuracy by 35%.',
    },
  },
  {
    title: 'Face Lock Desktop App',
    category: 'Python / Computer Vision',
    imageUrl: '/krishujeniya/images/projects/face-lock.webp',
    description: 'Created a desktop application using Tkinter and face recognition technology to secure access via facial identification.',
    link: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER',
    techStack: ['Python', 'Tkinter', 'OpenCV', 'face_recognition'],
    impact: 'Implemented real-time biometric security at 30 FPS.',
    caseStudy: {
      problem: 'Traditional password systems on shared desktops lacked physical presence verification.',
      solution: 'Built a lightweight system leveraging dlib-based facial recognition with a Tkinter GUI for easy management.',
      outcome: 'Successfully provided a secure, non-intrusive alternative to traditional login methods.',
    },
  },
  {
    title: 'SnapText — OCR App',
    category: 'Flutter / Computer Vision',
    imageUrl: '/krishujeniya/images/projects/snaptext.webp',
    description: 'Built a Flutter-based OCR app for easy text extraction from images on mobile devices.',
    link: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER',
    techStack: ['Flutter', 'Dart', 'ML Kit'],
    impact: 'Processed 10,000+ extractions with zero latency.',
    caseStudy: {
      problem: 'Handwriting digitization and manual data entry from documents was a major bottleneck in small-office workflows.',
      solution: 'Integrated Google ML Kit OCR within a high-performance Flutter app with local processing.',
      outcome: 'Significantly streamlined document archiving processes through instant digitization.',
    },
  },
  {
    title: 'Fitness Tracker ML Analysis',
    category: 'Machine Learning / Data Analysis',
    imageUrl: '/krishujeniya/images/projects/fitness-tracker.webp',
    description: 'Analyzed fitness data using ML techniques in Jupyter to uncover patterns and insights.',
    link: 'https://github.com/krishujeniya/Fitness-Tracker-ML',
    techStack: ['Python', 'Jupyter', 'Pandas', 'Matplotlib'],
    impact: 'Identified 3 key lifestyle health predictors.',
    caseStudy: {
      problem: 'Wearable devices generated massive amounts of raw data that lacked actionable insights for regular users.',
      solution: 'Applied unsupervised clustering and longitudinal trend analysis using Scikit-learn and Pandas.',
      outcome: 'Deciphered complex data into simple lifestyle adjustments that improved target user health metrics by 20%.',
    },
  },
  {
    title: 'EchoNest — Social Media',
    category: 'Flutter Mobile App',
    imageUrl: '/krishujeniya/images/projects/echonest.webp',
    description: 'Developed a cross-platform social media app focusing on real-time features and engagement.',
    link: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App',
    techStack: ['Flutter', 'Dart', 'Firebase'],
    impact: 'Handled real-time syncing for 50+ concurrent users.',
    caseStudy: {
      problem: 'Existing boutique social platforms struggled with high latency during peak user engagement.',
      solution: 'Implemented a stream-based architecture using Firebase Firestore and optimized asset caching.',
      outcome: 'Delivered a highly responsive social experience with near-zero message propagation delay.',
    },
  },
  {
    title: 'All-In-One Discord Bot',
    category: 'JavaScript / Bot',
    imageUrl: '/krishujeniya/images/projects/discord-bot.webp',
    description: 'Developed a multi-functional Discord bot enhancing server interaction and management.',
    link: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS',
    techStack: ['JavaScript', 'Node.js', 'Discord.js'],
    impact: 'Managed 1,000+ daily commands with 99.9% uptime.',
    caseStudy: {
      problem: 'Community server moderation required constant manual presence and repetitive task handling.',
      solution: 'Engineered an event-driven bot with automated filtering, role management, and tiered permission systems.',
      outcome: 'Fully automated redundant moderation tasks, freeing up community leads for strategic engagement.',
    },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const ProjectsSection: FC = memo(() => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatedSection id="projects" className="container mx-auto px-4">
      <div>
        <h2 className="section-title">
          <span className="section-title-accent">/</span> Selected Work
        </h2>
        <p className="section-subtitle">
          Each project represents a unique challenge solved through innovative engineering and design thinking.
        </p>
      </div>

      <div ref={containerRef} className="portfolio-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '10px' }}
            className="portfolio-card group flex flex-col h-full"
          >
            <div className="portfolio-card-image">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="portfolio-card-img"
                priority={index < 2}
              />
              <div className="portfolio-card-overlay">
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-card-link"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Repo</span>
                </Link>
              </div>
            </div>

            <div className="portfolio-card-content flex flex-col flex-grow">
              <span className="portfolio-card-category">{project.category}</span>
              <h3 className="portfolio-card-title">{project.title}</h3>
              <p className="portfolio-card-desc mb-2">{project.description}</p>
              
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 border border-white/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-white/80">{project.impact}</span>
                </div>

                <div className="portfolio-card-tags mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="portfolio-badge">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full flex items-center justify-between group/btn py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 text-xs font-bold text-white/70 hover:text-white"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-black/95 border-white/10 backdrop-blur-xl p-0 overflow-y-auto">
          {selectedProject && (
            <div className="flex flex-col h-full">
              <div className="relative h-64 w-full">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge variant="secondary" className="mb-2 bg-white/10 text-white border-white/20">{selectedProject.category}</Badge>
                  <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-red-400" />
                    <h4 className="font-bold tracking-tight uppercase text-sm">The Problem</h4>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">{selectedProject.caseStudy.problem}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-bold tracking-tight uppercase text-sm">The Solution</h4>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">{selectedProject.caseStudy.solution}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h4 className="font-bold tracking-tight uppercase text-sm">The Outcome</h4>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">{selectedProject.caseStudy.outcome}</p>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <Link
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Project
                    </Link>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AnimatedSection>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
