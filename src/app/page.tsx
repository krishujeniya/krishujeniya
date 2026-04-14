import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { DynamicThreeBackground as ThreeBackground } from '@/components/client-dynamic';

const ExperienceSection = dynamic(() => import('@/components/sections/experience-section').then(mod => mod.ExperienceSection), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-3xl m-8" />,
  ssr: false
});

const DocumentsSection = dynamic(() => import('@/components/sections/documents-section').then(mod => mod.DocumentsSection), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-3xl m-8" />,
  ssr: false
});

const ContactSection = dynamic(() => import('@/components/sections/contact-section').then(mod => mod.ContactSection), {
  loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-3xl m-8" />,
  ssr: false
});

const Home: FC = () => {
  return (
    <>
      <ThreeBackground />
      <div
        className="relative z-10 opacity-0 animate-in fade-in duration-700 fill-mode-forwards"
      >
        <HeroSection />
        <CoreExpertiseSection />
        <ProjectsSection />
        <ExperienceSection />
        <DocumentsSection />
        <ContactSection />
      </div>

      <a
        href="#contact"
        className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold text-sm rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:bg-neutral-100 transition-all duration-300"
      >
        Hire Me <span aria-hidden="true">→</span>
      </a>
    </>
  );
};

export default Home;
