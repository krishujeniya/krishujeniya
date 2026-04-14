import type { FC } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { 
  DynamicThreeBackground as ThreeBackground,
} from '@/components/client-dynamic';
import { ExperienceSection } from '@/components/sections/experience-section';
import { DocumentsSection } from '@/components/sections/documents-section';
import { ContactSection } from '@/components/sections/contact-section';

const Home: FC = () => {
  return (
    <>
      <ThreeBackground />
      <div className="relative z-10 min-h-screen">
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
