'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';
import { 
    DynamicThreeBackground as ThreeBackground,
} from '@/components/client-dynamic';
import { 
    Target, 
    Lightbulb, 
    TrendingUp, 
    File,
} from 'lucide-react';




const DOCS_BASE_URL = 'https://github.com/krishujeniya/krishujeniya/raw/main/Docs';

export default function Portfolio() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);
    const [expandedFolder, setExpandedFolder] = useState<string | null>(null);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            
            // Check if we are at the bottom of the page
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                setActiveSection('contact');
                return;
            }

            const sections = ['home', 'about', 'experience', 'projects', 'documents', 'contact'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 200 && rect.bottom >= 200;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
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
        <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#474747] selection:text-white overflow-x-hidden">
            <ThreeBackground />

            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4 border-b border-white/5' : 'py-6'}`}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
                    <div 
                        className="text-lg sm:text-2xl font-black tracking-tighter cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2 whitespace-nowrap"
                        onClick={() => scrollTo('home')}
                    >
                        KRISH <span className="text-[#474747]">UJENIYA</span>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-8">
                        {['home', 'about', 'experience', 'projects', 'documents', 'contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollTo(item)}
                                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-white ${activeSection === item ? 'text-white' : 'text-[#474747]'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => scrollTo('contact')}
                        className="flex group items-center gap-2 sm:gap-3 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#474747] hover:text-white transition-all duration-500 shadow-xl shadow-white/5"
                    >
                        Hire Me <span className="material-symbols-outlined text-[14px] sm:text-[16px]" data-icon="login">login</span>
                    </button>
                </div>
            </nav>


            <main>
                <section id="home" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 md:pt-20">
                    <div className="max-w-[1440px] mx-auto w-full">
                        <div className="flex flex-col items-start gap-6 md:gap-8">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{portfolioData.profile.availability}</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-black tracking-tighter leading-[0.8] uppercase break-words overflow-visible"
                            >
                                Machine <br />
                                <span className="text-[#474747]">Learning</span> <br />
                                Engineer
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm md:text-xl text-[#A1A1A1] max-w-xl leading-relaxed font-medium"
                            >
                                {portfolioData.profile.tagline}
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto pt-4"
                            >
                                <button 
                                    onClick={() => scrollTo('projects')}
                                    className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl shadow-white/5"
                                >
                                    Explore Work <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="explore">explore</span>
                                </button>
                                <a 
                                    href="https://calendly.com/krishujeniya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto flex items-center justify-center gap-4 border border-white/10 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-500"
                                >
                                    Book a Call <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mt-20 relative z-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-8 mb-20">
                            <div className="flex flex-col gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999]">/ Info</span>
                                <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">About <br /><span className="text-[#E0E0E0]">Krish</span></h2>
                            </div>
                            
                            {/* Square Image Below Krish */}
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
                <section id="experience" className="py-40 px-6 md:px-12">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#474747]">/ Path</span>
                            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none">Professional <br />Experience</h2>
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
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#474747]">{exp.duration}</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">{exp.location}</span>
                                    </div>
                                    <div className="md:col-span-6 flex flex-col gap-4">
                                        <h3 className="text-3xl font-black uppercase tracking-tight group-hover:text-[#A1A1A1] transition-colors">{exp.role}</h3>
                                        <p className="text-[#A1A1A1] text-lg leading-relaxed">{exp.description}</p>
                                        <div className="flex flex-wrap gap-2 pt-4">
                                            {exp.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1 bg-white/5 rounded-full text-[#474747]">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 flex md:justify-end items-start pt-2">
                                        <span className="text-xl font-bold tracking-tighter uppercase text-[#474747]">{exp.company}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-40 px-6 md:px-12 bg-[#0A0A0A]">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-start gap-4 mb-24">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#474747]">/ Catalog</span>
                            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">Selected <br />Case Studies</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {portfolioData.projects.map((project, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col gap-6 cursor-pointer"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="aspect-[4/5] relative overflow-hidden rounded-[32px] bg-[#111]">
                                        <Image
                                            src={project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0 opacity-60 group-hover:opacity-100"
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
                                                <span key={tag} className="text-[9px] font-black uppercase tracking-[0.1em] text-[#474747]">{tag}</span>
                                            ))}
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-[#474747] group-hover:text-white group-hover:translate-x-1 transition-all" data-icon="east">east</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Documents Section */}
                <section id="documents" className="py-40 px-6 md:px-12">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex flex-col items-center text-center gap-6 mb-32">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#474747]">/ Archive</span>
                            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none">Technical <br />Knowledge Base</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioData.documents.map((folder, i) => (
                                <div key={i} className="group flex flex-col p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl group-hover:bg-[#474747] transition-colors">
                                            <folder.icon size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#474747]">{folder.files.length} Files</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{folder.name}</h3>
                                    <p className="text-[#A1A1A1] leading-relaxed text-sm mb-8 flex-grow">{folder.description}</p>
                                    
                                    <button 
                                        onClick={() => setExpandedFolder(expandedFolder === folder.name ? null : folder.name)}
                                        className="flex items-center justify-between w-full py-4 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#A1A1A1] transition-colors"
                                    >
                                        <span>{expandedFolder === folder.name ? 'Collapse' : 'View Docs'}</span>
                                        <span className="material-symbols-outlined text-[16px]" data-icon={expandedFolder === folder.name ? 'expand_less' : 'expand_more'}>
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
                                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group/file"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <File size={14} className="text-[#474747]" />
                                                            <span className="text-[11px] font-bold text-[#A1A1A1] group-hover/file:text-white truncate max-w-[150px]">{file.name.split('/').pop()}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-[#474747]">{file.type}</span>
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

                {/* Contact Section */}
                <section id="contact" className="py-40 px-6 md:px-12 bg-white text-black rounded-[40px] md:rounded-[80px] mb-20 relative z-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="grid lg:grid-cols-12 gap-20">
                            <div className="lg:col-span-6 flex flex-col gap-10">
                                <div className="flex flex-col gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#999999]">/ Inquiry</span>
                                    <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">Let&apos;s <br />Build <br /><span className="text-[#E0E0E0]">Future</span></h2>
                                </div>
                                <p className="text-xl text-black/60 leading-relaxed max-w-sm">
                                    Ready to empower your business with high-performance AI systems? Let&apos;s start a conversation.
                                </p>
                                 <div className="flex flex-col gap-4 mt-8">
                                    <a href="mailto:ukideashare0021@gmail.com" className="text-lg sm:text-2xl font-black tracking-tight hover:opacity-50 transition-opacity underline decoration-4 decoration-[#E0E0E0] underline-offset-8 uppercase break-all">ukideashare0021@gmail.com</a>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#999999]">Based in India · Working Worldwide</span>
                                </div>
                            </div>

                            <div className="lg:col-span-6">
                                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="flex flex-col gap-3">
                                            <input type="text" placeholder="NAME" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-6 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-6 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <textarea rows={4} placeholder="TELL ME ABOUT YOUR PROJECT" className="w-full bg-transparent border-0 border-b border-[#E0E0E0] py-6 text-sm font-black uppercase tracking-[0.2em] focus:ring-0 focus:border-black transition-all placeholder:text-[#999999] resize-none" />
                                    </div>
                                    <button 
                                        onClick={() => window.location.href = `mailto:ukideashare0021@gmail.com?subject=Project Inquiry`}
                                        className="w-full flex items-center justify-center gap-4 bg-black text-white py-8 rounded-none text-sm font-black uppercase tracking-[0.3em] hover:bg-[#474747] transition-all duration-500 mt-8"
                                    >
                                        Send Message <span className="material-symbols-outlined" data-icon="east">east</span>
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#0A0A0A]">
                <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-12 sm:gap-16">
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-2xl font-black tracking-tighter text-white">KRISH UJENIYA</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#474747] text-center max-w-xs leading-relaxed">
                            © 2024 · BUILDING THE FUTURE WITH MACHINE LEARNING
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
                        {['LinkedIn', 'HuggingFace', 'GitHub', 'Medium'].map(link => (
                            <a key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#474747] hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">{link}</a>
                        ))}
                    </div>

                    <button 
                        onClick={() => scrollTo('home')}
                        className="group flex flex-col items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#474747] hover:text-white transition-all"
                    >
                        <span className="w-10 h-10 rounded-full border border border-white/5 flex items-center justify-center group-hover:border-white/20 transition-all">
                            <span className="material-symbols-outlined text-[16px]" data-icon="arrow_upward">arrow_upward</span>
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
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent"></div>
                                <div className="absolute top-8 left-8">
                                    <button 
                                        onClick={() => setSelectedProject(null)}
                                        className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                                    >
                                        <span className="material-symbols-outlined" data-icon="close">close</span>
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-7 p-8 md:p-16 overflow-y-auto max-h-[92vh]">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#474747] mb-4 block">{selectedProject.category}</span>
                                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">{selectedProject.title}</h3>
                                
                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Target size={18} className="text-[#474747]" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-white">The Challenge</h4>
                                        </div>
                                        <p className="text-[#A1A1A1] leading-relaxed italic">{selectedProject.caseStudy.problem}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Lightbulb size={18} className="text-[#474747]" />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-white">The Execution</h4>
                                        </div>
                                        <p className="text-[#A1A1A1] leading-relaxed">{selectedProject.caseStudy.solution}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                                            <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shrink-0">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-white mb-1">Impact Delivered</h4>
                                                <p className="text-lg font-bold text-[#A1A1A1]">{selectedProject.impact}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex gap-4">
                                        <a href={selectedProject.link} target="_blank" className="flex-grow flex items-center justify-between bg-white text-black px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#474747] hover:text-white transition-all duration-500">
                                            View Repository <span className="material-symbols-outlined" data-icon="arrow_outward">arrow_outward</span>
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
