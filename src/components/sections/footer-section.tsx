'use client'; // Add 'use client' directive

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Send, Youtube, Twitter, Calendar } from 'lucide-react'; // Keep Calendar icon import for now, or remove if unused elsewhere
import Link from 'next/link';

const socialLinks = [
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@ai-drago' },
  { name: 'X (Twitter)', icon: Twitter, url: 'https://twitter.com/krishujeniya' }, // Using Twitter icon for X
  { name: 'Telegram', icon: Send, url: 'https://t.me/krishujeniya' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/krishujeniya' },
  { name: 'GitHub', icon: Github, url: 'https://github.com/krishujeniya' },
];


export const FooterSection: FC = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer id="contact" className="py-16 mt-20 border-t border-border bg-card/80"> {/* Adjusted background */}
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-accent mb-6">Let's Build Something Intelligent</h3> {/* Updated title */}
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Ready to discuss your AI project or need an MLOps consultation? Reach out via email.
        </p>

        {/* Email Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
           <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link href="mailto:ukideashare0021@gmail.com">
                 <Mail className="mr-2 h-5 w-5" /> Email Me
              </Link>
            </Button>
             {/* Removed Schedule a Call button */}
        </div>

        {/* Social Links */}
         <p className="text-muted-foreground mb-6">Connect on social media:</p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="outline" size="icon" asChild className="border-accent/50 hover:bg-accent hover:text-accent-foreground transition-colors duration-300 focus:ring-accent tooltip-container">
               <Link href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                 <span className="inline-flex items-center justify-center">
                    <link.icon />
                    <span className="tooltip-text bg-popover text-popover-foreground text-xs rounded py-1 px-2 absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-300 pointer-events-none">
                        {link.name}
                    </span>
                 </span>
              </Link>
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Proudly building open-source AI tools since 2022. {/* Microcopy */}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          © {currentYear} Krish Ujeniya. All Rights Reserved.
        </p>
      </div>
       <style jsx>{`
        .tooltip-container:hover .tooltip-text {
          opacity: 1;
        }
      `}</style>
    </footer>
  );
};
