'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGsapAnimations } from '@/hooks/useGsapAnimations';
import Image from 'next/image';
import { AntigravityCanvas } from '@/components/client-dynamic';
import docsManifest from '../../public/docs-manifest.json';

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

const DOCS_COMMIT_SHA = process.env.NEXT_PUBLIC_DOCS_COMMIT_SHA || 'b09e098ef5d24859dda5c51b5e7a31ca7bdfe103';
const DOCS_BASE_URL = `https://raw.githubusercontent.com/krishujeniya/krishujeniya/${DOCS_COMMIT_SHA}/Docs`;
const CONTACT_SUBMISSION_STORAGE_KEY = 'portfolio-contact-submission';
const getContactApiUrl = () => {
    if (typeof window !== 'undefined') {
        if (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        ) {
            return '/api/webDATA';
        }
    }
    return 'https://api.krishujeniya.workers.dev/api/webDATA';
};

const manifestFiles: Record<string, { bytes: number; sha256: string }> = (docsManifest as any)?.files || {};

const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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

const getBaseUrlPath = (): string => {
    if (typeof window !== 'undefined') {
        return window.location.pathname.startsWith('/krishujeniya') ? '/krishujeniya/' : '/';
    }
    const envBase = process.env.NEXT_PUBLIC_BASE_PATH;
    if (envBase && envBase.length > 0 && envBase !== '/') {
        return `${envBase}/`;
    }
    return '/';
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

    // Initial state starts with empty text and typing phase for a direct on-screen start
    const [typedLine1, setTypedLine1] = useState('');
    const [typedLine2, setTypedLine2] = useState('');
    const [heroPhase, setHeroPhase] = useState<'typing' | 'name' | 'buttons' | 'all'>('typing');
    const [activeCursor, setActiveCursor] = useState<'line1' | 'line2' | null>('line1');
    const projectsTrackRef = useRef<HTMLDivElement | null>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);
    const mobileNavToggleRef = useRef<HTMLButtonElement | null>(null);

    const isNameVisible = heroPhase === 'name' || heroPhase === 'buttons' || heroPhase === 'all';
    const isButtonsVisible = heroPhase === 'buttons' || heroPhase === 'all';
    const isAllVisible = heroPhase === 'all';

    const computeStep = (track: HTMLElement, selector: string) => {
        const card = track.querySelector<HTMLElement>(selector);
        if (!card) return 380;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '24') || 24;
        return card.offsetWidth + gap;
    };

    // Carousel navigation with dynamic gap measurement and reduced motion support
    const scrollProjects = (direction: 'left' | 'right') => {
        const track = projectsTrackRef.current;
        if (!track) return;
        const cardWidth = computeStep(track, '[role="button"]');
        const maxScroll = track.scrollWidth - track.clientWidth;
        const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior = isReduced ? 'auto' : 'smooth';

        if (direction === 'right') {
            if (track.scrollLeft >= maxScroll - 20) {
                track.scrollTo({ left: 0, behavior });
            } else {
                track.scrollBy({ left: cardWidth, behavior });
            }
        } else {
            if (track.scrollLeft <= 20) {
                track.scrollTo({ left: maxScroll, behavior });
            } else {
                track.scrollBy({ left: -cardWidth, behavior });
            }
        }
    };

    const documentsTrackRef = useRef<HTMLDivElement | null>(null);

    const scrollDocuments = (direction: 'left' | 'right') => {
        const track = documentsTrackRef.current;
        if (!track) return;
        const cardWidth = computeStep(track, '.document-card');
        const maxScroll = track.scrollWidth - track.clientWidth;
        const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior = isReduced ? 'auto' : 'smooth';

        if (direction === 'right') {
            if (track.scrollLeft >= maxScroll - 20) {
                track.scrollTo({ left: 0, behavior });
            } else {
                track.scrollBy({ left: cardWidth, behavior });
            }
        } else {
            if (track.scrollLeft <= 20) {
                track.scrollTo({ left: maxScroll, behavior });
            } else {
                track.scrollBy({ left: -cardWidth, behavior });
            }
        }
    };

    // Hero Typewriter with pause at "AI" and smooth sequence:
    // 1. Direct start with typing on screen
    // 2. Name appears after typing completes
    // 3. Buttons appear after Name
    // 4. Navbar, chat bubble, particles and all things appear after Buttons
    useEffect(() => {
        const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isAutomated = typeof navigator !== 'undefined' && Boolean((navigator as any).webdriver);

        const triggerHomeReady = () => {
            if (typeof document !== 'undefined') {
                document.body.classList.add('hero-ready');
            }
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-typing-complete'));
            }
        };

        let timeoutId: NodeJS.Timeout | null = null;
        let isMounted = true;
        let isCompleted = false;

        const completeHero = () => {
            if (isCompleted || !isMounted) return;
            isCompleted = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            setTypedLine1('I Build AI Systems');
            setTypedLine2('That Actually Ship.');
            setHeroPhase('all');
            setActiveCursor(null);
            triggerHomeReady();
            window.removeEventListener('scroll', onEarlyScroll);
        };

        const onEarlyScroll = () => {
            if (window.scrollY > 20) {
                completeHero();
            }
        };
        window.addEventListener('scroll', onEarlyScroll, { passive: true });

        const navEntries = typeof performance !== 'undefined' ? performance.getEntriesByType('navigation') : [];
        const isReload = (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload')
            || (typeof performance !== 'undefined' && (performance as any).navigation?.type === 1);

        // If reduced motion, test runner, already scrolled, or direct deep hash link: show all immediately
        if (
            isReduced ||
            isAutomated ||
            (!isReload && typeof window !== 'undefined' && window.scrollY > 20) ||
            (!isReload && typeof window !== 'undefined' && window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#')
        ) {
            completeHero();
            return () => {
                isMounted = false;
                window.removeEventListener('scroll', onEarlyScroll);
            };
        }

        const line1Prefix = 'I Build ';
        const line1Ai = 'AI';
        const line1Suffix = ' Systems';
        const line2Full = 'That Actually Ship.';

        let idx = 0;
        let line1Accum = '';
        let line2Accum = '';

        const typePrefix = () => {
            if (!isMounted || isCompleted) return;
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
            if (!isMounted || isCompleted) return;
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
                }, 400);
            }
        };

        const typeSuffix = () => {
            if (!isMounted || isCompleted) return;
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
                }, 180);
            }
        };

        const typeLine2 = () => {
            if (!isMounted || isCompleted) return;
            if (idx < line2Full.length) {
                line2Accum += line2Full[idx];
                setTypedLine2(line2Accum);
                idx++;
                timeoutId = setTimeout(typeLine2, 35);
            } else {
                // Completed typing!
                timeoutId = setTimeout(() => {
                    if (!isMounted || isCompleted) return;
                    setActiveCursor(null);

                    // Step 1: Name appears first
                    setHeroPhase('name');

                    // Step 2: Buttons appear next
                    timeoutId = setTimeout(() => {
                        if (!isMounted || isCompleted) return;
                        setHeroPhase('buttons');

                        // Step 3: All remaining elements (navbar, chat bubble, particles, all things) appear
                        timeoutId = setTimeout(() => {
                            if (!isMounted || isCompleted) return;
                            completeHero();
                        }, 400);
                    }, 400);
                }, 180);
            }
        };

        // Direct start with typing on screen
        timeoutId = setTimeout(typePrefix, 80);

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
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

    const openProjectModal = (project: typeof portfolioData.projects[0], triggerEl?: HTMLElement) => {
        if (triggerEl) openerRef.current = triggerEl;
        setSelectedProject(project);
        if (window.location.hash !== `#project-${project.slug}`) {
            window.history.pushState({ project: project.slug }, '', `#project-${project.slug}`);
        }
    };

    const closeProjectModal = () => {
        setSelectedProject(null);
        if (window.location.hash.startsWith('#project-')) {
            window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
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
            if (e.key === 'Escape') { closeProjectModal(); return; }
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

        // Enforce base URL reset on reload across all deployment platforms
        if (typeof window !== 'undefined') {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }
            const navEntries = typeof performance !== 'undefined' ? performance.getEntriesByType('navigation') : [];
            const isReload = (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload')
                || (typeof performance !== 'undefined' && (performance as any).navigation?.type === 1);

            const basePath = getBaseUrlPath();

            if (isReload) {
                if (window.location.hash || window.location.pathname !== basePath) {
                    window.history.replaceState(null, '', basePath);
                }
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                setSelectedProject(null);
                setActiveSection('home');
            } else if (window.location.hash === '#home' || window.location.hash === '#') {
                window.history.replaceState(null, '', basePath);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                setSelectedProject(null);
                setActiveSection('home');
            } else if (window.location.hash.startsWith('#project-')) {
                // Check for direct project deep-link on initial load
                const initialSlug = window.location.hash.replace('#project-', '');
                const matched = portfolioData.projects.find(p => p.slug === initialSlug);
                if (matched) setSelectedProject(matched);
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        const handlePopState = () => {
            const hash = window.location.hash;
            const basePath = getBaseUrlPath();

            if (hash === '#home' || hash === '#') {
                window.history.replaceState(null, '', basePath);
                document.getElementById('home')?.scrollIntoView();
                setActiveSection('home');
                setSelectedProject(null);
                return;
            }

            if (hash.startsWith('#project-')) {
                const slug = hash.replace('#project-', '');
                const matched = portfolioData.projects.find(p => p.slug === slug);
                if (matched) {
                    setSelectedProject(matched);
                    return;
                }
            } else {
                setSelectedProject(null);
            }
            const requestedSection = hash.slice(1) || 'home';
            const sectionId = SECTIONS.includes(requestedSection) ? requestedSection : 'home';
            document.getElementById(sectionId)?.scrollIntoView();
            setActiveSection(sectionId);
        };
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('hashchange', handlePopState);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('hashchange', handlePopState);
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
                mobileNavToggleRef.current?.focus();
            }
        };
        const handleResize = () => {
            if (window.innerWidth >= 768) {
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
            const basePath = getBaseUrlPath();
            if (id === 'home') {
                if (window.location.hash || window.location.pathname !== basePath) {
                    window.history.pushState({ section: 'home' }, '', basePath);
                }
            } else {
                if (window.location.hash !== `#${id}`) {
                    window.history.pushState({ section: id }, '', `#${id}`);
                }
            }
            el.scrollIntoView();
            el.setAttribute('tabindex', '-1');
            el.focus({ preventScroll: true });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-body selection:bg-[#474747] selection:text-white">
            <nav className={`fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 md:inset-x-8 max-w-[1440px] mx-auto z-[100] transition-all duration-700 ease-out rounded-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-black/60 backdrop-blur-2xl ${
                isAllVisible
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : '-translate-y-8 opacity-0 pointer-events-none'
            }`}>
                {/* Left: Brand Name & Mobile Dropdown */}
                <div className="flex-1 flex items-center justify-start min-w-[120px]">
                    {/* Mobile Section Title with Dropdown Arrow */}
                    <div ref={mobileNavRef} className="relative md:hidden">
                        <button
                            ref={mobileNavToggleRef}
                            type="button"
                            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                            aria-expanded={isMobileNavOpen}
                            aria-haspopup="true"
                            aria-controls="mobile-menu"
                            aria-label="Toggle mobile menu"
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
                                id="mobile-menu"
                                role="region"
                                aria-label="Sections menu"
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
                                    <a
                                        key={section.id}
                                        href={section.id === 'home' ? getBaseUrlPath() : `#${section.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
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
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Brand Title */}
                    <a
                        href={getBaseUrlPath()}
                        className="hidden md:flex text-sm sm:text-base font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap outline-none items-center gap-2 no-underline text-inherit"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('home');
                        }}
                    >
                        KRISH <span className="text-[#A1A1A1]">UJENIYA</span>
                    </a>
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
                    <div className={`transition-opacity duration-1000 ${isAllVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <AntigravityCanvas />
                    </div>
                    <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col items-center text-center -translate-y-4 sm:-translate-y-6 md:-translate-y-8">
                        <div className="flex flex-col items-center text-center">
                            <div className={`hero-name text-lg sm:text-2xl font-black tracking-tighter mb-6 sm:mb-8 transition-all duration-700 ease-out ${isNameVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                                KRISH <span className="text-[#A1A1A1]">UJENIYA</span>
                            </div>

                             <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-black tracking-tighter leading-[0.98] sm:leading-[1.0] uppercase break-words overflow-visible">
                                <span className="sr-only">I Build AI Systems That Actually Ship.</span>
                                <span aria-hidden="true" className="text-white drop-shadow-2xl block min-h-[1.1em]">
                                    {typedLine1}
                                    {activeCursor === 'line1' && (
                                        <span className="inline-block w-[3px] h-[0.75em] bg-white ml-1.5 align-middle animate-pulse" />
                                    )}
                                </span>
                                <span aria-hidden="true" className="text-[#A1A1A1] text-color-interpolate hover:text-white block mt-2 sm:mt-3 min-h-[1.1em]">
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

                <div className={`transition-opacity duration-1000 ${isAllVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
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
                <section id="projects" className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#0A0A0A] overflow-hidden">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-20">
                            <div className="flex flex-col items-start gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">/ Catalog</span>
                                <h2 className="text-[clamp(2.75rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">
                                    Selected <br />Case Studies
                                </h2>
                            </div>
                            <p className="text-sm sm:text-base text-[#A1A1A1] max-w-md leading-relaxed">
                                Production AI systems, persistent agent architectures, and end-to-end MLOps engines built for scale.
                            </p>
                        </div>

                        {/* Google Labs Horizontal Carousel Track */}
                        <div
                            ref={projectsTrackRef}
                            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1"
                        >
                            {portfolioData.projects.map((project, i) => (
                                <div
                                    key={project.slug || i}
                                    id={`project-${project.slug || i}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View case study for ${project.title}`}
                                    onClick={(e) => {
                                        openProjectModal(project, e.currentTarget);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            openProjectModal(project, e.currentTarget);
                                        }
                                    }}
                                    className="group flex-shrink-0 w-[calc(100vw-2.5rem)] xs:w-[320px] sm:w-[350px] md:w-[380px] max-w-[380px] h-[520px] sm:h-[560px] bg-[#0E0E0E] hover:bg-[#141414] border border-white/10 hover:border-white/20 rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 flex flex-col justify-between cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all duration-500 shadow-2xl shadow-black relative overflow-hidden snap-start"
                                >
                                    {/* Top Row: Clean Rounded Pill Badges with Category & Tech (Deduplicated, no arrows, no green dots) */}
                                    {(() => {
                                        const categoryBadge = project.category.split('/')[0]?.trim() || project.category;
                                        const uniqueTech = project.techStack.filter(
                                            (tech) => !categoryBadge.toLowerCase().includes(tech.toLowerCase()) &&
                                                      !tech.toLowerCase().includes(categoryBadge.toLowerCase())
                                        );
                                        const badges = [
                                            { label: categoryBadge, isCategory: true },
                                            ...uniqueTech.slice(0, 2).map((tech) => ({ label: tech, isCategory: false })),
                                        ];
                                        return (
                                            <div className="flex items-center gap-2 overflow-hidden z-10 flex-wrap">
                                                {badges.map((b, bi) => (
                                                    <span
                                                        key={bi}
                                                        className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 sm:px-3.5 py-1.5 rounded-full border border-white/5 whitespace-nowrap transition-colors ${
                                                            b.isCategory
                                                                ? 'text-white bg-white/10 group-hover:bg-white/15'
                                                                : 'text-[#A1A1A1] bg-white/5'
                                                        }`}
                                                    >
                                                        {b.label}
                                                    </span>
                                                ))}
                                            </div>
                                        );
                                    })()}

                                    {/* Middle Body: Media Preview (Clean image, responsive height) */}
                                    <div className="w-full h-[200px] sm:h-[240px] relative rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black/60 my-auto border border-white/5 group-hover:border-white/15 transition-all">
                                        <Image
                                            src={project.imageUrl}
                                            alt={`${project.title} – AI project by Krish Ujeniya, ${project.category}`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Bottom Area: Title with physics bounce, description reveal, and Try it now button */}
                                    <div className="flex flex-col gap-2 z-10 pt-2">
                                        {/* Title with spring physics bounce on hover exit */}
                                        <h3 className="project-title-bounce text-xl sm:text-[26px] font-black uppercase tracking-tight text-white leading-tight">
                                            {project.title.split('—')[0]?.trim() || project.title}
                                        </h3>

                                        {/* One-line description that smoothly slides up from below on hover */}
                                        <div className="project-desc-reveal">
                                            <p className="text-[12px] sm:text-[13px] text-white/70 leading-relaxed line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Bottom Action Pill (No redundant right info text) */}
                                        <div className="pt-2 flex items-center">
                                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 group-hover:border-white group-hover:bg-white group-hover:text-black text-white text-[10px] font-black uppercase tracking-wider transition-all duration-300">
                                                View case study <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>

                                    <noscript>
                                        <div className="px-2 pt-1">
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-white underline hover:text-[#A1A1A1]"
                                            >
                                                {project.linkType === 'repo' ? 'View Repository' : 'View Space'}
                                            </a>
                                        </div>
                                    </noscript>
                                </div>
                            ))}
                        </div>

                        {/* Carousel Navigation Arrows matching Google Labs */}
                        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
                            <button
                                onClick={() => scrollProjects('left')}
                                aria-label="Previous project"
                                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scrollProjects('right')}
                                aria-label="Next project"
                                className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Documents Section — Google Labs Rounded Carousel Style (Light Monochrome) */}
                <section id="documents" className="py-24 px-4 sm:px-6 md:px-12 bg-[#F5F5F7] text-black rounded-[40px] md:rounded-[64px] my-12 relative overflow-hidden z-10 border border-black/5">
                    <noscript>
                        <style dangerouslySetInnerHTML={{ __html: '[id^="documents-folder-"] { max-height: none !important; opacity: 1 !important; display: block !important; }' }} />
                    </noscript>
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
                                                    {folder.files.map((file, fi) => {
                                                        const manifestKey = `${folder.path}/${file.name}`;
                                                        const fileMeta = manifestFiles[manifestKey];
                                                        const sizeFormatted = fileMeta ? formatFileSize(fileMeta.bytes) : '';
                                                        const displayTitle = (file as any).title || file.name.split('/').pop()?.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') || file.name;
                                                        return (
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
                                                                    <span className="text-[11px] font-bold text-neutral-800 group-hover/file:text-black truncate">{displayTitle}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                                                    {sizeFormatted && (
                                                                        <span className="text-[9px] font-semibold text-neutral-500">{sizeFormatted}</span>
                                                                    )}
                                                                    <span className="text-[9px] font-black uppercase text-neutral-600 bg-black/5 px-1.5 py-0.5 rounded">{file.type}</span>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
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
                                                    alt=""
                                                    aria-hidden="true"
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
                                        <form action={getContactApiUrl()} method="post" className="flex flex-col gap-8" onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (isSent || isSubmitting) return;

                                            const form = e.currentTarget;
                                            const formData = new FormData(form);

                                            // HONEYPOT: If bot fills this, we silent-success or simply ignore.
                                            const honeypot = (formData.get('honeypot') as string || '').slice(0, 100);

                                            const name = (formData.get('name') as string || '').trim().slice(0, 100);
                                            const email = (formData.get('email') as string || '').trim().slice(0, 120);
                                            const company = (formData.get('company') as string || '').trim().slice(0, 150);
                                            const role = ((formData.get('role') as string) || '').slice(0, 100);
                                            const techStack = (formData.get('techStack') as string || '').trim().slice(0, 200);
                                            const budget = ((formData.get('budget') as string) || '').slice(0, 50);
                                            const timeline = ((formData.get('timeline') as string) || '').slice(0, 50);
                                            const discoverySource = ((formData.get('discoverySource') as string) || '').slice(0, 100);
                                            const preferredContactMethod = ((formData.get('contactMethod') as string) || 'Email').slice(0, 50);
                                            const rawMessage = (formData.get('message') as string || '').trim().slice(0, 3000);
                                            const whatsappNumber = ((formData.get('whatsappNumber') as string) || '').trim().slice(0, 25);

                                            // Robust Client-side Validation: require essential fields and validate formats
                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            if (!name || !email || !rawMessage) {
                                                setErrorMessage('Please fill in your name, email, and project message.');
                                                setIsError(true);
                                                return;
                                            }

                                            if (!emailRegex.test(email)) {
                                                setErrorMessage('Please enter a valid email address.');
                                                setIsError(true);
                                                return;
                                            }

                                            if (preferredContactMethod === 'WhatsApp' && !whatsappNumber) {
                                                setErrorMessage('Please enter your WhatsApp number.');
                                                setIsError(true);
                                                return;
                                            }

                                            if (whatsappNumber) {
                                                const phoneClean = whatsappNumber.replace(/[\s\-\(\)\.]/g, '');
                                                const phoneRegex = /^\+?[0-9]{7,15}$/;
                                                if (!phoneRegex.test(phoneClean) || /[a-zA-Z]/.test(whatsappNumber)) {
                                                    setErrorMessage('Please enter a valid phone number (digits, hyphens, and optional leading +).');
                                                    setIsError(true);
                                                    return;
                                                }
                                            }

                                            setIsSubmitting(true);
                                            setIsError(false);

                                            const submission = {
                                                name,
                                                email,
                                                company: company || 'Not provided',
                                                role: role || 'Not provided',
                                                services: selectedServices,
                                                stage: selectedStages,
                                                techStack: techStack || 'Not provided',
                                                budget: budget || 'Not selected',
                                                timeline: timeline || 'Not selected',
                                                discoverySource: discoverySource || 'Not provided',
                                                preferredContactMethod: preferredContactMethod || 'Email',
                                                whatsappNumber: whatsappNumber || undefined,
                                                message: rawMessage,
                                                honeypot: honeypot || "",
                                            };
                                            const fingerprint = JSON.stringify(submission);

                                            const controller = new AbortController();
                                            const timeoutId = setTimeout(() => controller.abort(), 15000);

                                            try {
                                                const fingerprintHash = await getSubmissionFingerprint(fingerprint);
                                                const existingId = submissionKeyRef.current?.fingerprint === fingerprint
                                                    ? submissionKeyRef.current.id
                                                    : fingerprintHash ? getStoredSubmissionId(fingerprintHash) : null;
                                                const submissionId = existingId || createSubmissionId();
                                                submissionKeyRef.current = { fingerprint, id: submissionId };
                                                if (fingerprintHash) storeSubmissionId(fingerprintHash, submissionId);

                                                let response: Response;
                                                const primaryApiUrl = getContactApiUrl();
                                                try {
                                                    response = await fetch(primaryApiUrl, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            ...submission,
                                                            submissionId,
                                                        }),
                                                        signal: controller.signal,
                                                    });
                                                } catch (fetchError) {
                                                    if (primaryApiUrl.startsWith('https://api.')) {
                                                        response = await fetch('/api/webDATA', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                ...submission,
                                                                submissionId,
                                                            }),
                                                            signal: controller.signal,
                                                        });
                                                    } else {
                                                        throw fetchError;
                                                    }
                                                }
                                                clearTimeout(timeoutId);

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
                                                    setContactMethod('');
                                                } else {
                                                    if (response.status === 403) {
                                                        throw new Error('Unauthorized source. Please submit directly or email ukideashare0021@gmail.com.');
                                                    } else if (response.status === 422) {
                                                        throw new Error('Validation error on server. Please check your inputs or email ukideashare0021@gmail.com.');
                                                    } else if (response.status === 429) {
                                                        throw new Error('Too many requests. Please wait a minute before retrying, or email ukideashare0021@gmail.com.');
                                                    } else if (response.status >= 500) {
                                                        throw new Error('Server temporarily unavailable. Please email ukideashare0021@gmail.com directly.');
                                                    } else {
                                                        throw new Error('Failed to send inquiry — please email ukideashare0021@gmail.com directly.');
                                                    }
                                                }
                                            } catch (error: any) {
                                                clearTimeout(timeoutId);
                                                console.error('Submission error:', error);
                                                if (error.name === 'AbortError') {
                                                    setErrorMessage('Submission timed out after 15 seconds. Your details were kept — retry or email ukideashare0021@gmail.com directly.');
                                                } else {
                                                    setErrorMessage(error.message || 'Failed to send — email ukideashare0021@gmail.com directly.');
                                                }
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
                                                    <input id="form-name" name="name" type="text" maxLength={100} autoComplete="name" placeholder="YOUR NAME" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Email <span aria-hidden="true" className="text-black font-black">*</span>
                                                    </label>
                                                    <input id="form-email" name="email" type="email" maxLength={120} autoComplete="email" placeholder="YOUR EMAIL" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-company" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Company / Organization <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <input id="form-company" name="company" type="text" maxLength={150} autoComplete="organization" placeholder="COMPANY NAME" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-role" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Your Role <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-role" name="role" defaultValue="" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="">SELECT YOUR ROLE (OPTIONAL)</option>
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
                                                <noscript>
                                                    <div className="flex flex-col gap-2 my-2">
                                                        <span className="text-[10px] font-bold text-neutral-600">Select services (optional):</span>
                                                        <div className="flex flex-wrap gap-3">
                                                            {["Enterprise RAG", "Agentic AI", "MLOps Architecture", "ML Consulting", "Not Sure Yet"].map(service => (
                                                                <label key={service} className="flex items-center gap-1.5 text-xs text-neutral-800">
                                                                    <input type="checkbox" name="services" value={service} />
                                                                    <span>{service}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </noscript>
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
                                                <noscript>
                                                    <div className="flex flex-col gap-2 my-2">
                                                        <span className="text-[10px] font-bold text-neutral-600">Select project stage (optional):</span>
                                                        <div className="flex flex-wrap gap-3">
                                                            {["Greenfield Build", "Improve Existing System", "Proof of Concept", "Just Exploring"].map(stage => (
                                                                <label key={stage} className="flex items-center gap-1.5 text-xs text-neutral-800">
                                                                    <input type="radio" name="stage" value={stage} />
                                                                    <span>{stage}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </noscript>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label htmlFor="form-tech-stack" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                    Current Tech Stack <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                </label>
                                                <input id="form-tech-stack" name="techStack" type="text" maxLength={200} placeholder="e.g. Python, AWS, Pinecone, LangChain..." className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                <span className="text-[9px] font-medium text-[#525252] mt-1">Helps estimate integration complexity before we talk.</span>
                                            </div>

                                            {/* Group 3: Scope & Logistics */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">
                                                        Budget Range <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-budget" name="budget" defaultValue="" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="">SELECT BUDGET (OPTIONAL)</option>
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
                                                        Desired Timeline <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-timeline" name="timeline" defaultValue="" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="">SELECT TIMELINE (OPTIONAL)</option>
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
                                                        How Did You Find Me <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select id="form-source" name="discoverySource" defaultValue="" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer">
                                                            <option value="">SELECT SOURCE (OPTIONAL)</option>
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
                                                        Preferred Contact Method <span className="text-[#525252] font-normal lowercase tracking-normal">(optional)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            id="form-contact-method"
                                                            name="contactMethod"
                                                            defaultValue=""
                                                            onChange={(e) => setContactMethod(e.target.value)}
                                                            className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="">SELECT METHOD (OPTIONAL)</option>
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
                                                                inputMode="tel"
                                                                maxLength={25}
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
                                                                maxLength={25}
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
                                                <textarea id="form-message" name="message" rows={4} maxLength={3000} placeholder="TELL ME ABOUT YOUR PROJECT" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 resize-none" />
                                            </div>

                                            <p className="text-[10px] font-medium text-[#525252] leading-relaxed">
                                                Inquiries are securely submitted via backend services and stored in an encrypted database strictly for review and reply. Contact records and project briefs are retained for up to 30 days and never sold or shared with third parties for marketing. To request early deletion or data removal, email ukideashare0021@gmail.com with your submission details.
                                            </p>
                                            {isSent ? (
                                                <div role="status" aria-live="polite" className="w-full flex flex-col items-center justify-center gap-2 bg-[#E8F5E9] text-[#1B5E20] py-6 px-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] border border-[#A5D6A7] mt-8 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                                    <div className="flex items-center gap-3">
                                                        Inquiry Sent! <Sparkles size={18} aria-hidden="true" />
                                                    </div>
                                                    <p className="text-[11px] font-normal normal-case text-[#2E7D32]">Thank you for reaching out. I will reply within 24 hours.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsSent(false)}
                                                        className="mt-2 text-[10px] font-black uppercase tracking-wider underline hover:opacity-80 transition-opacity"
                                                    >
                                                        Send Another Message
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        aria-label={isSubmitting ? "Sending inquiry, please wait" : "Send inquiry"}
                                                        aria-busy={isSubmitting}
                                                        className="w-full flex items-center justify-center gap-4 bg-black text-white py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] hover:bg-black/80 hover:scale-[0.98] transition-all duration-500 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSubmitting ? 'Sending…' : 'SEND INQUIRY'} <ChevronRight size={18} aria-hidden="true" />
                                                    </button>
                                                    {isError && (
                                                        <div role="alert" className="w-full flex flex-col items-center justify-center gap-2 bg-[#FFEBEE] text-[#B71C1C] py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] border border-[#EF9A9A] mt-4 animate-[fadeScaleIn_0.4s_ease_forwards]">
                                                            <span>{errorMessage}</span>
                                                            <span className="text-[10px] font-normal normal-case text-[#C62828]">
                                                                Direct email: <a href="mailto:ukideashare0021@gmail.com" className="underline font-bold text-[#B71C1C]">ukideashare0021@gmail.com</a>
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </form>

                            </div>
                        </div>
                    </div>
                </section>
                </div>
            </main>

            <footer className={`pt-20 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 border-t border-white/5 bg-[#050505] text-[#FAFAFA] relative overflow-hidden transition-opacity duration-1000 ${isAllVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <AntigravityCanvas />
                <div className="max-w-[1440px] mx-auto flex flex-col items-center relative z-10">
                    {/* Top Row: Tagline & Social Links */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pb-12 sm:pb-16 border-b border-white/5">
                        <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[#A3A3A3] text-center sm:text-left">
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
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] hover:text-white transition-colors border-b border-transparent hover:border-white/30 pb-0.5"
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
                        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-[#A3A3A3]">
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
                    onClick={() => closeProjectModal()}
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
                                sizes="(max-width: 1024px) 100vw, 480px"
                                className="object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent"></div>
                            <div className="absolute top-8 left-8">
                                <button
                                    onClick={() => closeProjectModal()}
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
                                        rel="noopener noreferrer"
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
