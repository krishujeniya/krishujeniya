import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Layers } from 'lucide-react'; // Layers icon is imported but will be removed from use
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Updated projects array with focus on AI/ML projects first and removed Stock Trading project
const projects = [
  {
    title: 'Salary Predictions For Data Professions',
    category: 'Machine Learning / MLOps',
    imageUrl: 'https://github.com/krishujeniya/krishujeniya/blob/main/images/m1.png?raw=true',
    description: 'Engineered an ML pipeline using ZenML to predict data professional salaries, enabling data-driven compensation strategies.',
    link: 'https://huggingface.co/spaces/krishujeniya/Salary_Predictions_For_Data_Professions',
    aiHint: 'data science dashboard graph salary',
    techStack: ['Python', 'ZenML', 'Scikit-learn', 'MLflow'],
  },
  {
    title: 'Face Lock Desktop App',
    category: 'Python / Computer Vision / GUI',
    imageUrl: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER/raw/main/logo.png',
    description: 'Created a desktop application using Tkinter and face recognition technology to secure access via facial identification.',
    link: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER',
    aiHint: 'face recognition security software interface',
    techStack: ['Python', 'Tkinter', 'OpenCV', 'face_recognition'],
  },
  {
    title: 'SnapText - OCR App',
    category: 'Flutter / Computer Vision',
    imageUrl: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER/raw/main/assets/Screenshot%20from%202024-06-17%2011-33-12.png',
    description: 'Built a Flutter-based Optical Character Recognition (OCR) app for easy text extraction from images on mobile devices.',
    link: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER',
    aiHint: 'mobile app document scanner ocr',
    techStack: ['Flutter', 'Dart', 'ML Kit (Vision)'],
  },
  {
    title: 'Fitness Tracker ML Analysis',
    category: 'Machine Learning / Data Analysis',
    imageUrl: 'https://storage.googleapis.com/kaggle-datasets-images/5817988/9548984/ffc2841e628ea82c25a8b08b56b873ff/dataset-cover.png?t=2024-10-04-18-47-18',
    description: 'Analyzed fitness data using machine learning techniques in a Jupyter Notebook to uncover patterns and insights.',
    link: 'https://github.com/krishujeniya/Fitness-Tracker-ML',
    aiHint: 'fitness data dashboard chart',
     techStack: ['Python', 'Jupyter', 'Pandas', 'Matplotlib'],
  },
  {
    title: 'EchoNest - Social Media App',
    category: 'Flutter Mobile App',
    imageUrl: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App/raw/main/assets/iw.png',
    description: 'Developed a cross-platform social media application using Flutter, focusing on real-time features and user engagement.',
    link: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App',
    aiHint: 'mobile app social media interface chat',
    techStack: ['Flutter', 'Dart', 'Firebase'],
  },
  {
    title: 'All-In-One Discord Bot',
    category: 'JavaScript / Bot Development',
    imageUrl: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS/raw/main/docs/.gitbook/assets/strange.png',
    description: 'Developed a multi-functional Discord bot using JavaScript, enhancing server interaction and management capabilities.',
    link: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS',
    aiHint: 'discord bot interface code',
    techStack: ['JavaScript', 'Node.js', 'Discord.js'],
  },
  {
    title: 'Coursly - E-learning platform',
    category: 'PHP / Web Development',
    imageUrl: 'https://github.com/krishujeniya/krishujeniya/blob/main/images/coursly11.png?raw=true',
    description: 'Built a robust e-learning platform with PHP, enabling delivery of online courses effectively and user management.',
    link: 'https://bit.ly/Coursly',
    aiHint: 'elearning website student dashboard online course',
    techStack: ['PHP', 'MySQL', 'HTML', 'CSS'],
  },
];


export const ProjectsSection: FC = () => {
  return (
    <section id="projects" className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-accent">Featured AI Projects</h2> {/* Updated Title */}
       <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        Explore practical applications of AI and Machine Learning, from MLOps pipelines to computer vision and full-stack solutions. Each project demonstrates innovative problem-solving and technical expertise.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {projects.map((project, index) => (
          <Card key={index} className={cn(
            "bg-card/80 border border-border shadow-lg overflow-hidden flex flex-col group/card",
            cardHoverClasses // Apply consistent hover effect
          )}>
            <CardHeader className="p-0 relative">
              <div className="aspect-video relative overflow-hidden group">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={project.aiHint}
                  priority={index < 4} // Prioritize loading images above the fold
                />
                 {/* Removed Case Study overlay */}
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 flex-grow">
              <CardTitle className="text-lg md:text-xl text-foreground mb-2 leading-snug">{project.title}</CardTitle>
              <CardDescription className="text-xs md:text-sm text-accent font-medium mb-3">{project.category}</CardDescription>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
               <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-border/20">
                 {/* Removed Layers icon */}
                 {project.techStack.map((tech) => (
                   <Badge key={tech} variant="secondary" className="text-xs font-normal">{tech}</Badge>
                 ))}
               </div>
            </CardContent>
            <CardFooter className="p-4 md:p-6 pt-0">
              <Button variant="outline" asChild className="w-full hover:bg-accent hover:text-accent-foreground focus:ring-accent group/link">
                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                   <span className="inline-flex items-center">
                     View Details <ExternalLink className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                   </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
