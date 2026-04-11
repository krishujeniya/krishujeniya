import type { FC } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { DocumentsSection } from '@/components/sections/documents-section';
import { ContactSection } from '@/components/sections/contact-section';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(
  () => import('@/components/three-background').then(mod => ({ default: mod.ThreeBackground })),
  { ssr: false }
);

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
    </>
  );
};

export default Home;
