import type { FC } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { CoreExpertiseSection } from '@/components/sections/core-expertise-section'; // Updated import
import { AboutSection } from '@/components/sections/about-section'; // Keep for now, might merge content
import { CertificatesSection } from '@/components/sections/certificates-section';
import { EducationSection } from '@/components/sections/education-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { FeaturedPostSection } from '@/components/sections/featured-post-section';
import { FooterSection } from '@/components/sections/footer-section';
import { ThreeBackground } from '@/components/three-background';

const Home: FC = () => {
  return (
    <>
      <ThreeBackground />
      <div className="relative z-10"> {/* Content container */}
        <HeroSection />
        <CoreExpertiseSection /> {/* NEW: Renamed from ValueProp/ExpertisePulse */}
        <ProjectsSection /> {/* Showcase key work early */}
        <TestimonialsSection /> {/* Build trust with social proof */}
        {/* <FreelancingFeedsSection /> REMOVED: Content merged or removed */}
        <ExperienceSection /> {/* Detail professional background */}
        {/* <AboutSection /> REMOVED: Content likely merged or less critical now */}
        <EducationSection /> {/* Academic background */}
        <CertificatesSection /> {/* Certifications for validation */}
        <FeaturedPostSection /> {/* Display featured article */}
        <FooterSection /> {/* Contact and final links */}
      </div>
    </>
  );
};

export default Home;
