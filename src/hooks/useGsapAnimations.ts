'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Respect prefers-reduced-motion
    const mm = gsap.matchMedia();

    mm.add(
      {
        noMotion: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
      },
      (ctx) => {
        const { noMotion } = (ctx as unknown as { conditions: { noMotion: boolean; motion: boolean } }).conditions;
        if (noMotion) return;

        // ── 1. Section heading reveals (experience, documents, testimonials) ──
        const sectionHeadings = gsap.utils.toArray<HTMLElement>(
          '#experience h2, #documents h2, #testimonials h2'
        );
        sectionHeadings.forEach((el) => {
          gsap.from(el, {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        });

        // ── 2. Experience rows stagger ──
        const expRows = gsap.utils.toArray<HTMLElement>('#experience .space-y-12 > div');
        if (expRows.length) {
          gsap.from(expRows, {
            x: -40,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#experience .space-y-12',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 3. Service cards stagger from below ──
        const serviceCards = gsap.utils.toArray<HTMLElement>('#services .grid > div');
        if (serviceCards.length) {
          gsap.from(serviceCards, {
            y: 50,
            autoAlpha: 0,
            duration: 0.7,
            stagger: { each: 0.1, from: 'start' },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#services .grid',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 4. Project cards stagger ──
        const projectCards = gsap.utils.toArray<HTMLElement>('#projects .grid > div');
        if (projectCards.length) {
          ScrollTrigger.batch(projectCards, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) => {
              gsap.from(batch, {
                y: 40,
                autoAlpha: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power2.out',
                overwrite: true,
              });
            },
          });
        }

        // ── 5. Document folder cards ──
        const docCards = gsap.utils.toArray<HTMLElement>('#documents .grid > div');
        if (docCards.length) {
          gsap.from(docCards, {
            scale: 0.94,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: '#documents .grid',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 6. Testimonial cards ──
        const testimonialCards = gsap.utils.toArray<HTMLElement>('#testimonials .grid > div');
        if (testimonialCards.length) {
          gsap.from(testimonialCards, {
            y: 50,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#testimonials .grid',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 7. Contact section left column ──
        const contactLeft = document.querySelector('#contact .lg\\:col-span-6:first-child') as HTMLElement | null;
        if (contactLeft) {
          gsap.from(contactLeft, {
            x: -50,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#contact',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 8. Contact form ──
        const contactRight = document.querySelector('#contact .lg\\:col-span-6:last-child') as HTMLElement | null;
        if (contactRight) {
          gsap.from(contactRight, {
            x: 50,
            autoAlpha: 0,
            duration: 1,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#contact',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 9. About section image float ──
        const aboutImg = document.querySelector('#about .aspect-square') as HTMLElement | null;
        if (aboutImg) {
          gsap.from(aboutImg, {
            scale: 0.9,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: aboutImg,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          // Subtle continuous float
          gsap.to(aboutImg, {
            y: -12,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        // ── 10. About cards ──
        const aboutCards = gsap.utils.toArray<HTMLElement>('#about .grid.md\\:grid-cols-3 > div');
        if (aboutCards.length) {
          gsap.from(aboutCards, {
            y: 35,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#about .grid.md\\:grid-cols-3',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 11. Footer elements ──
        const footerBrand = document.querySelector('footer .text-2xl') as HTMLElement | null;
        if (footerBrand) {
          gsap.from(footerBrand, {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: 'footer',
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        }

        return () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);
}
