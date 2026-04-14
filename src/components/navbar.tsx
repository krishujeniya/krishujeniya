'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Expertise', href: '#expertise' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Documents', href: '#documents' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const sections = navLinks.map((link) => link.href.substring(1));
    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });

    // Escape key listener
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) observer.unobserve(el);
      });
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const id = href.substring(1);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Delay closing menu for better touch feedback/transition
      setTimeout(() => setIsMobileMenuOpen(false), 150);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  // Close mobile menu on outside click
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClick = () => setIsMobileMenuOpen(false);
      // Use setTimeout to avoid immediate closure from the menu button click
      const timer = setTimeout(() => {
        window.addEventListener('click', handleClick);
      }, 0);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleClick);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md md:backdrop-blur-[16px] border-white/10 py-3 shadow-md'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center max-w-7xl">
        <div /> {/* Invisible spacer to keep layout balanced if needed, or just remove branding */}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={cn(
                  'text-sm font-medium transition-all duration-200 hover:text-green-400 relative',
                  activeSection === link.href.substring(1) ? 'text-green-400' : 'text-zinc-400'
                )}
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <a
            href="https://contra.com/krish_ujeniya_0lyitk1s"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all text-white"
          >
            <span>Hire me on Contra</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white/90 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col py-4 px-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={cn(
                    'text-base font-medium transition-colors py-2 px-4 rounded-md',
                    activeSection === link.href.substring(1)
                      ? 'bg-white/10 text-green-400'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://contra.com/krish_ujeniya_0lyitk1s"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10"
              >
                <span>Hire me on Contra</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
