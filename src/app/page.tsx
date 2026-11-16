'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGsapAnimations } from '@/hooks/useGsapAnimations';
import Image from 'next/image';
import { AntigravityCanvas } from '@/components/client-dynamic';

import { portfolioData } from '@/data/portfolio';

import {
    Target,
    Lightbulb,
    TrendingUp,
    File,
    Quote,
    Mail,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    X,
    ArrowUp,
    ArrowRight,
    ArrowUpRight,
    Compass,
    Calendar,
} from 'lucide-react';




const DOCS_BASE_URL = 'https://github.com/krishujeniya/krishujeniya/raw/main/Docs';
const CONTACT_SUBMISSION_STORAGE_KEY = 'portfolio-contact-submission';

const DOCUMENT_THEMES: Record<string, { gradient: string; accent: string; tag: string }> = {
    'Certificates': {
        gradient: 'from-[#FFFFFF] via-[#F5F5F5] to-[#E5E5E5]',
        accent: 'text-neutral-700',
        tag: 'Verified Credentials',
    },
    'MLOps': {
        gradient: 'from-[#F8F9FA] via-[#E9ECEF] to-[#DEE2E6]',
        accent: 'text-neutral-800',
        tag: 'Pipelines & DSA',
    },
    'Cloud': {
        gradient: 'from-[#F4F4F5] via-[#E4E4E7] to-[#D4D4D8]',
        accent: 'text-neutral-700',
        tag: 'Cloud Infrastructure',
    },
    'CyberSecurity': {
        gradient: 'from-[#F0F2F5] via-[#E2E5E9] to-[#CBD2D9]',
        accent: 'text-neutral-800',
        tag: 'Defense & Forensics',
    },
    'DBMS': {
        gradient: 'from-[#FAFAFA] via-[#F0F0F0] to-[#DFDFDF]',
        accent: 'text-neutral-700',
        tag: 'Data Architecture',
    },
    'DevOps': {
        gradient: 'from-[#F6F7F9] via-[#EBECEF] to-[#D8DAE0]',
        accent: 'text-neutral-800',
        tag: 'SDLC & Automation',
    },
    'BlockChain': {
        gradient: 'from-[#FFFFFF] via-[#F2F2F2] to-[#E1E1E1]',
        accent: 'text-neutral-700',
        tag: 'Decentralized Ledger',
    },
    'Digital Marketing': {
        gradient: 'from-[#F5F5F7] via-[#E5E5EA] to-[#D1D1D6]',
        accent: 'text-neutral-800',
        tag: 'Growth & Analytics',
    },
};

const createSubmissionId = () => {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const getSubmissionFingerprint = async (payload: string) => {
    try {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
};

const getStoredSubmissionId = (fingerprint: string) => {
    try {
        const stored = JSON.parse(sessionStorage.getItem(CONTACT_SUBMISSION_STORAGE_KEY) || 'null');
        return stored?.fingerprint === fingerprint && typeof stored.id === 'string' ? stored.id : null;
    } catch {
        return null;
    }
};

const storeSubmissionId = (fingerprint: string, id: string) => {
    try {
        sessionStorage.setItem(CONTACT_SUBMISSION_STORAGE_KEY, JSON.stringify({ fingerprint, id }));
    } catch {
        // The in-memory id still deduplicates retries when session storage is unavailable.
    }
};

export default function Portfolio() {
    useGsapAnimations();
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);
    const [expandedFolder, setExpandedFolder] = useState<number | null>(null);
    const [isSent, setIsSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Failed to send — email directly.');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [contactMethod, setContactMethod] = useState('');
    const submissionKeyRef = useRef<{ fingerprint: string; id: string } | null>(null);

    // Hero Typewriter & Sequential Entrance phases: typing -> name -> buttons -> all
    const [typedLine1, setTypedLine1] = useState('');
    const [typedLine2, setTypedLine2] = useState('');
    const [heroPhase, setHeroPhase] = useState<'typing' | 'name' | 'buttons' | 'all'>('typing');
    const [activeCursor, setActiveCursor] = useState<'line1' | 'line2' | null>('line1');
    const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>('All');
    const projectsTrackRef = useRef<HTMLDivElement | null>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);

    const projectCategories = [
        { label: 'All', value: 'All' },
        { label: 'Agentic AI', value: 'Agentic AI' },
        { label: 'MLOps', value: 'MLOps' },
        { label: 'Computer Vision', value: 'Computer Vision' },
        { label: 'Mobile', value: 'Mobile' },
        { label: 'Systems', value: 'Systems' },
    ];

    const projectContainerStyles: Record<string, { bg: string; badge: string }> = {
        amberclaw: { bg: 'bg-[#EDE9FE]', badge: 'bg-[#DDD6FE] text-[#4C1D95]' },
        hadron: { bg: 'bg-[#E0E7FF]', badge: 'bg-[#C7D2FE] text-[#312E81]' },
        waferpulse: { bg: 'bg-[#D1FAE5]', badge: 'bg-[#A7F3D0] text-[#065F46]' },
        somnostasis: { bg: 'bg-[#E0F2FE]', badge: 'bg-[#BAE6FD] text-[#075985]' },
        hajree: { bg: 'bg-[#FCE7F3]', badge: 'bg-[#FBCFE8] text-[#831843]' },
        curavex: { bg: 'bg-[#DCFCE7]', badge: 'bg-[#BBF7D0] text-[#14532D]' },
        sureword: { bg: 'bg-[#FEF3C7]', badge: 'bg-[#FDE68A] text-[#78350F]' },
        scanlark: { bg: 'bg-[#F1F5F9]', badge: 'bg-[#E2E8F0] text-[#1E293B]' },
        saygrove: { bg: 'bg-[#FFE4E6]', badge: 'bg-[#FECDD3] text-[#881337]' },
        sensor: { bg: 'bg-[#FEF9C3]', badge: 'bg-[#FEF08A] text-[#713F12]' },
        salary: { bg: 'bg-[#EEF2FF]', badge: 'bg-[#E0E7FF] text-[#3730A3]' },
        agyos: { bg: 'bg-[#F3F4F6]', badge: 'bg-[#E5E7EB] text-[#1F2937]' },
        discord: { bg: 'bg-[#EDE9FE]', badge: 'bg-[#DDD6FE] text-[#4338CA]' },
        sparkwa: { bg: 'bg-[#CCFBF1]', badge: 'bg-[#99F6E4] text-[#115E59]' },
        netsweep: { bg: 'bg-[#F1F5F9]', badge: 'bg-[#CBD5E1] text-[#334155]' },
    };

    const filteredProjects = portfolioData.projects.filter(project => {
        if (selectedProjectCategory === 'All') return true;
        const cat = project.category.toLowerCase();
        const tech = project.techStack.map(t => t.toLowerCase()).join(' ');
        const combined = `${cat} ${tech}`;
        if (selectedProjectCategory === 'Agentic AI') return combined.includes('agent') || combined.includes('rag');
        if (selectedProjectCategory === 'MLOps') return combined.includes('mlops') || combined.includes('machine learning');
        if (selectedProjectCategory === 'Computer Vision') return combined.includes('vision') || combined.includes('ocr') || combined.includes('biometric');
        if (selectedProjectCategory === 'Mobile') return combined.includes('flutter') || combined.includes('mobile');
        if (selectedProjectCategory === 'Systems') return combined.includes('systems') || combined.includes('distributed') || combined.includes('security') || combined.includes('bash') || combined.includes('node') || combined.includes('speech');
        return true;
    });

    const isNameVisible = heroPhase === 'name' || heroPhase === 'buttons' || heroPhase === 'all';
    const isButtonsVisible = heroPhase === 'buttons' || heroPhase === 'all';
    const isAllVisible = heroPhase === 'all';

    // Infinite carousel navigation: after last project display first project, and vice versa
    const scrollProjects = (direction: 'left' | 'right') => {
        const track = projectsTrackRef.current;
        if (!track) return;
        const card = track.querySelector<HTMLElement>('[role="button"]');
        const cardWidth = card ? card.offsetWidth + 24 : 380; // card width + gap-6
        const maxScroll = track.scrollWidth - track.clientWidth;

        if (direction === 'right') {
            if (track.scrollLeft >= maxScroll - 20) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        } else {
            if (track.scrollLeft <= 20) {
                track.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        }
    };

    const documentsTrackRef = useRef<HTMLDivElement | null>(null);

    const scrollDocuments = (direction: 'left' | 'right') => {
        const track = documentsTrackRef.current;
        if (!track) return;
        const card = track.querySelector<HTMLElement>('.document-card');
        const cardWidth = card ? card.offsetWidth + 24 : 380;
        const maxScroll = track.scrollWidth - track.clientWidth;

        if (direction === 'right') {
            if (track.scrollLeft >= maxScroll - 20) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        } else {
            if (track.scrollLeft <= 20) {
                track.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        }
    };

    // Hero Typewriter with pause at "AI" and smooth cascade
    useEffect(() => {
        const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isAutomated = typeof navigator !== 'undefined' && (navigator as any).webdriver;

        const triggerHomeReady = () => {
            if (typeof document !== 'undefined') {
                document.body.classList.add('hero-ready');
            }
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-typing-complete'));
            }
        };

        if (isReduced || isAutomated) {
            setTypedLine1('I Build AI Systems');
            setTypedLine2('That Actually Ship.');
            setHeroPhase('all');
            setActiveCursor(null);
            triggerHomeReady();
            return;
        }

        let timeoutId: NodeJS.Timeout;
        let isMounted = true;

        const line1Prefix = 'I Build ';
        const line1Ai = 'AI';
        const line1Suffix = ' Systems';
        const line2Full = 'That Actually Ship.';

        let idx = 0;
        let line1Accum = '';
        let line2Accum = '';

        const typePrefix = () => {
            if (!isMounted) return;
            if (idx < line1Prefix.length) {
                line1Accum += line1Prefix[idx];
                setTypedLine1(line1Accum);
                idx++;
                timeoutId = setTimeout(typePrefix, 45);
            } else {
                idx = 0;
                typeAi();
            }
        };

        const typeAi = () => {
            if (!isMounted) return;
            if (idx < line1Ai.length) {
                line1Accum += line1Ai[idx];
                setTypedLine1(line1Accum);
                idx++;
                timeoutId = setTimeout(typeAi, 60);
            } else {
                // Deliberate pause right at the "AI" word
                timeoutId = setTimeout(() => {
                    idx = 0;
                    typeSuffix();
                }, 500);
            }
        };

        const typeSuffix = () => {
            if (!isMounted) return;
            if (idx < line1Suffix.length) {
                line1Accum += line1Suffix[idx];
                setTypedLine1(line1Accum);
                idx++;
                timeoutId = setTimeout(typeSuffix, 40);
            } else {
                setActiveCursor('line2');
                timeoutId = setTimeout(() => {
                    idx = 0;
                    typeLine2();
                }, 220);
            }
        };

        const typeLine2 = () => {
            if (!isMounted) return;
            if (idx < line2Full.length) {
                line2Accum += line2Full[idx];
                setTypedLine2(line2Accum);
                idx++;
                timeoutId = setTimeout(typeLine2, 35);
            } else {
                // Completed!
                timeoutId = setTimeout(() => {
                    if (!isMounted) return;
                    setActiveCursor(null);

                    // Step 1: Name appears first
                    setHeroPhase('name');

                    // Step 2: Buttons appear next
                    timeoutId = setTimeout(() => {
                        if (!isMounted) return;
                        setHeroPhase('buttons');

                        // Step 3: All remaining elements (navbar, chat bubble, particles) appear
                        timeoutId = setTimeout(() => {
                            if (!isMounted) return;
                            setHeroPhase('all');
                            triggerHomeReady();
                        }, 400);
                    }, 350);
                }, 150);
            }
        };

        const onEarlyScroll = () => {
            if (window.scrollY > 20) {
                setTypedLine1('I Build AI Systems');
                setTypedLine2('That Actually Ship.');
                setHeroPhase('all');
                setActiveCursor(null);
                triggerHomeReady();
            }
        };
        window.addEventListener('scroll', onEarlyScroll, { passive: true, once: true });

        timeoutId = setTimeout(typePrefix, 200);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', onEarlyScroll);
        };
    }, []);

    const toggleService = (service: string) => {
        setSelectedServices(prev => {
            if (prev.includes(service)) return prev.filter(selected => selected !== service);
            if (service === 'Not Sure Yet') return [service];
            return [...prev.filter(selected => selected !== 'Not Sure Yet'), service];
        });
    };

    const toggleStage = (stage: string) => {
        setSelectedStages(prev => prev.includes(stage) ? [] : [stage]);
    };

    // Modal: scroll lock + focus trap + keyboard handling
    useEffect(() => {
        if (!selectedProject) return;
        document.body.style.overflow = 'hidden';

        // Focus trap
        const modalEl = document.getElementById('project-modal');
        const focusableEls = Array.from(
            modalEl?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) ?? []
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const focusTimer = setTimeout(() => firstEl?.focus(), 50);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setSelectedProject(null); return; }
            if (e.key !== 'Tab' || focusableEls.length === 0) return;
            if (e.shiftKey) {
                if (document.activeElement === firstEl) { e.preventDefault(); lastEl?.focus(); }
            } else {
                if (document.activeElement === lastEl) { e.preventDefault(); firstEl?.focus(); }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
            if (openerRef.current) {
                openerRef.current.focus();
            } else if (previouslyFocused) {
                previouslyFocused.focus();
            }
        };
    }, [selectedProject]);


    useEffect(() => {
        const SECTIONS = ['home', 'about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'];

        const getActiveSection = () => {
            // Use top-biased detection: whichever section's top is closest to 30% from the top of viewport
            const viewportThreshold = window.scrollY + window.innerHeight * 0.3;

            let activeId = 'home';

            // Walk sections in order; the last one whose top is <= threshold wins
            for (const id of SECTIONS) {
                const el = document.getElementById(id);
                if (!el) continue;
                if (el.offsetTop <= viewportThreshold + 80) {
                    activeId = id;
                }
            }

            setActiveSection(activeId);
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            getActiveSection();
        };

        // Run once on mount so the initial state is correct
        getActiveSection();

        window.addEventListener('scroll', handleScroll, { passive: true });
        const handlePopState = () => {
            const requestedSection = window.location.hash.slice(1) || 'home';
            const sectionId = SECTIONS.includes(requestedSection) ? requestedSection : 'home';
            document.getElementById(sectionId)?.scrollIntoView();
            setActiveSection(sectionId);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Close mobile dropdown on outside click, Escape key, or resize to desktop
    useEffect(() => {
        if (!isMobileNavOpen) return;
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
                setIsMobileNavOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileNavOpen(false);
            }
        };
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsMobileNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileNavOpen]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            if (window.location.hash !== `#${id}`) window.history.pushState({ section: id }, '', `#${id}`);
            el.scrollIntoView();
            el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: true });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-body selection:bg-[#474747] selection:text-white">

            <a className="skip-link" href="#main-content">Skip to main content</a>
            <nav className={`fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 md:inset-x-8 max-w-[1440px] mx-auto z-[100] transition-all duration-700 ease-out rounded-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-black/60 backdrop-blur-2xl ${isAllVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
                {/* Left: Brand Name & Mobile Dropdown */}
                <div className="flex-1 flex items-center justify-start min-w-[120px]">
                    {/* Mobile Section Title with Dropdown Arrow */}
                    <div ref={mobileNavRef} className="relative sm:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                            aria-expanded={isMobileNavOpen}
                            aria-haspopup="menu"
                            aria-label="Toggle sections menu"
                            className="flex items-center gap-1.5 text-xs font-black tracking-tighter text-white py-1 px-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all outline-none"
                        >
                            <span className="truncate max-w-[130px]">
                                {activeSection === 'home' ? (
                                    <>KRISH <span className="text-[#A1A1A1]">UJENIYA</span></>
                                ) : activeSection.toUpperCase()}
                            </span>
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 shrink-0 text-[#A1A1A1] ${isMobileNavOpen ? 'rotate-180 text-white' : 'rotate-0'}`}
                                aria-hidden="true"
                            />
                        </button>

                        {/* Mobile Navigation Dropdown Options */}
                        {isMobileNavOpen && (
                            <div
                                role="menu"
                                aria-label="Navigate portfolio sections"
                                className="absolute top-full left-0 mt-3 w-48 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-[150] flex flex-col gap-1"
                            >
                                {[
                                    { id: 'home', label: 'Home' },
                                    { id: 'about', label: 'About' },
                                    { id: 'experience', label: 'Experience' },
                                    { id: 'services', label: 'Services' },
                                    { id: 'projects', label: 'Projects' },
                                    { id: 'documents', label: 'Documents' },
                                    { id: 'testimonials', label: 'Testimonials' },
                                    { id: 'contact', label: 'Contact' },
                                ].map((section) => (
                                    <button
                                        key={section.id}
                                        role="menuitem"
                                        type="button"
                                        onClick={() => {
                                            scrollTo(section.id);
                                            setActiveSection(section.id);
                                            setIsMobileNavOpen(false);
                                        }}
                                        className={`flex items-center justify-between w-full px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                                            activeSection === section.id
                                                ? 'bg-white text-black font-black'
                                                : 'text-[#A1A1A1] hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <span>{section.label}</span>
                                        {activeSection === section.id && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Brand Title */}
                    <div
                        className="hidden sm:flex text-sm sm:text-base font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap outline-none items-center gap-2"
                        onClick={() => scrollTo('home')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                scrollTo('home');
                            }
                        }}
                    >
                        KRISH <span className="text-[#A1A1A1]">UJENIYA</span>
                    </div>
                </div>

                {/* Center: Desktop Navigation Links (About to Contact) */}
                <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 overflow-x-auto no-scrollbar">
                    {['about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo(item);
                            }}
                            className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-white py-1.5 whitespace-nowrap animated-underline ${activeSection === item ? 'text-white' : 'text-white/60'}`}
                            aria-current={activeSection === item ? 'page' : undefined}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right: Hire Me CTA */}
                <div className="flex-1 flex items-center justify-end min-w-[120px]">
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('contact');
                            setActiveSection('contact'); // Force immediate update
                        }}
                        aria-label="Hire me for your next project"
                        className="flex items-center gap-2 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-4 sm:px-5 py-2 rounded-full transition-all duration-500 shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap hover:bg-[#E0E0E0]"
                    >
                        Hire Me <Mail size={12} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </nav>


            <main id="main-content" tabIndex={-1} className="flex flex-col">
                <section id="home" className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-12 py-12 overflow-hidden">
                    <div className={`transition-opacity duration-1000 ${isAllVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <AntigravityCanvas />
                    </div>
                    <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col items-center text-center -translate-y-4 sm:-translate-y-6 md:-translate-y-8">
                        <div className="flex flex-col items-center text-center">
                            <div className={`hero-name text-lg sm:text-2xl font-black tracking-tighter mb-6 sm:mb-8 transition-all duration-700 ease-out ${isNameVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                                KRISH <span className="text-[#A1A1A1]">UJENIYA</span>
                            </div>

                             <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-black tracking-tighter leading-[0.98] sm:leading-[1.0] uppercase break-words overflow-visible">
                                <span className="text-white drop-shadow-2xl block min-h-[1.1em]">
                                    {typedLine1}
                                    {activeCursor === 'line1' && (
                                        <span className="inline-block w-[3px] h-[0.75em] bg-white ml-1.5 align-middle animate-pulse" />
                                    )}
                                </span>
                                <span className="text-[#A1A1A1] text-color-interpolate hover:text-white block mt-2 sm:mt-3 min-h-[1.1em]">
                                    {typedLine2}
                                    {activeCursor === 'line2' && (
                                        <span className="inline-block w-[3px] h-[0.75em] bg-[#A1A1A1] ml-1.5 align-middle animate-pulse" />
                                    )}
                                </span>
                            </h1>

                            {/* Metrics Removed */}

                            <div className={`hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto mt-10 sm:mt-12 md:mt-14 transition-all duration-700 ease-out ${isButtonsVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-6 opacity-0 pointer-events-none'}`}>
                                <a
                                    href="#projects"
                                    onClick={(e) => { e.preventDefault(); scrollTo('projects'); setActiveSection('projects'); }}
                                    aria-label="Explore Work and view my case studies"
                                    className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-white/5"
                                >
                                    Explore Work <Compass size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                </a>
                                <a
                                    href={portfolioData.profile.socials.calendar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Book a Call on Google Calendar"
                                    className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                                >
                                    Book a Call <Calendar size={16} aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mt-20 relative z-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="grid lg:grid-cols-12 gap-12 items-end mb-20">
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Info</span>
                                <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">About <br /><span className="text-[#A1A1A1]">Krish</span></h2>
                            </div>

                            <div className="lg:col-span-5 flex lg:justify-end">
                                <div className="relative w-full max-w-sm aspect-square rounded-[20px] sm:rounded-[40px] overflow-hidden border border-black/5 bg-[#F5F5F5]">
                                    <Image
                                        src={portfolioData.profile.photo.webp}
                                        alt="Krish Ujeniya – AI Researcher, Data Scientist & AI Freelancer based in India"
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 384px"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {portfolioData.about.map((item, i) => (
                                <div key={i} className="flex flex-col gap-6">
                                    <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl">
                                        <item.icon size={20} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-lg text-black/60 leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section id="experience" className="py-24 px-6 md:px-12 bg-white/5">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Path</span>
                            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">Professional <br />Experience</h2>
                        </div>

                        <div className="space-y-12">
                            {portfolioData.experience.map((exp, i) => (
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

                {/* Services Section */}
                <section id="services" className="py-32 px-6 md:px-12 bg-[#FAFAFA] text-black rounded-[40px] md:rounded-[80px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-4 mb-24">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Expertise</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">Core <br /><span className="text-[#A1A1A1]">Services</span></h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioData.services.map((service, i) => (
                                <div
                                    key={i}
                                    className="group p-10 rounded-[40px] border border-black/5 bg-white hover:bg-black hover:text-white transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] group-hover:bg-white/5 rounded-bl-full transition-colors" />

                                    <div className="w-16 h-16 flex items-center justify-center bg-black text-white rounded-2xl mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:scale-110 shadow-lg">
                                        <service.icon size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight mb-4 relative z-10">{service.title}</h3>
                                    <p className="text-lg text-[#525252] leading-relaxed mb-10 relative z-10 group-hover:text-white/80 transition-colors">{service.description}</p>
                                    <ul className="space-y-4 relative z-10">
                                        {service.features.map((feature, fi) => (
                                            <li key={fi} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/80 group-hover:text-white/90 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current group-hover:scale-125 transition-transform" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Section — Google Labs Style */}
                <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-[#F6F5F2] text-neutral-900 rounded-[40px] md:rounded-[64px] my-12 relative overflow-hidden z-10 border border-neutral-200/70 shadow-xl">
                    {/* Google Labs Ambient Organic Curved Shapes */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

                    {/* Bottom Arched Wave matching Google Labs */}
                    <div className="absolute -bottom-24 left-0 right-0 h-48 bg-gradient-to-t from-blue-100/30 via-indigo-50/20 to-transparent rounded-[100%_100%_0_0] pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                            <div className="flex flex-col items-start gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">/ Experiments & Projects</span>
                                <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-black tracking-tighter uppercase leading-none text-neutral-900">
                                    Selected <br />Case Studies
                                </h2>
                            </div>
                            <p className="text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
                                Production AI systems, persistent agent architectures, and end-to-end MLOps engines built for scale.
                            </p>
                        </div>

                        {/* Google Labs Arched Carousel Track */}
                        <div
                            ref={projectsTrackRef}
                            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-8 pt-4 px-2"
                        >
                            {filteredProjects.map((project, i) => {
                                const projectKey = project.title.toLowerCase().split(' ')[0] || '';
                                const style = projectContainerStyles[projectKey] || { bg: 'bg-[#F3F4F6]', badge: 'bg-[#E5E7EB] text-neutral-800' };
                                const categoryBadge = project.category.split('/')[0]?.trim() || project.category;
                                return (
                                    <div
                                        key={project.title}
                                        id={`project-${i}`}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`View case study for ${project.title}`}
                                        onClick={(e) => {
                                            openerRef.current = e.currentTarget;
                                            setSelectedProject(project);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openerRef.current = e.currentTarget;
                                                setSelectedProject(project);
                                            }
                                        }}
                                        className="group flex-shrink-0 w-[calc(100vw-3rem)] xs:w-[320px] sm:w-[350px] md:w-[380px] max-w-[380px] h-[520px] sm:h-[550px] bg-white hover:bg-white border border-neutral-200/90 rounded-[32px] p-5 sm:p-6 flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 relative overflow-hidden snap-start"
                                    >
                                        <div>
                                            {/* Top Preview Block with vibrant rounded container matching Google Labs */}
                                            <div className={`w-full h-[200px] sm:h-[220px] rounded-[22px] sm:rounded-[26px] overflow-hidden relative ${style.bg} border border-black/5 p-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]`}>
                                                <div className="w-full h-full relative rounded-[18px] overflow-hidden bg-black/5">
                                                    <Image
                                                        src={project.imageUrl}
                                                        alt={`${project.title} – AI project by Krish Ujeniya, ${project.category}`}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                </div>
                                            </div>

                                            {/* Category Badge & Tech Badges */}
                                            <div className="flex items-center gap-2 overflow-hidden mt-4 flex-wrap">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${style.badge}`}>
                                                    {categoryBadge}
                                                </span>
                                                {project.techStack.slice(0, 2).map((tech, ti) => (
                                                    <span
                                                        key={ti}
                                                        className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Project Title */}
                                            <h3 className="project-title-bounce text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-snug line-clamp-1 mt-3">
                                                {project.title.split('—')[0]?.trim() || project.title}
                                            </h3>

                                            {/* Project Description */}
                                            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mt-2">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Bottom Action Pill matching Google Labs "Try it now ->" */}
                                        <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
                                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black uppercase tracking-wider transition-all duration-300">
                                                Try it now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                                Case study
                                            </span>
                                        </div>

                                        <noscript>
                                            <div className="px-2 pt-1">
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900 underline hover:text-neutral-600"
                                                >
                                                    {project.linkType === 'repo' ? 'View Repository' : 'View Space'}
                                                </a>
                                            </div>
                                        </noscript>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Carousel Navigation Arrows matching Google Labs */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                onClick={() => scrollProjects('left')}
                                aria-label="Previous project"
                                className="w-12 h-12 rounded-full border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scrollProjects('right')}
                                aria-label="Next project"
                                className="w-12 h-12 rounded-full border border-neutral-300 bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Category Filter Pills matching Google Labs */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mt-6 px-4">
                            {projectCategories.map((cat) => {
                                const isActive = selectedProjectCategory === cat.value;
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedProjectCategory(cat.value)}
                                        aria-pressed={isActive}
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                                            isActive
                                                ? 'bg-[#E8E6DF] text-neutral-900 border border-neutral-300/80 shadow-sm'
                                                : 'bg-[#F1EFEA] text-neutral-600 hover:bg-[#E8E6DF] hover:text-neutral-900'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Documents Section — Google Labs Rounded Carousel Style (Light Monochrome) */}
                <section id="documents" className="py-24 px-4 sm:px-6 md:px-12 bg-[#F5F5F7] text-black rounded-[40px] md:rounded-[64px] my-12 relative overflow-hidden z-10 border border-black/5">
                    {/* Subtle Monochrome Ambient Shapes */}
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/[0.03] blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/[0.03] blur-3xl pointer-events-none" />
                    <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-white/80 blur-3xl pointer-events-none" />

                    <div className="max-w-[1440px] mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                            <div className="flex flex-col items-start gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">/ Resources</span>
                                <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-black tracking-tighter uppercase leading-none text-black">
                                    Technical <br />Resources
                                </h2>
                            </div>
                            <p className="text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
                                Curated technical documentation, course notes, and verified credentials across AI, systems architecture, and engineering.
                            </p>
                        </div>

                        {/* Google Labs Horizontal Carousel Track */}
                        <div
                            ref={documentsTrackRef}
                            className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1"
                        >
                            {portfolioData.documents.map((folder, i) => {
                                const theme = DOCUMENT_THEMES[folder.name] || {
                                    gradient: 'from-[#FFFFFF] via-[#F5F5F5] to-[#E5E5E5]',
                                    accent: 'text-neutral-700',
                                    tag: 'Documentation',
                                };

                                return (
                                    <div
                                        key={i}
                                        className="document-card group flex-shrink-0 w-[calc(100vw-2.5rem)] xs:w-[320px] sm:w-[350px] md:w-[380px] max-w-[380px] bg-white text-black rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 flex flex-col justify-between border border-black/10 hover:border-black/25 shadow-lg hover:shadow-xl transition-all duration-500 snap-start overflow-hidden relative"
                                    >
                                        {/* Upper Visual Illustration matching Google Labs card format */}
                                        <div className={`w-full h-[180px] sm:h-[200px] rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${theme.gradient} border border-black/10 transition-transform duration-500 group-hover:scale-[1.02]`}>
                                            <div className="flex items-center justify-between z-10">
                                                <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-black/10 flex items-center justify-center text-black">
                                                    <folder.icon size={22} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white text-black shadow-sm border border-black/10">
                                                    {folder.files.length} Files
                                                </span>
                                            </div>

                                            <div className="z-10">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${theme.accent}`}>
                                                    {theme.tag}
                                                </span>
                                                <p className="text-xs font-black text-black mt-0.5 truncate">
                                                    {folder.name} Library
                                                </p>
                                            </div>

                                            {/* Decorative soft blurred circles */}
                                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/60 blur-xl pointer-events-none" />
                                        </div>

                                        {/* Middle Content */}
                                        <div className="pt-5 flex-grow flex flex-col justify-start">
                                            <h3 className="text-2xl sm:text-[26px] font-black uppercase tracking-tight text-black leading-tight mb-2">
                                                {folder.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-2">
                                                {folder.description}
                                            </p>
                                        </div>

                                        {/* Bottom Action: Expand / Collapse Button */}
                                        <div className="pt-4">
                                            <button
                                                onClick={() => setExpandedFolder(expandedFolder === i ? null : i)}
                                                aria-label={expandedFolder === i ? `Collapse ${folder.name}` : `View Docs in ${folder.name}`}
                                                aria-expanded={expandedFolder === i}
                                                aria-controls={`documents-folder-${i}`}
                                                className="flex items-center justify-between w-full py-3.5 px-5 rounded-full bg-black/5 hover:bg-black hover:text-white text-black font-black text-[10px] uppercase tracking-[0.2em] border border-black/10 hover:border-black transition-all duration-300 active:scale-95"
                                            >
                                                <span>{expandedFolder === i ? 'Collapse Docs' : 'View Docs'}</span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-[10px] opacity-70 font-bold">{folder.files.length}</span>
                                                    {expandedFolder === i ? (
                                                        <ChevronUp size={14} aria-hidden="true" />
                                                    ) : (
                                                        <ArrowRight size={14} aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform" />
                                                    )}
                                                </span>
                                            </button>

                                            {/* Expanded File Drawer */}
                                            <div
                                                id={`documents-folder-${i}`}
                                                className="overflow-hidden transition-all duration-500 w-full"
                                                style={{
                                                    maxHeight: expandedFolder === i ? '400px' : '0px',
                                                    opacity: expandedFolder === i ? 1 : 0,
                                                }}
                                                aria-hidden={expandedFolder !== i}
                                            >
                                                <div className="pt-3 space-y-2 w-full max-h-56 overflow-y-auto pr-1">
                                                    {folder.files.map((file, fi) => (
                                                        <a
                                                            key={fi}
                                                            href={`${DOCS_BASE_URL}/${folder.path}/${file.name.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            tabIndex={expandedFolder === i ? 0 : -1}
                                                            className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 transition-all text-black w-full min-w-0 group/file"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                                <File size={13} className="text-neutral-500 group-hover/file:text-black shrink-0" aria-hidden="true" />
                                                                <span className="text-[11px] font-bold text-neutral-800 group-hover/file:text-black truncate">{file.name.split('/').pop()}</span>
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase text-neutral-500 ml-2 shrink-0">{file.type}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>

                                            <noscript>
                                                <div className="pt-3 space-y-2 w-full">
                                                    {folder.files.map((file, fi) => (
                                                        <a
                                                            key={fi}
                                                            href={`${DOCS_BASE_URL}/${folder.path}/${file.name.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/5 transition-all text-black w-full min-w-0"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                                <File size={13} className="text-neutral-500 shrink-0" aria-hidden="true" />
                                                                <span className="text-[11px] font-bold text-neutral-800 truncate">{file.name.split('/').pop()}</span>
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase text-neutral-500 ml-2 shrink-0">{file.type}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </noscript>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Carousel Navigation Arrows */}
                        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
                            <button
                                onClick={() => scrollDocuments('left')}
                                aria-label="Previous documents"
                                className="w-12 h-12 rounded-full border border-black/15 bg-white hover:bg-black hover:text-white text-black flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scrollDocuments('right')}
                                aria-label="Next documents"
                                className="w-12 h-12 rounded-full border border-black/15 bg-white hover:bg-black hover:text-white text-black flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 px-6 md:px-12 bg-[#0A0A0A]">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Feedback</span>
                            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none text-white whitespace-pre-wrap">Trusted by <br />Industry Leads</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {portfolioData.testimonials.map((testimonial, i) => (
                                <div
                                    key={i}
                                    className="p-10 md:p-14 rounded-[40px] bg-white/5 border border-white/5 relative group hover:border-white/10 transition-all duration-500"
                                >
                                    <Quote className="absolute top-10 right-10 text-white/5 w-20 h-20" />
                                    <div className="flex flex-col gap-10">
                                        <p className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 leading-tight">
                                            &quot;{testimonial.content}&quot;
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                                                <Image
                                                    src={testimonial.photo}
                                                    alt={`${testimonial.name} – ${testimonial.role}, client of Krish Ujeniya AI Researcher`}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black uppercase tracking-tight text-white">{testimonial.name}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{testimonial.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mb-20 relative z-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="grid lg:grid-cols-12 gap-20">
                            <div className="lg:col-span-6 flex flex-col gap-10">
                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999]">/ Inquiry</span>
                                    <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-[0.85]">Let&apos;s Build <br />Something <br /><span className="text-[#A1A1A1]">That Works</span></h2>
                                </div>
                                <p className="text-xl text-black/60 leading-relaxed max-w-sm">
                                    Got a project in mind? Tell me what you&apos;re working on and I&apos;ll get back within 24 hours with honest thoughts on fit, scope, and timeline.
                                </p>
                                 <div className="flex flex-col gap-4 mt-8">
                                    <a href="mailto:ukideashare0021@gmail.com" className="text-lg sm:text-2xl font-black tracking-tight hover:opacity-50 transition-opacity underline decoration-4 decoration-[#A1A1A1] underline-offset-8 uppercase break-all">ukideashare0021@gmail.com</a>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Based in India · Working Worldwide</span>
                                </div>
                            </div>

                            <div className="lg:col-span-6">
                                        <form action="https://krishujeniya-backend.vercel.app/api/webDATA" method="post" className="flex flex-col gap-8" onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (isSent || isSubmitting) return;

                                            const form = e.currentTarget;
                                            const formData = new FormData(form);

                                            // HONEYPOT: If bot fills this, we silent-success or simply ignore.
                                            // Backend checks for data.honeypot
                                            const honeypot = formData.get('honeypot') as string;

                                            const name = (formData.get('name') as string || '').trim();
                                            const email = (formData.get('email') as string || '').trim();
                                            const company = (formData.get('company') as string || 'Not provided').trim();
                                            const role = formData.get('role') as string || 'Not provided';
                                            const techStack = (formData.get('techStack') as string || 'Not provided').trim();
                                            const budget = formData.get('budget') as string || 'Not selected';
                                            const timeline = formData.get('timeline') as string || 'Not selected';
                                            const discoverySource = formData.get('discoverySource') as string || 'Not provided';
                                            const preferredContactMethod = formData.get('contactMethod') as string || 'Not provided';
                                            const rawMessage = (formData.get('message') as string || '').trim();
                                            const whatsappNumber = ((formData.get('whatsappNumber') as string) || '').trim();
                                            const message = whatsappNumber ? `${rawMessage}\n\n[WhatsApp Contact: ${whatsappNumber}]` : rawMessage;

                                            // Robust Client-side Validation
                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            if (!name || !email || !message || !role || !budget || !timeline || !discoverySource || !preferredContactMethod) {
                                                setErrorMessage('Please fill in all required fields.');
                                                setIsError(true);
                                                return;
                                            }

                                            if (!emailRegex.test(email)) {
                                                setErrorMessage('Please enter a valid email address.');
                                                setIsError(true);
                                                return;
                                            }

                                            setIsSubmitting(true);
                                            setIsError(false);

                                            const submission = {
                                                name,
                                                email,
                                                company,
                                                role,
                                                services: selectedServices,
                                                stage: selectedStages,
                                                techStack,
                                                budget,
                                                timeline,
                                                discoverySource,
                                                preferredContactMethod,
                                                message,
                                                honeypot: honeypot || "",
                                            };
                                            const fingerprint = JSON.stringify(submission);

                                            const API_URL = process.env.NEXT_PUBLIC_VERCEL_API_URL || 'https://krishujeniya-backend.vercel.app/api/webDATA';

                                            try {
                                                const fingerprintHash = await getSubmissionFingerprint(fingerprint);
                                                const existingId = submissionKeyRef.current?.fingerprint === fingerprint
                                                    ? submissionKeyRef.current.id
                                                    : fingerprintHash ? getStoredSubmissionId(fingerprintHash) : null;
                                                const submissionId = existingId || createSubmissionId();
                                                submissionKeyRef.current = { fingerprint, id: submissionId };
                                                if (fingerprintHash) storeSubmissionId(fingerprintHash, submissionId);

                                                const response = await fetch(API_URL, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        ...submission,
                                                        submissionId,
                                                    }),
                                                });

                                                if (response.ok) {
                                                    submissionKeyRef.current = null;
                                                    try {
                                                        sessionStorage.removeItem(CONTACT_SUBMISSION_STORAGE_KEY);
                                                    } catch {
                                                        // Storage cleanup is best-effort after a successful submission.
                                                    }
                                                    setIsSent(true);
                                                    form.reset();
                                                    setSelectedServices([]);
                                                    setSelectedStages([]);
                                                    setTimeout(() => setIsSent(false), 5000);
                                                } else {
                                                    if (response.status === 403) {
                                                        throw new Error('Unauthorized source. Please submit from the official site.');
                                                    } else if (response.status === 500) {
                                                        throw new Error('Internal Server Error. Please try again later.');
                                                    } else {
                                                        throw new Error('Failed to send inquiry.');
                                                    }
                                                }
                                            } catch (error: any) {
                                                console.error('Submission error:', error);
                                                setErrorMessage(error.message || 'Failed to send — email directly.');
                                                setIsError(true);
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}>
                                            {/* Honeypot: visually hidden, filled only by bots */}
                                            <input
                                                type="text"
                                                name="honeypot"
                                                style={{ display: 'none' }}
                                                tabIndex={-1}
                                                autoComplete="off"
                                                aria-hidden="true"
                                            />

                                            {/* Group 1: About You */}
                                            <p className="text-[10px] font-semibold text-[#525252] tracking-wide mb-2">
                                                Fields marked with <span aria-hidden="true" className="text-black font-black">*</span> are required.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Name <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <input id="form-name" name="name" type="text" autoComplete="name" placeholder="YOUR NAME" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Email <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <input id="form-email" name="email" type="email" autoComplete="email" placeholder="YOUR EMAIL" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-company" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Company / Organization <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <input id="form-company" name="company" type="text" autoComplete="organization" placeholder="COMPANY NAME" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-role" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Your Role <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-role" name="role" defaultValue="" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="" disabled>SELECT YOUR ROLE</option>
                                                            {["Founder / Co-founder", "CTO / VP Engineering", "Engineering Lead / Manager", "Product Manager", "Data / ML Team Lead", "Individual / Freelancer", "Other"].map(role => (
                                                                <option key={role} value={role}>{role.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Group 2: Project Info */}
                                            <div className="flex flex-col gap-4">
                                                <label id="form-services-label" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                    Service Interested In <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                </label>
                                                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="form-services-label">
                                                    {["Enterprise RAG", "Agentic AI", "MLOps Architecture", "ML Consulting", "Not Sure Yet"].map(service => (
                                                        <button
                                                            key={service}
                                                            type="button"
                                                            onClick={() => toggleService(service)}
                                                            aria-pressed={selectedServices.includes(service)}
                                                            className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-full border transition-all ${
                                                                selectedServices.includes(service)
                                                                ? 'bg-black text-white border-black'
                                                                : 'bg-black/5 text-[#A1A1A1] border-transparent hover:border-black/20'
                                                            }`}
                                                        >
                                                            {service}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <label id="form-stages-label" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                    Project Stage <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                </label>
                                                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="form-stages-label">
                                                    {["Greenfield Build", "Improve Existing System", "Proof of Concept", "Just Exploring"].map(stage => (
                                                        <button
                                                            key={stage}
                                                            type="button"
                                                            onClick={() => toggleStage(stage)}
                                                            aria-pressed={selectedStages.includes(stage)}
                                                            className={`text-[9px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-full border transition-all ${
                                                                selectedStages.includes(stage)
                                                                ? 'bg-black text-white border-black'
                                                                : 'bg-black/5 text-[#A1A1A1] border-transparent hover:border-black/20'
                                                            }`}
                                                        >
                                                            {stage}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label htmlFor="form-tech-stack" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                    Current Tech Stack <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                </label>
                                                <input id="form-tech-stack" name="techStack" type="text" placeholder="e.g. Python, AWS, Pinecone, LangChain..." className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                <span className="text-[9px] font-medium text-[#525252] mt-1">Helps estimate integration complexity before we talk.</span>
                                            </div>

                                            {/* Group 3: Scope & Logistics */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Budget Range <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-budget" name="budget" defaultValue="" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="" disabled>SELECT BUDGET</option>
                                                            {["Under $5,000", "$5,000–$15,000", "$15,000–$30,000", "$30,000+", "Let's Discuss"].map(budget => (
                                                                <option key={budget} value={budget}>{budget.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-timeline" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Desired Timeline <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-timeline" name="timeline" defaultValue="" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="" disabled>SELECT TIMELINE</option>
                                                            {["ASAP (within 2 weeks)", "1–3 months", "3–6 months", "Flexible", "No hard deadline"].map(timeline => (
                                                                <option key={timeline} value={timeline}>{timeline.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-source" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        How Did You Find Me <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-source" name="discoverySource" defaultValue="" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="" disabled>SELECT SOURCE</option>
                                                            {["LinkedIn", "GitHub", "Google Search", "Hugging Face", "Personal Referral", "Medium", "Other"].map(source => (
                                                                <option key={source} value={source}>{source.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-contact-method" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Preferred Contact Method <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="form-contact-method"
                                                            name="contactMethod"
                                                            defaultValue=""
                                                            onChange={(e) => setContactMethod(e.target.value)}
                                                            required
                                                            className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="" disabled>SELECT METHOD</option>
                                                            {["Email", "Schedule a Call", "WhatsApp", "No Preference"].map(method => (
                                                                <option key={method} value={method}>{method.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ChevronRight size={14} className="rotate-90 text-[#999999]/50" />
                                                        </div>
                                                    </div>
                                                    {contactMethod === 'WhatsApp' && (
                                                        <div className="flex flex-col gap-3 mt-2">
                                                            <label htmlFor="form-whatsapp" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                                WhatsApp Number <span aria-hidden="true" className="text-black font-black">*</span>
                                                            </label>
                                                            <input
                                                                id="form-whatsapp"
                                                                name="whatsappNumber"
                                                                type="tel"
                                                                autoComplete="tel"
                                                                placeholder="+1 (555) 000-0000"
                                                                required
                                                                className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30"
                                                            />
                                                        </div>
                                                    )}
                                                    <noscript>
                                                        <div className="flex flex-col gap-3 mt-2">
                                                            <label htmlFor="form-whatsapp-fallback" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                                WhatsApp / Phone (Optional)
                                                            </label>
                                                            <input
                                                                id="form-whatsapp-fallback"
                                                                name="whatsappNumber"
                                                                type="tel"
                                                                autoComplete="tel"
                                                                placeholder="+1 (555) 000-0000"
                                                                className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30"
                                                            />
                                                        </div>
                                                    </noscript>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label htmlFor="form-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                    Project Details <span aria-hidden="true" className="text-black font-black">*</span>
                                                </label>
                                                <textarea id="form-message" name="message" rows={4} placeholder="TELL ME ABOUT YOUR PROJECT" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 resize-none" />
                                            </div>

                                            <p className="text-[10px] font-medium text-[#525252] leading-relaxed">
                                                Privacy: Your contact details and project summary are retained securely for up to 30 days strictly to review and reply to your inquiry. Data is never shared with third parties or used for unsolicited marketing.
                                            </p>
                                            {isSent ? (
                                                <div role="status" aria-live="polite" className="w-full flex items-center justify-center gap-4 bg-green-500/10 text-green-500 py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] border border-green-500/20 mt-8 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                                    Inquiry Sent! <Sparkles size={18} aria-hidden="true" />
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        aria-label="Send inquiry"
                                                        className="w-full flex items-center justify-center gap-4 bg-black text-white py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] hover:bg-black/80 hover:scale-[0.98] transition-all duration-500 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? 'Sending…' : 'SEND INQUIRY'} <ChevronRight size={18} aria-hidden="true" />
                                                    </button>
                                                    {isError && (
                                                        <div role="alert" className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-red-500/20 mt-4 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                                            {errorMessage}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </form>

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="pt-20 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 border-t border-white/5 bg-[#050505] text-[#FAFAFA] relative overflow-hidden">
                <AntigravityCanvas />
                <div className="max-w-[1440px] mx-auto flex flex-col items-center relative z-10">
                    {/* Top Row: Tagline & Social Links */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pb-12 sm:pb-16 border-b border-white/5">
                        <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[#737373] text-center sm:text-left">
                            © 2026 · AVAILABLE FOR GLOBAL AI RESEARCH & CONTRACTS
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
                            {Object.entries(portfolioData.profile.socials)
                                .filter(([name]) => name !== 'calendar')
                                .map(([name, url]) => (
                                <a
                                    key={name}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit my ${name} profile`}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373] hover:text-white transition-colors border-b border-transparent hover:border-white/30 pb-0.5"
                                >
                                    {name === 'huggingface' ? 'HuggingFace' : name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Giant Monumental Name Banner like Google Antigravity */}
                    <div className="w-full py-12 sm:py-20 md:py-28 flex justify-center items-center overflow-visible select-none">
                        <div
                            className="footer-brand-title w-full flex items-baseline justify-center font-black tracking-tighter text-[clamp(1.75rem,8.2vw,14.5rem)] leading-none text-white whitespace-nowrap"
                            aria-label="KRISH UJENIYA"
                        >
                            <span className="footer-letter inline-block">K</span>
                            <span className="footer-letter inline-block">R</span>
                            <span className="footer-letter inline-block">I</span>
                            <span className="footer-letter inline-block">S</span>
                            <span className="footer-letter inline-block">H</span>
                            <span className="footer-letter inline-block mx-[0.18em]">&nbsp;</span>
                            <span className="footer-letter inline-block">U</span>
                            <span className="footer-letter inline-block">J</span>
                            <span className="footer-letter inline-block">E</span>
                            <span className="footer-letter inline-block">N</span>
                            <span className="footer-letter floating-letter floating-letter-1 inline-block text-white" style={{ transformOrigin: 'bottom center' }}>I</span>
                            <span className="footer-letter floating-letter floating-letter-2 inline-block text-white" style={{ transformOrigin: 'bottom center' }}>Y</span>
                            <span className="footer-letter floating-letter floating-letter-3 inline-block text-white" style={{ transformOrigin: 'bottom center' }}>A</span>
                        </div>
                    </div>

                    {/* Bottom Row: Copyright & Back to Top */}
                    <div className="w-full pt-8 sm:pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
                        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-[#737373]">
                            <span>KRISH UJENIYA</span>
                            <span className="text-white/20">/</span>
                            <span>ALL RIGHTS RESERVED</span>
                            <span className="hidden md:inline text-white/20">/</span>
                            <span className="hidden md:inline">AVAILABLE WORLDWIDE</span>
                        </div>

                        <button
                            onClick={() => scrollTo('home')}
                            aria-label="Back to top"
                            className={`group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#A1A1A1] hover:text-white transition-colors ${scrolled ? 'opacity-100' : 'opacity-70'}`}
                        >
                            Back to Top
                            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all bg-white/5">
                                <ArrowUp size={14} aria-hidden="true" />
                            </span>
                        </button>
                    </div>
                </div>
            </footer>

            {selectedProject && (
                <div
                    id="project-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-12 bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.25s_ease_forwards]"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="w-full max-w-6xl bg-[#0A0A0A] border border-white/10 rounded-[32px] sm:rounded-[64px] overflow-hidden grid lg:grid-cols-12 max-h-full overflow-y-auto relative animate-[scaleIn_0.3s_ease_forwards]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="lg:col-span-5 relative h-[350px] lg:h-auto">
                            <Image
                                src={selectedProject.imageUrl}
                                alt={`${selectedProject.title} – AI project by Krish Ujeniya, Data Scientist & AI Researcher`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 500px"
                                className="object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent"></div>
                            <div className="absolute top-8 left-8">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    aria-label="Close project details"
                                    className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                                >
                                    <X size={20} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-7 p-8 md:p-16 overflow-y-visible">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] mb-4 block">{selectedProject.category}</span>
                            <h3 id="modal-title" className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">{selectedProject.title}</h3>

                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Target size={18} className="text-[#A1A1A1]" aria-hidden="true" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white">The Challenge</h4>
                                    </div>
                                    <p className="text-[#E0E0E0] leading-relaxed italic">{selectedProject.caseStudy.problem}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Lightbulb size={18} className="text-[#A1A1A1]" aria-hidden="true" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white">The Execution</h4>
                                    </div>
                                    <p className="text-[#E0E0E0] leading-relaxed">{selectedProject.caseStudy.solution}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                                        <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shrink-0">
                                            <TrendingUp size={20} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-white mb-1">Impact Delivered</h4>
                                            <p className="text-lg font-bold text-[#E0E0E0]">{selectedProject.impact}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        aria-label={`${selectedProject.linkType === 'repo' ? 'View Repository' : 'View Space'} for ${selectedProject.title}`}
                                        className="flex-grow flex items-center justify-between bg-white text-black px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#474747] hover:text-white transition-all duration-500"
                                    >
                                        {selectedProject.linkType === 'repo' ? 'View Repository' : 'View Space'} <ArrowUpRight size={16} aria-hidden="true" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
