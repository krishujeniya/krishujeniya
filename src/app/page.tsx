import type { FC } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { DocumentsSection } from '@/components/sections/documents-section';
import { ContactSection } from '@/components/sections/contact-section';
import { DynamicThreeBackground as ThreeBackground } from '@/components/client-dynamic';

const Home: FC = () => {
  return (
    <>
      <ThreeBackground />
      <div
        className="relative z-10"
        style={{ animation: 'fadeIn 0.8s ease-out forwards', opacity: 0 }}
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
        className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold text-sm rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:scale-105 hover:bg-neutral-100 transition-all duration-300"
      >
        Hire Me <span aria-hidden="true">→</span>
      </a>
    </>
  );
};

export default Home;
