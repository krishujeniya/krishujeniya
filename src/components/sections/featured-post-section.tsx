import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card'; // Import cardHoverClasses
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, ThumbsUp, Rss } from 'lucide-react'; // Changed icon to Rss
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { cn } from '@/lib/utils'; // Import cn utility

export const FeaturedPostSection: FC = () => { // Renamed component
  return (
    <section id="insights" className="container mx-auto px-4"> {/* Updated ID */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-accent flex items-center justify-center gap-3">
         <Rss className="h-8 w-8" /> {/* Changed icon */}
        Featured Insight {/* Updated Title */}
      </h2>
      <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
         Explore technical explorations, industry perspectives, and insights from my journey in AI and Machine Learning. {/* Updated intro */}
      </p>
      <Card className={cn(
        "bg-card/80 border border-border shadow-xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row group", // Added group
        cardHoverClasses // Apply cardHoverClasses
      )}>
         {/* Placeholder for AI-generated image */}
         <div className="md:w-1/3 relative aspect-video md:aspect-auto">
             <Image
                src="https://github.com/krishujeniya/krishujeniya/blob/main/images/m1.png?raw=true" // Placeholder image URL
                alt="AI predicting salaries concept"
                fill
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-105 transition-transform duration-500"
                data-ai-hint="artificial intelligence data analysis graph"
             />
         </div>
         <div className="md:w-2/3 flex flex-col">
            <CardHeader>
              <CardDescription className="text-muted-foreground">June 13th, 2024 • Medium</CardDescription>
              <CardTitle className="text-2xl text-foreground mt-2 leading-snug">Predicting Salaries of Data Professions Using Machine Learning</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow"> {/* Added flex-grow */}
              <p className="text-foreground leading-relaxed">An exploration into building a machine learning model to accurately predict salaries based on factors like experience, job role, and performance metrics.</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
               <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /> 249 Claps</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> 308 Responses</span>
              </div>
              <Button variant="link" asChild className="text-accent hover:text-accent/80 focus:ring-accent">
                <Link href="https://medium.com/@KrishUjeniya/predicting-salaries-of-data-professions-using-machine-learning-e88b5f064a76" target="_blank" rel="noopener noreferrer">
                   <span className="inline-flex items-center">
                     Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                   </span>
                </Link>
              </Button>
            </CardFooter>
         </div>
      </Card>
    </section>
  );
};
