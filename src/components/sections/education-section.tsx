import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card'; // Import cardHoverClasses
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

const educationHistory = [
    {
    institution: 'Gujarat Technological University (GTU)',
    degree: 'B.E. in Electronics and Communication Engineering (ECE)',
    years: '2024 - Present',
    description: 'Learning about Machine Learning, AI, VLSI, Semiconductor technology, Robotics, Embedded Systems, Microprocessor controllers, and Sensors.',
    grade: 'Ongoing',
  },
  {
    institution: 'Gujarat Technological University (GTU)',
    degree: 'Diploma Engineering, Information Technology',
    years: '2021 - 2024',
    description: 'Focused on software development, databases, and networking fundamentals.', // Added a brief description
    grade: '9.30 CGPA',
  },
  {
    institution: 'Gujarat Secondary and Higher Secondary Education Board (GSEB)',
    degree: 'SSC (Secondary School Certificate)',
    years: 'Completed 2021',
    description: 'Completed secondary education with a focus on science and mathematics.', // Added a brief description
    grade: 'A1 Grade',
  },
];

export const EducationSection: FC = () => {
  return (
    <section id="education" className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent">Academic Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {educationHistory.map((edu, index) => (
          <Card key={index} className={cn(
            "bg-card/80 border border-border shadow-lg flex flex-col",
            cardHoverClasses // Apply cardHoverClasses
          )}>
            <CardHeader>
               <div className="flex items-start gap-4">
                 <GraduationCap className="h-8 w-8 text-accent mt-1 shrink-0" />
                 <div>
                    <CardTitle className="text-xl text-foreground">{edu.institution}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">{edu.degree}</CardDescription>
                    <CardDescription className="text-muted-foreground mt-1">{edu.years}</CardDescription> {/* Added years here */}
                 </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow"> {/* Use flex-grow to push footer down */}
              <p className="text-foreground leading-relaxed">{edu.description}</p> {/* Added description */}
              <p className="text-muted-foreground mt-3 text-sm">Result: {edu.grade}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
