
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card'; // Import cardHoverClasses
import { Award, BrainCircuit, BotMessageSquare, Sparkles, Megaphone } from 'lucide-react'; // Added more relevant icons
import { cn } from '@/lib/utils'; // Import cn utility

// Define certificate data with icons
const certificates = [
  {
    title: 'Generative AI by Microsoft and LinkedIn',
    issued: 'Feb 2024',
    description: 'Highlighting practical expertise in Generative AI applications and techniques.',
    icon: Sparkles, // Using Sparkles for Generative AI
  },
  {
    title: 'ChatGPT Master: Complete OpenAI ChatGPT Course by Udemy',
    issued: 'Jul 2023',
    description: 'Demonstrating mastery in utilizing ChatGPT for various tasks and integrations.',
    icon: BotMessageSquare, // Using BotMessageSquare for ChatGPT
  },
  {
    title: 'Machine Learning Bootcamp by AI Planet',
    issued: 'Jun 2023',
    description: 'Showcasing foundational knowledge and practical skills in core Machine Learning concepts.',
    icon: BrainCircuit, // Using BrainCircuit for ML Bootcamp
  },
  {
    title: 'Fundamentals of Digital Marketing by Google',
    issued: 'Apr 2023',
    description: 'Certified understanding of key digital marketing principles and strategies.',
    icon: Megaphone, // Using Megaphone for Marketing
  },
];

export const CertificatesSection: FC = () => {
  return (
    <section id="certificates" className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-accent">Credentials & Certifications</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        Validated expertise in cutting-edge fields like Machine Learning, Generative AI, and Digital Marketing through industry-recognized certifications.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Changed to 4 columns on large screens */}
        {certificates.map((cert, index) => (
          <Card key={index} className={cn(
            "bg-card/80 border border-border shadow-lg flex flex-col items-center text-center p-6",
            cardHoverClasses, // Apply cardHoverClasses
            "hover:scale-[1.03]" // Keep scale effect separate if desired
          )}>
            <CardHeader className="p-0 mb-4"> {/* Removed default padding, added margin */}
              <cert.icon className="h-12 w-12 text-accent mx-auto mb-3" strokeWidth={1.5} /> {/* Larger icon, adjusted stroke */}
              <CardTitle className="text-lg text-foreground">{cert.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-1">Issued: {cert.issued}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-grow"> {/* Removed padding */}
              <p className="text-foreground/90 text-sm leading-relaxed">{cert.description}</p> {/* Slightly dimmer description text */}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
