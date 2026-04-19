'use client';

import React from 'react';
import Image from 'next/image';
import { X, Target, Lightbulb, TrendingUp } from 'lucide-react';

interface ProjectModalProps {
    project: any;
    onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div 
            id="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-12 bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.25s_ease_forwards]"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-6xl bg-[#0A0A0A] border border-white/10 rounded-[32px] sm:rounded-[64px] overflow-hidden grid lg:grid-cols-12 max-h-full overflow-y-auto relative animate-[scaleIn_0.3s_ease_forwards]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="lg:col-span-5 relative h-[350px] lg:h-auto">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent"></div>
                    <div className="absolute top-8 left-8">
                        <button 
                            onClick={onClose}
                            aria-label="Close project details"
                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-7 p-8 md:p-16 overflow-y-visible">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] mb-4 block">{project.category}</span>
                    <h3 id="modal-title" className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">{project.title}</h3>
                    
                    <div className="space-y-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Target size={18} className="text-[#A1A1A1]" aria-hidden="true" />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white">The Challenge</h4>
                            </div>
                            <p className="text-[#E0E0E0] leading-relaxed italic">{project.caseStudy.problem}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Lightbulb size={18} className="text-[#A1A1A1]" aria-hidden="true" />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white">The Execution</h4>
                            </div>
                            <p className="text-[#E0E0E0] leading-relaxed">{project.caseStudy.solution}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                                <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shrink-0">
                                    <TrendingUp size={20} aria-hidden="true" />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white mb-1">Impact Delivered</h4>
                                    <p className="text-lg font-bold text-[#E0E0E0]">{project.impact}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex gap-4">
                            <a 
                                href={project.link} 
                                target="_blank" 
                                aria-label={`View ${project.title} ${project.linkType === 'repo' ? 'repository' : 'space'}`}
                                className="flex-grow flex items-center justify-between bg-white text-black px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#474747] hover:text-white transition-all duration-500"
                            >
                                {project.linkType === 'repo' ? 'View Repository' : 'View Space'} <span className="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
