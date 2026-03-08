'use client';

import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Eye,
    Award,
    Database,
    Shield,
    Cloud,
    GitBranch,
    Megaphone,
    Link2,
    BrainCircuit,
    FolderOpen,
    ChevronDown,
    ChevronUp,
    File,
    ExternalLink,
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/animated-section';

interface DocFile {
    name: string;
    type: string;
}

interface DocFolder {
    name: string;
    path: string;
    icon: LucideIcon;
    description: string;
    files: DocFile[];
}

const DOCS_BASE_URL = 'https://github.com/krishujeniya/krishujeniya/raw/main/Docs';

const docsData: DocFolder[] = [
    {
        name: 'Certificates',
        path: 'Certificates',
        icon: Award,
        description: 'Industry-recognized certifications in AI, ML, NLP and more.',
        files: [
            { name: 'GenAI.jpeg', type: 'JPEG' },
            { name: 'ChatGPT.pdf', type: 'PDF' },
            { name: 'FDM Certificate.pdf', type: 'PDF' },
            { name: 'FLASK UDEMY.pdf', type: 'PDF' },
            { name: 'ai.pdf', type: 'PDF' },
            { name: 'deep learning.pdf', type: 'PDF' },
            { name: 'ml.pdf', type: 'PDF' },
            { name: 'nlp.pdf', type: 'PDF' },
            { name: 'python.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'MLOps',
        path: 'MLOps',
        icon: BrainCircuit,
        description: 'Machine Learning operations, DSA, NLP, and Neural Networks resources.',
        files: [
            { name: 'AI_info.pdf', type: 'PDF' },
            { name: 'ML_info.pdf', type: 'PDF' },
            { name: 'NLP_info.pdf', type: 'PDF' },
            { name: 'NeuralNetworks_info.pdf', type: 'PDF' },
            { name: 'OOPs_in_python.pdf', type: 'PDF' },
            { name: 'ML/Introduction_ML.pdf', type: 'PDF' },
            { name: 'ML/Supervised_Learning.pdf', type: 'PDF' },
            { name: 'ML/Unsupervised_Learning.pdf', type: 'PDF' },
            { name: 'ML/Preparing_Model.pdf', type: 'PDF' },
            { name: 'ML/Modeling_Evaluation.pdf', type: 'PDF' },
            { name: 'ML/Python_Lib_ML.pdf', type: 'PDF' },
            { name: 'DSA/Basic_of_DSA.pdf', type: 'PDF' },
            { name: 'DSA/Linked_Lists.pdf', type: 'PDF' },
            { name: 'DSA/Stack_Queue.pdf', type: 'PDF' },
            { name: 'DSA/Trees.pdf', type: 'PDF' },
            { name: 'DSA/Searching_Sorting_001.pdf', type: 'PDF' },
            { name: 'DSA/Searching_Sorting_002.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'Cloud',
        path: 'Cloud',
        icon: Cloud,
        description: 'Cloud computing, security, virtualization, and data center guides.',
        files: [
            { name: 'Overview_Cloud.pdf', type: 'PDF' },
            { name: 'Intro_Cloud_Computing.pdf', type: 'PDF' },
            { name: 'Cloud_Security_and_Compilance.pdf', type: 'PDF' },
            { name: 'Cloud_Storage_and_Database_Services.pdf', type: 'PDF' },
            { name: 'Data_Center_Architecture.pdf', type: 'PDF' },
            { name: 'Emerging_Technologies_with_Cloud_Computing.pdf', type: 'PDF' },
            { name: 'Virtualization_Hypervisors.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'CyberSecurity',
        path: 'CyberSecurity',
        icon: Shield,
        description: 'Cryptography, ethical hacking, network security, and forensics.',
        files: [
            { name: 'Overview_CS.pdf', type: 'PDF' },
            { name: 'Cryptography.pdf', type: 'PDF' },
            { name: 'Ethical_Hacking_Data_Forensics.pdf', type: 'PDF' },
            { name: 'Network_Crime_Security.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'DBMS',
        path: 'DBMS',
        icon: Database,
        description: 'Database management — SQL, normalization, ER diagrams, and transactions.',
        files: [
            { name: 'Overview_DBMS.pdf', type: 'PDF' },
            { name: 'Introduction.pptx', type: 'PPTX' },
            { name: 'ER_Diagrams.ppt', type: 'PPT' },
            { name: 'SQL_Commands.ppt', type: 'PPT' },
            { name: 'Constraints.ppt', type: 'PPT' },
            { name: 'Operators_Joins.pptx', type: 'PPTX' },
            { name: 'Normalization.ppt', type: 'PPT' },
            { name: 'Transaction_Management.pdf', type: 'PDF' },
            { name: 'DBMS_by_leaf_notes.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'DevOps',
        path: 'DevOps',
        icon: GitBranch,
        description: 'Software development lifecycle, Agile, SRS, and risk management.',
        files: [
            { name: 'Overview_SD.pdf', type: 'PDF' },
            { name: 'About_Software_Development.pdf', type: 'PDF' },
            { name: 'SDLC.pptx', type: 'PPTX' },
            { name: 'Aglie.pptx', type: 'PPTX' },
            { name: 'SRS.pptx', type: 'PPTX' },
            { name: 'Risk_Management.pptx', type: 'PPTX' },
            { name: 'Software_Design.pdf', type: 'PDF' },
            { name: 'Software_Coding_and_Testing.pdf', type: 'PDF' },
            { name: 'Software_Life_cycle_models.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'BlockChain',
        path: 'BlockChain',
        icon: Link2,
        description: 'Introduction to blockchain technology and distributed ledger concepts.',
        files: [
            { name: 'Intro_BlockChain.pdf', type: 'PDF' },
        ],
    },
    {
        name: 'Digital Marketing',
        path: 'DigitalMarketing',
        icon: Megaphone,
        description: 'Digital marketing strategy, entrepreneurship, and GPT prompting guides.',
        files: [
            { name: 'Overview_DM.pdf', type: 'PDF' },
            { name: 'Gpt_001.pdf', type: 'PDF' },
            { name: 'Gpt_002.pdf', type: 'PDF' },
            { name: 'Entrepreneurship/Overview_Entrepreneurship.pdf', type: 'PDF' },
            { name: 'Entrepreneurship/Gpt_001.pdf', type: 'PDF' },
            { name: 'Entrepreneurship/Gpt_002_1.pdf', type: 'PDF' },
            { name: 'Entrepreneurship/Gpt_002_2.pdf', type: 'PDF' },
            { name: 'Entrepreneurship/Gpt_003.pdf', type: 'PDF' },
        ],
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.08,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    }),
};

const DocFolderCard: FC<{ folder: DocFolder; index: number }> = ({ folder, index }) => {
    const [expanded, setExpanded] = useState(false);
    const Icon = folder.icon;
    const displayFiles = expanded ? folder.files : folder.files.slice(0, 3);

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="document-card group"
        >
            <div className="document-card-icon-wrapper">
                <Icon className="document-card-icon" strokeWidth={1.5} />
            </div>

            <div className="document-card-body">
                <div className="document-card-header">
                    <h3 className="document-card-title">{folder.name}</h3>
                    <span className="document-card-type">{folder.files.length} files</span>
                </div>
                <p className="document-card-desc">{folder.description}</p>

                {/* File list */}
                <div className="doc-file-list">
                    <AnimatePresence initial={false}>
                        {displayFiles.map((file, fi) => (
                            <motion.div
                                key={file.name}
                                className="doc-file-item"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, delay: fi * 0.03 }}
                            >
                                <a
                                    href={`${DOCS_BASE_URL}/${folder.path}/${encodeURIComponent(file.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="doc-file-link"
                                >
                                    <div className="doc-file-info">
                                        <File className="doc-file-icon" />
                                        <span className="doc-file-name">{file.name.split('/').pop()}</span>
                                    </div>
                                    <ExternalLink className="doc-file-download-icon" />
                                </a>
                                <span className="doc-file-type">{file.type}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {folder.files.length > 3 && (
                    <button
                        className="doc-expand-btn"
                        onClick={() => setExpanded(!expanded)}
                        aria-label={expanded ? 'Show less' : 'Show more'}
                    >
                        <span>{expanded ? 'Show less' : `+${folder.files.length - 3} more`}</span>
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export const DocumentsSection: FC = () => {
    return (
        <AnimatedSection id="documents" className="container mx-auto px-4">
            <h2 className="section-title">
                <span className="section-title-accent">/</span> Documents & Assets
            </h2>
            <p className="section-subtitle">
                Browse my knowledge base — certifications, study materials, and technical resources organized by domain.
            </p>

            <div className="documents-grid">
                {docsData.map((folder, index) => (
                    <DocFolderCard key={folder.name} folder={folder} index={index} />
                ))}
            </div>
        </AnimatedSection>
    );
};
