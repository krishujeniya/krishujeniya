'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';

import { 
    Target, 
    Lightbulb, 
    TrendingUp, 
    File,
    BrainCircuit,
    Quote,
    Mail,
    ChevronRight,
    X,
    ArrowUp,
} from 'lucide-react';




const DOCS_BASE_URL = 'https://github.com/krishujeniya/krishujeniya/raw/main/Docs';

export default function Portfolio() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);
    const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);

    // BUG-011/012: Modal accessibility and scroll lock
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setSelectedProject(null);
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [selectedProject]);


    useEffect(() => {
        const SECTIONS = ['home', 'about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'];

        const getActiveSection = () => {
            // Midpoint of the viewport — whichever section is closest to this wins
            const viewportMid = window.scrollY + window.innerHeight / 2;

            let closestId = 'home';
            let closestDist = Infinity;

            SECTIONS.forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                const elMid = el.offsetTop + el.offsetHeight / 2;
                const dist = Math.abs(viewportMid - elMid);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestId = id;
                }
            });

            setActiveSection(closestId);
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            getActiveSection();
        };

        // Run once on mount so the initial state is correct
        getActiveSection();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-body selection:bg-[#474747] selection:text-white">

            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/5 rounded-b-[32px] sm:rounded-b-[40px]' : 'py-6'}`}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-8 overflow-hidden">
                        {/* Brand Title / Section Name */}
                        <div 
                            className="text-lg sm:text-2xl font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap outline-none flex items-center gap-2"
                            onClick={() => scrollTo('home')}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && scrollTo('home')}
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
                            {['home', 'about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollTo(item);
                                    }}
                                    className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-white py-2 whitespace-nowrap ${activeSection === item ? 'text-white' : 'text-white/40'}`}
                                    aria-current={activeSection === item ? 'page' : undefined}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            scrollTo('contact');
                            setActiveSection('contact'); // Force immediate update
                        }}
                        aria-label="Hire me for your next project"
                        className="flex items-center gap-2 sm:gap-3 bg-white text-black text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-black hover:text-white transition-all duration-500 shadow-xl shadow-white/5 active:scale-95 whitespace-nowrap"
                    >
                        Hire Me <Mail size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </nav>


            <div className="flex flex-col">
                <section id="home" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 md:pt-20 scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto w-full">
                        <div className="flex flex-col items-start gap-6 md:gap-8">
                            {/* Availability Removed */}

                             <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-[clamp(3rem,12vw,8rem)] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase break-words overflow-visible"
                            >
                                <span className="text-white drop-shadow-2xl">I Build AI</span> <br />
                                <span className="text-[#A1A1A1]">Systems That</span> <br />
                                <span className="flex items-center gap-4 sm:gap-10">
                                    Actually Ship.<motion.div 
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        className="hidden md:flex w-24 h-24 rounded-[32px] border-2 border-white/10 items-center justify-center p-4 bg-white/5"
                                    >
                                        <BrainCircuit size={48} className="text-[#A1A1A1]" />
                                    </motion.div>
                                </span>
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm md:text-xl text-[#A1A1A1] max-w-xl leading-relaxed font-medium"
                            >
                                {portfolioData.profile.tagline}
                            </motion.p>

                            {/* Metrics Removed */}

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto pt-4"
                            >
                                <button 
                                    onClick={() => scrollTo('projects')}
                                    aria-label="Explore my work and case studies"
                                    className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl shadow-white/5"
                                >
                                    Explore Work <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">explore</span>
                                </button>
                                <a 
                                    href={portfolioData.profile.socials.calendar}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Book a consultation call on Google Calendar"
                                    className="w-full sm:w-auto flex items-center justify-center gap-4 border border-white/10 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-500"
                                >
                                    Book a Call <span className="material-symbols-outlined" aria-hidden="true">calendar_today</span>
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section id="about" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mt-20 relative z-10 scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-8 mb-20">
                            <div className="flex flex-col gap-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Info</span>
                                <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">About <br /><span className="text-[#A1A1A1]">Krish</span></h2>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative w-full max-w-sm aspect-square rounded-[20px] sm:rounded-[40px] overflow-hidden border border-black/5 bg-[#F5F5F5]"
                            >
                                <Image 
                                    src={portfolioData.profile.photo.jpg} 
                                    alt={portfolioData.profile.name} 
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 384px"
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
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
                <section id="experience" className="py-24 px-6 md:px-12 bg-white/5 scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Path</span>
                            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">Professional <br />Experience</h2>
                        </div>

                        <div className="space-y-12">
                            {portfolioData.experience.map((exp, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
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
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-32 px-6 md:px-12 bg-[#FAFAFA] text-black rounded-[40px] md:rounded-[80px] scroll-mt-20 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-4 mb-24">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Expertise</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">Core <br /><span className="text-[#A1A1A1]">Services</span></h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {portfolioData.services.map((service, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
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
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-24 px-6 md:px-12 bg-[#0A0A0A] scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-4 mb-24">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">/ Catalog</span>
                            <h2 className="text-[clamp(3rem,8vw,8rem)] font-black tracking-tighter uppercase leading-none">Selected <br />Case Studies</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {portfolioData.projects.map((project, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col gap-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/10 rounded-[40px] p-2"
                                    onClick={() => setSelectedProject(project)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedProject(project)}
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
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Documents Section */}
                <section id="documents" className="py-24 px-6 md:px-12 bg-white/5 scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Resources</span>
                            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none">Technical <br />Resources</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioData.documents.map((folder, i) => (
                                <div key={i} className="group flex flex-col p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl group-hover:bg-[#A1A1A1] transition-colors">
                                            <folder.icon size={20} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{folder.files.length} Files</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{folder.name}</h3>
                                    <p className="text-[#A1A1A1] leading-relaxed text-sm mb-8 flex-grow">{folder.description}</p>
                                    
                                    <button 
                                        onClick={() => setExpandedFolder(expandedFolder === folder.name ? null : folder.name)}
                                        aria-label={expandedFolder === folder.name ? `Collapse ${folder.name}` : `Expand ${folder.name}`}
                                        className="flex items-center justify-between w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#A1A1A1] transition-colors"
                                    >
                                        <span>{expandedFolder === folder.name ? 'Collapse' : 'View Docs'}</span>
                                        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                                            {expandedFolder === folder.name ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {expandedFolder === folder.name && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pt-4 space-y-2"
                                            >
                                                {folder.files.map((file, fi) => (
                                                    <a 
                                                        key={fi}
                                                        href={`${DOCS_BASE_URL}/${folder.path}/${file.name.split('/').map(segment => encodeURIComponent(segment)).join('/')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`Open ${file.name}`}
                                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group/file"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <File size={14} className="text-white/40" aria-hidden="true" />
                                                            <span className="text-[11px] font-bold text-[#A1A1A1] group-hover/file:text-white truncate max-w-[250px]">{file.name.split('/').pop()}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-white/40">{file.type}</span>
                                                    </a>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 px-6 md:px-12 bg-[#0A0A0A] scroll-mt-20">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A1A1A1]">/ Feedback</span>
                            <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-black tracking-tighter uppercase leading-none text-white whitespace-pre-wrap">Trusted by <br />Industry Leads</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {portfolioData.testimonials.map((testimonial, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="p-10 md:p-14 rounded-[40px] bg-white/5 border border-white/5 relative group hover:border-white/10 transition-all duration-500"
                                >
                                    <Quote className="absolute top-10 right-10 text-white/5 w-20 h-20" />
                                    <div className="flex flex-col gap-10">
                                        <p className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 leading-tight">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                                                <Image 
                                                    src={testimonial.photo} 
                                                    alt={testimonial.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black uppercase tracking-tight text-white">{testimonial.name}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{testimonial.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mb-20 relative z-10 scroll-mt-20">
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
                                        <form className="flex flex-col gap-8" onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.currentTarget as HTMLFormElement;
                                            const name = (document.getElementById('form-name') as HTMLInputElement)?.value;
                                            const email = (document.getElementById('form-email') as HTMLInputElement)?.value;
                                            const message = (document.getElementById('form-message') as HTMLTextAreaElement)?.value;
                                            if (name && email && message) {
                                                setIsSent(true);
                                                const mailtoUrl = `mailto:ukideashare0021@gmail.com?subject=Project Inquiry from ${name}&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${email}`;
                                                window.location.href = mailtoUrl;
                                                
                                                // BUG-006: Reset form state and inputs after delay
                                                setTimeout(() => {
                                                    setIsSent(false);
                                                    form.reset();
                                                }, 5000);
                                            }
                                        }}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="flex flex-col gap-3">
                                                    <input id="form-name" name="name" type="text" placeholder="YOUR NAME" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <label htmlFor="form-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Email</label>
                                                    <input id="form-email" name="email" type="email" placeholder="YOUR EMAIL" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label htmlFor="form-message" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Project Details</label>
                                                <textarea id="form-message" name="message" rows={4} placeholder="TELL ME ABOUT YOUR PROJECT" required className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-4 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]/30 resize-none" />
                                            </div>
                                            {isSent ? (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full flex items-center justify-center gap-4 bg-green-500/10 text-green-500 py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] border border-green-500/20 mt-8"
                                                >
                                                    Message Prepared! <Mail size={18} aria-hidden="true" />
                                                </motion.div>
                                            ) : (
                                                <button 
                                                    type="submit"
                                                    aria-label="Prepare message via email"
                                                    className="w-full flex items-center justify-center gap-4 bg-black text-white py-8 rounded-full text-sm font-black uppercase tracking-[0.3em] hover:bg-black/80 hover:scale-[0.98] transition-all duration-500 mt-8"
                                                >
                                                    Send Message <ChevronRight size={18} aria-hidden="true" />
                                                </button>
                                            )}
                                        </form>

                            </div>
                        </div>
                    </div>
                </section>
            </div>

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
                        onClick={() => scrollTo('home')}
                        aria-label="Back to home"
                        className="group flex flex-col items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#A1A1A1] hover:text-white transition-all"
                    >
                        <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all bg-white/5">
                            <ArrowUp size={18} aria-hidden="true" />
                        </span>
                        Back to Top
                    </button>
                </div>
            </footer>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-12 bg-black/95 backdrop-blur-2xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-6xl bg-[#0A0A0A] border border-white/10 rounded-[32px] sm:rounded-[64px] overflow-hidden grid lg:grid-cols-12 max-h-full overflow-y-auto relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="lg:col-span-5 relative h-[350px] lg:h-auto">
                                <Image
                                    src={selectedProject.imageUrl}
                                    alt={selectedProject.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 500px"
                                    className="object-cover"
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
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">{selectedProject.title}</h3>
                                
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
                                            aria-label={`View ${selectedProject.title} ${selectedProject.linkType === 'repo' ? 'repository' : 'space'}`}
                                            className="flex-grow flex items-center justify-between bg-white text-black px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#474747] hover:text-white transition-all duration-500"
                                        >
                                            {selectedProject.linkType === 'repo' ? 'View Repository' : 'View Space'} <span className="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
