'use client';

import React from 'react';
import { Mail } from 'lucide-react';

interface NavbarProps {
    scrolled: boolean;
    activeSection: string;
    onScrollTo: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, activeSection, onScrollTo }) => {
    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/5 rounded-b-[32px] sm:rounded-b-[40px]' : 'py-6'}`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
                <div className="flex items-center gap-8 overflow-hidden">
                    {/* Brand Title / Section Name */}
                    <div 
                        className="text-lg sm:text-2xl font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap outline-none flex items-center gap-2"
                        onClick={() => onScrollTo('home')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onScrollTo('home')}
                    >
                        <span className="sm:hidden">
                            {activeSection === 'home' ? (
                                <>KRISH <span className="text-[#A1A1A1]">UJENIYA</span></>
                            ) : activeSection.toUpperCase()}
                        </span>
                        <span className="hidden sm:inline">
                            KRISH <span className="text-[#A1A1A1]">UJENIYA</span>
                        </span>
                    </div>
                    
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 overflow-x-auto no-scrollbar">
                        {['about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onScrollTo(item);
                                }}
                                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-white py-2 whitespace-nowrap ${activeSection === item ? 'text-white' : 'text-white/60'}`}
                                aria-current={activeSection === item ? 'page' : undefined}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => {
                        onScrollTo('contact');
                    }}
                    aria-label="Hire me for your next project"
                    className="flex items-center gap-2 sm:gap-3 bg-white text-black text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-500 shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap"
                >
                    Hire Me <Mail size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </nav>
    );
};
