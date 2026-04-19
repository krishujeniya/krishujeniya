'use client';

import React, { useState, useEffect } from 'react';
import { useGsapAnimations } from '@/hooks/use-gsap-animations';
import { portfolioData } from '@/data/portfolio';

// Layout components
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Section components
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Experience } from '@/components/sections/experience';
import { Services } from '@/components/sections/services';
import { Projects } from '@/components/sections/projects';
import { Documents } from '@/components/sections/documents';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';

// Shared components
import { ProjectModal } from '@/components/shared/project-modal';

export default function Portfolio() {
    useGsapAnimations();
    
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Modal: scroll lock + focus trap + keyboard handling
    useEffect(() => {
        if (!selectedProject) return;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedProject(null);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProject]);

    useEffect(() => {
        const SECTIONS = ['home', 'about', 'experience', 'services', 'projects', 'documents', 'testimonials', 'contact'];

        const getActiveSection = () => {
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
            <Navbar 
                activeSection={activeSection} 
                scrolled={scrolled} 
                onScrollTo={scrollTo} 
            />

            <main className="flex flex-col">
                <Hero 
                    tagline={portfolioData.profile.tagline}
                    socials={portfolioData.profile.socials}
                    onScrollTo={scrollTo}
                />
                
                <About 
                    profile={portfolioData.profile} 
                    about={portfolioData.about}
                />
                
                <Experience 
                    experience={portfolioData.experience} 
                />
                
                <Services 
                    services={portfolioData.services} 
                />
                
                <Projects 
                    projects={portfolioData.projects} 
                    onProjectSelect={setSelectedProject}
                />
                
                <Documents 
                    documents={portfolioData.documents} 
                />
                
                <Testimonials 
                    testimonials={portfolioData.testimonials} 
                />
                
                <Contact />
            </main>

            <Footer 
                scrolled={scrolled} 
                onScrollTo={scrollTo} 
            />

            <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />
        </div>
    );
}
