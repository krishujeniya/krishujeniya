'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const TITLE_TEXT = 'KRISH UJENIYA';
const SUBTITLE_TEXT = 'DATA SCIENTIST & ML ENGINEER';
const TAGLINE = 'Building intelligent systems with AI Agents, LLMs & MLOps pipelines that transform businesses.';

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.6 + i * 0.04,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 30, letterSpacing: '0.5em' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.3em',
    transition: {
      delay: 1.8,
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 2.4,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 2.8,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 3.2, duration: 0.8 },
  },
};

const avatarVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const HeroSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section"
    >
      {/* Radial gradient overlay */}
      <div className="hero-gradient-overlay" aria-hidden="true" />

      <div className="hero-content">
        {/* Profile avatar */}
        <motion.div
          className="hero-avatar"
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
        >
          <Image
            src="https://github.com/krishujeniya/krishujeniya/blob/main/images/1765004211200.jpg?raw=true"
            alt="Krish Ujeniya"
            width={120}
            height={120}
            className="hero-avatar-img"
            priority
            data-ai-hint="professional headshot portrait"
          />
        </motion.div>

        {/* Main title - staggered letter reveal */}
        <motion.h1
          className="hero-title"
          initial="hidden"
          animate="visible"
          style={{
            transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
          }}
        >
          {TITLE_TEXT.split('').map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="hero-letter"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="hero-subtitle"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          style={{
            transform: `translate3d(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px, 0)`,
          }}
        >
          {SUBTITLE_TEXT}
        </motion.p>

        {/* Horizontal rule */}
        <motion.div
          className="hero-divider"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
        />

        {/* Tagline */}
        <motion.p
          className="hero-tagline"
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
        >
          {TAGLINE}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="hero-cta-group"
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            onClick={() => handleScrollTo('contact')}
            className="btn-primary magnetic-btn"
          >
            <span>Start a Project</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
          <button
            onClick={() => handleScrollTo('projects')}
            className="btn-outline magnetic-btn"
          >
            <span>View Work</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="scroll-indicator-text">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="scroll-indicator-icon" />
        </motion.div>
      </motion.div>
    </section>
  );
};
