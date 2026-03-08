'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Award, BookOpen, Briefcase } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

const documents = [
    {
        title: 'Resume',
        subtitle: 'Professional Summary',
        description: 'Comprehensive overview of skills, experience and expertise in ML, AI and software engineering.',
        icon: FileText,
        type: 'PDF',
    },
    {
        title: 'Curriculum Vitae',
        subtitle: 'Detailed Academic Record',
        description: 'Full academic and professional history including research, publications and teaching experience.',
        icon: BookOpen,
        type: 'PDF',
    },
    {
        title: 'Certifications',
        subtitle: 'Industry Credentials',
        description: 'Validated expertise in Generative AI, Machine Learning, ChatGPT and Digital Marketing.',
        icon: Award,
        type: 'Collection',
    },
    {
        title: 'Case Studies',
        subtitle: 'Project Deep Dives',
        description: 'Detailed breakdowns of key projects showcasing methodology, architecture and real outcomes.',
        icon: Briefcase,
        type: 'PDF',
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
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

export const DocumentsSection: FC = () => {
    return (
        <AnimatedSection id="documents" className="container mx-auto px-4">
            <h2 className="section-title">
                <span className="section-title-accent">/</span> Documents & Assets
            </h2>
            <p className="section-subtitle">
                Download my professional documents or view certifications and case studies for deeper insights.
            </p>

            <div className="documents-grid">
                {documents.map((doc, index) => (
                    <motion.div
                        key={index}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-60px' }}
                        className="document-card group"
                    >
                        <div className="document-card-icon-wrapper">
                            <doc.icon className="document-card-icon" strokeWidth={1.5} />
                        </div>

                        <div className="document-card-body">
                            <div className="document-card-header">
                                <h3 className="document-card-title">{doc.title}</h3>
                                <span className="document-card-type">{doc.type}</span>
                            </div>
                            <p className="document-card-subtitle">{doc.subtitle}</p>
                            <p className="document-card-desc">{doc.description}</p>
                        </div>

                        <div className="document-card-actions">
                            <button className="document-action-btn" aria-label={`View ${doc.title}`}>
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                            </button>
                            <button className="document-action-btn" aria-label={`Download ${doc.title}`}>
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
};
