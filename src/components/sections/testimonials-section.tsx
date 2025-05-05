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
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnLuNJk4aQW5e-fTxuGiuGSpFOyNto0IROnw&s',
    aiHint: 'professional headshot person',
  },
  {
    name: 'Khushi S.', // Updated Name
    role: 'Senior ML Engineer',
    quote: "Krish shows great promise in MLOps. His work on the salary prediction model during the internship was impressive.",
    avatar: 'data:image/jpeg;base64,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',
    aiHint: 'man smiling tech background',
  },
   {
    name: 'Rohan Y.', // Updated Name
    role: 'Flutter Developer',
    quote: "Working with Krish on the SnapText app was a fantastic experience. He's a skilled developer and a great team player.",
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxy_gUgsuglsLBrq_jE0BM8f2AyOHCN_d8sw&s',
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
