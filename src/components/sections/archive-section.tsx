'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/animated-section';

export const ArchiveSection: FC = () => {
    return (
        <AnimatedSection id="archive" className="container mx-auto px-4">
            <h2 className="section-title">
                <span className="section-title-accent">/</span> The Archive
            </h2>
            <p className="section-subtitle">
                A tribute to where it all started. My previous portfolio website — preserved as a digital monument.
            </p>

            <motion.div
                className="archive-card"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Background decorative elements */}
                <div className="archive-card-bg" aria-hidden="true">
                    <div className="archive-grid-lines" />
                </div>

                <div className="archive-card-content">
                    <div className="archive-meta">
                        <div className="archive-meta-item">
                            <Clock className="w-4 h-4" />
                            <span>Previous Version</span>
                        </div>
                        <div className="archive-meta-item">
                            <Globe className="w-4 h-4" />
                            <span>GitHub Pages</span>
                        </div>
                    </div>

                    <h3 className="archive-title">krishujeniya.github.io</h3>
                    <p className="archive-subtitle">
                        The original portfolio that chronicled my journey from a curious student to a professional
                        ML engineer. Built with passion, this site represents the foundation of everything that followed.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            href="https://krishujeniya.github.io/krishujeniya/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="archive-link magnetic-btn"
                        >
                            <span>Visit the Archive</span>
                            <ExternalLink className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative corner accents */}
                <div className="archive-corner archive-corner-tl" aria-hidden="true" />
                <div className="archive-corner archive-corner-br" aria-hidden="true" />
            </motion.div>
        </AnimatedSection>
    );
};
