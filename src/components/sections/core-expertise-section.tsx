
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card';
import { Bot, BrainCircuit, GitBranchPlus } from 'lucide-react'; // Updated icons
import { cn } from '@/lib/utils'; // Import cn utility

const coreServices = [
  {
    title: 'AI Agent Development',
    description: 'Building autonomous agents capable of complex reasoning, tool usage, and task execution to automate workflows.',
    icon: Bot,
  },
  {
    title: 'LLM Solutions & RAG Systems',
    description: 'Implementing and fine-tuning Large Language Models, including advanced Retrieval Augmented Generation for enhanced knowledge access.',
    icon: BrainCircuit,
  },
  {
    title: 'MLOps Pipeline Architecture',
    description: 'Designing and deploying robust, scalable MLOps pipelines using tools like ZenML and MLflow for efficient model lifecycle management.',
    icon: GitBranchPlus, // Icon representing pipelines/workflows
  },
];

// Renamed from ExpertisePulseSection to CoreExpertiseSection
export const CoreExpertiseSection: FC = () => {
  return (
    <section id="expertise" className="container mx-auto px-4"> {/* Updated ID */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Core AI Expertise</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          Leveraging cutting-edge AI to deliver tangible business value through specialized development and deployment services in AI Agents, LLMs, and MLOps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreServices.map((service, index) => (
            <Card key={`service-${index}`} className={cn(
              "bg-card/80 border border-border shadow-lg flex flex-col items-center text-center p-6 group transition-all duration-300 hover:shadow-accent/10",
              cardHoverClasses
            )}>
              <CardHeader className="p-0 mb-4">
                <service.icon className="h-12 w-12 text-accent mx-auto mb-3" strokeWidth={1.5} />
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                {/* Subtle hover effect or "Learn More" indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-xs text-accent font-medium">Discover Solutions &rarr;</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </section>
  );
};
