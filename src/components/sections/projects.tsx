'use client';

import React from 'react';
import Image from 'next/image';

interface Project {
    title: string;
    category: string;
    imageUrl: string;
    techStack: string[];
    link: string;
    linkType: string;
    impact: string;
    caseStudy: {
        problem: string;
        solution: string;
    };
}

interface ProjectsProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onProjectSelect }) => {
    return (
        <section id="projects" className="py-24 px-6 md:px-12 bg-[#0A0A0A] scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-start gap-4 mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">/ Catalog</span>
                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">Selected <br />Case Studies</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {projects.map((project, i) => (
                        <div 
                            key={i} 
                            className="group flex flex-col gap-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/10 rounded-[40px] p-2"
                            onClick={() => onProjectSelect(project)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onProjectSelect(project)}
                            aria-label={`View details for ${project.title}`}
                        >
                            <div className="aspect-[4/5] relative overflow-hidden rounded-[32px] bg-[#111]">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    priority={i < 3}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{project.category}</span>
                                        <h3 className="text-2xl font-black uppercase leading-[1.1] text-white">{project.title}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[11px] font-black uppercase tracking-[0.1em] text-[#A1A1A1]">{tag}</span>
                                    ))}
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#A1A1A1] group-hover:text-white group-hover:translate-x-1 transition-all" aria-hidden="true">east</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
