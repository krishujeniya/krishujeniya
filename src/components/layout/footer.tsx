'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';

import { ArrowUp } from 'lucide-react';

interface FooterProps {
    scrolled: boolean;
    onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ scrolled, onScrollTo }) => {
    return (
        <footer className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#0A0A0A]">
            <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-12 sm:gap-16">
                <div className="flex flex-col items-center gap-6">
                    <div className="text-2xl font-black tracking-tighter text-white">KRISH UJENIYA</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1] text-center max-w-xs leading-relaxed">
                        © 2026 · BUILDING RELIABLE AI SYSTEMS
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                    {Object.entries(portfolioData.profile.socials)
                        .filter(([name]) => name !== 'calendar')
                        .map(([name, url]) => (
                        <a 
                            key={name} 
                            href={url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit my ${name} profile`}
                            className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
                        >
                            {name === 'huggingface' ? 'HuggingFace' : name}
                        </a>
                    ))}
                </div>
                <button 
                    onClick={() => onScrollTo('home')}
                    aria-label="Back to home"
                    className={`group flex flex-col items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#A1A1A1] hover:text-white transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all bg-white/5">
                        <ArrowUp size={18} aria-hidden="true" />
                    </span>
                    Back to Top
                </button>
            </div>
        </footer>
    );
};
