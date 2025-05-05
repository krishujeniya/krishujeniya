import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card'; // Import cardHoverClasses
import { Sparkles } from 'lucide-react'; // Icon for passion/innovation

export const AboutSection: FC = () => {
  return (
    <section id="about" className="container mx-auto px-4">
      <Card className={cn("bg-card/80 border border-border shadow-lg overflow-hidden", cardHoverClasses)}> {/* Apply cardHoverClasses */}
        <CardHeader>
          <CardTitle className="text-accent text-center md:text-left text-3xl md:text-4xl flex items-center gap-3 justify-center md:justify-start">
             <Sparkles className="h-8 w-8" /> About Me
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6"> {/* Simplified to single column */}
          {/* Engaging Bio */}
          <div>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              Hi, I’m Krish Ujeniya! I thrive on transforming complex AI challenges into practical, high-impact solutions. My journey into freelancing began with a passion for applying Machine Learning to real-world problems—from building predictive salary models with robust MLOps pipelines to developing user-friendly mobile apps like SnapText OCR.
            </p>
             <p className="text-lg text-foreground leading-relaxed mb-4">
               My core focus is architecting and deploying intelligent systems. I specialize in leveraging Large Language Models (LLMs), developing autonomous AI Agents, implementing advanced Retrieval Augmented Generation (RAG) systems, and constructing scalable MLOps architectures using tools like ZenML and MLflow.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Beyond the code, I'm deeply involved in the open-source community, contributing to AI advancements and sharing insights through projects and articles. I love exploring new frontiers, from Computer Vision and NLP to the potential of "vibe coding" with AI. Let's collaborate and build the future, intelligently!
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
