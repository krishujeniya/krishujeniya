'use client';

import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface HeroProps {
    tagline: string;
    socials: any;
    onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ tagline, socials, onScrollTo }) => {
    return (
        <section id="home" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 md:pt-20 scroll-mt-20">
            <div className="max-w-[1440px] mx-auto w-full">
                <div className="flex flex-col items-start gap-6 md:gap-8">
                    <h1 className="text-[clamp(3rem,12vw,8rem)] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase break-words overflow-visible">
                        <span className="text-white drop-shadow-2xl">I Build AI</span> <br />
                        <span className="text-[#A1A1A1]">Systems That</span> <br />
                        <span className="flex items-center gap-4 sm:gap-10">
                            Actually Ship.<div className="hidden md:flex w-24 h-24 rounded-[32px] border-2 border-white/10 items-center justify-center p-4 bg-white/5">
                                <BrainCircuit size={48} className="text-[#A1A1A1]" />
                            </div>
                        </span>
                    </h1>

                    <p className="text-sm md:text-xl text-[#A1A1A1] max-w-xl leading-relaxed font-medium">
                        {tagline}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto pt-4">
                        <button 
                            onClick={() => onScrollTo('projects')}
                            aria-label="Explore my work and case studies"
                            className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-white/5"
                        >
                            Explore Work <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">explore</span>
                        </button>
                        <a 
                            href={socials.calendar}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Book a consultation call on Google Calendar"
                            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                        >
                            Book a Call <span className="material-symbols-outlined" aria-hidden="true">calendar_today</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
