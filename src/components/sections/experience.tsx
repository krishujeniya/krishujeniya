'use client';

import React from 'react';

interface ExperienceItem {
    duration: string;
    location: string;
    role: string;
    description: string;
    tags: string[];
    company: string;
}

interface ExperienceProps {
    experience: ExperienceItem[];
}

export const Experience: React.FC<ExperienceProps> = ({ experience }) => {
    return (
        <section id="experience" className="py-24 px-6 md:px-12 bg-white/5 scroll-mt-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col items-center text-center gap-6 mb-32">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Path</span>
                    <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">Professional <br />Experience</h2>
                </div>

                <div className="space-y-12">
                    {experience.map((exp, i) => (
                        <div 
                            key={i}
                            className="group grid md:grid-cols-12 gap-8 border-t border-white/5 pt-12"
                        >
                            <div className="md:col-span-3 flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{exp.duration}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E0E0E0]">{exp.location}</span>
                            </div>
                            <div className="md:col-span-6 flex flex-col gap-4">
                                <h3 className="text-3xl font-black uppercase tracking-tight group-hover:text-[#A1A1A1] transition-colors">{exp.role}</h3>
                                <p className="text-[#A1A1A1] text-lg leading-relaxed">{exp.description}</p>
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {exp.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1 bg-white/5 rounded-full text-[#A1A1A1]">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-3 flex md:justify-end items-start pt-2">
                                <span className="text-xl font-bold tracking-tighter uppercase text-[#A1A1A1]">{exp.company}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
