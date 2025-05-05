'use client'; // Keep as client component for onClick handlers

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Send as SendIcon, Sparkles } from 'lucide-react'; // Added Sparkles icon
import Link from 'next/link';
// import { TypeAnimation } from 'react-type-animation'; // Import removed as type animation isn't implemented

export const HeroSection: FC = () => {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 " aria-hidden="true"></div> {/* Optional: Add a subtle gradient overlay if needed */}
      <div className="relative z-10"> {/* Content wrapper */}
        {/* Headline: Updated, Largest, boldest */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground animate-fade-in-up flex items-center justify-center gap-4">
           <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-accent inline-block" /> {/* Added icon */}
           Krish Ujeniya | Data Scientist {/* Updated Title */}
        </h1>
        {/* Subhead: Updated, Smaller, accent color */}
        <p className="text-lg sm:text-xl md:text-2xl text-accent mb-8 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
          Building intelligent systems with LLMs, AI Agents & MLOps pipelines that transform businesses
        </p>

        {/* REMOVED: Sub-subhead for dynamic typing */}
        {/* <div className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-600">
           Placeholder for future dynamic text/typing animation
           Exploring MLOps, Generative AI, and Vibe Coding...
        </div> */}


        {/* CTA Buttons: Updated text, Side-by-side, primary/secondary colors, animations */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 animate-fade-in-up animation-delay-400">
           <Button
             size="lg"
             onClick={() => handleScrollTo('contact')}
             className="bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
           >
             Hire Me for Your AI Project <SendIcon className="ml-2 h-4 w-4" />
           </Button>
           <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollTo('projects')}
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent focus:ring-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              View My Projects <Eye className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </div>
      {/* styled-jsx requires the component to be a Client Component */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-200 { animation-delay: 0.25s; }
        .animation-delay-400 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.75s; } /* Delay still applies if element reintroduced */
      `}</style>
    </section>
  );
};

