import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, cardHoverClasses } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Removed clientLogos array

const testimonials = [
  {
    name: 'Yug P.', // Updated Name
    role: 'Project Manager',
    quote: "Krish delivered an amazing OCR app on time—highly recommend! His technical skills and communication were top-notch.",
    avatar: 'https://picsum.photos/seed/clientA/100/100',
    aiHint: 'professional headshot person',
  },
  {
    name: 'Khushi S.', // Updated Name
    role: 'Senior ML Engineer',
    quote: "Krish shows great promise in MLOps. His work on the salary prediction model during the internship was impressive.",
    avatar: 'https://picsum.photos/seed/mentorB/100/100',
    aiHint: 'man smiling tech background',
  },
   {
    name: 'Rohan Y.', // Updated Name
    role: 'Flutter Developer',
    quote: "Working with Krish on the SnapText app was a fantastic experience. He's a skilled developer and a great team player.",
    avatar: 'https://picsum.photos/seed/collabC/100/100',
    aiHint: 'woman software developer portrait',
  },
];

export const TestimonialsSection: FC = () => {
  return (
    <section id="testimonials" className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-accent">What People Say</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        Hear from clients and collaborators about their experience working with me on AI and software projects.
      </p>

      {/* Removed Client Logos Grid */}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className={cn(
            "bg-card/80 border border-border shadow-lg flex flex-col p-6",
            cardHoverClasses // Apply cardHoverClasses
          )}>
            <CardContent className="p-0 flex-grow mb-4">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 text-accent" fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-foreground leading-relaxed italic border-l-4 border-accent pl-4">
                "{testimonial.quote}"
              </blockquote>
            </CardContent>
            <CardHeader className="p-0 flex flex-row items-center gap-4 border-t border-border pt-4">
               <Avatar>
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint}/>
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden"> {/* Added overflow-hidden */}
                <CardTitle className="text-md font-semibold text-foreground truncate">{testimonial.name}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
