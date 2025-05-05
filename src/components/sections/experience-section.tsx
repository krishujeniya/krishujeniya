
import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, BrainCircuit, Smartphone, Code2 } from 'lucide-react'; // Replaced Python with BrainCircuit
import { cn } from '@/lib/utils'; // Import cn utility
import { cardHoverClasses } from '@/components/ui/card'; // Import cardHoverClasses

const workExperience = [
   {
    role: 'Freelance ML & Software Engineer',
    company: 'Self-Employed',
    duration: '2023 - Present',
    location: 'Remote',
    description: 'Providing bespoke Machine Learning solutions (MLOps, ZenML, MLflow) and full-stack software development (Python, Flutter, PHP, Django). Proven track record of delivering high-impact projects.',
    icon: Briefcase,
    achievement: 'Tools: Python, ZenML, MLflow, Flutter', // Updated text
  },
  {
    role: 'Machine Learning Engineer Intern',
    company: 'Mentorness',
    duration: 'May 2024 - Jul 2024 · 3 mos',
    location: 'Remote',
    description: 'Developed predictive models (e.g., salary prediction, fraud detection) and gained practical experience in applying ML techniques within a professional setting.',
    icon: BrainCircuit, // Changed to BrainCircuit icon for ML
    achievement: 'Built salary prediction model using Scikit-learn.',
  },
  {
    role: 'Flutter Developer Intern',
    company: 'Prelax Infotech',
    duration: 'Jul 2023 - Aug 2023 · 2 mos',
    location: 'Surat, Gujarat, India · Hybrid',
    description: 'Contributed to the development of the SnapText OCR mobile app using Flutter, integrating ML capabilities for text recognition.',
    icon: Smartphone, // Keep Smartphone icon for Flutter
    achievement: 'Developed SnapText OCR app with ML integration.',
  },
  {
    role: 'PHP Developer Intern',
    company: 'For Each Next',
    duration: 'Sep 2022 - Oct 2022 · 2 mos',
    location: 'Surat, Gujarat, India · On-site',
    description: 'Gained foundational web development experience using PHP, MySQL, HTML, CSS, and JavaScript in a team environment.',
    icon: Code2, // Generic code icon for PHP/Web
    achievement: 'Worked with PHP, MySQL, HTML, CSS, JavaScript.',
  },
];

export const ExperienceSection: FC = () => {
  return (
    <section id="experience" className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent">Professional Journey</h2>
      <div className="space-y-8 max-w-4xl mx-auto">
        {workExperience.map((exp, index) => (
           <Card key={index} className={cn(
             "bg-card/80 border border-border shadow-lg",
             cardHoverClasses // Apply cardHoverClasses
           )}>
            <CardHeader>
               <div className="flex items-start gap-4">
                 <exp.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                 <div>
                   <CardTitle className="text-xl text-foreground">{exp.role} - <span className="font-normal text-muted-foreground">{exp.company}</span></CardTitle>
                   <CardDescription className="text-muted-foreground mt-1">
                    {exp.duration} | {exp.location}
                   </CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed mb-3">{exp.description}</p> {/* Added margin bottom */}
              <p className="text-sm text-accent font-medium bg-accent/10 px-3 py-1 rounded-md inline-block"> {/* Highlight achievement */}
                 {exp.achievement} {/* Display simplified achievement/tool text */}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
