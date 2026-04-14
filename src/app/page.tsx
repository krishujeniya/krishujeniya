import type { FC } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { 
  DynamicThreeBackground as ThreeBackground,
  DynamicExperienceSection as ExperienceSection,
  DynamicDocumentsSection as DocumentsSection,
  DynamicContactSection as ContactSection 
} from '@/components/client-dynamic';

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
