'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Helper: animate a set of elements in from below, once they enter the viewport.
 *  Falls back to visible immediately if no elements found (prevents permanent hide). */
function revealOnScroll(
  selector: string,
  opts: {
    y?: number;
    x?: number;
    scale?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    delay?: number;
  } = {}
) {
  const els = gsap.utils.toArray<HTMLElement>(selector);
  if (!els.length) return;

  const {
    y = 40,
    x = 0,
    scale = 1,
    stagger = 0.1,
    duration = 0.75,
    start = 'top 88%',
    delay = 0,
  } = opts;

  // Set initial state in CSS — safer than autoAlpha which can leave things hidden
  gsap.set(els, { opacity: 0, y, x, scale });

  els.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay: delay + i * stagger,
          ease: 'power3.out',
          clearProps: 'transform', // release after done for perf
        });
      },
    });
  });
}

export function useGsapAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Give React one frame to finish painting before querying DOM
    const raf = requestAnimationFrame(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          noMotion: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { noMotion } = (ctx as unknown as { conditions: { noMotion: boolean } }).conditions;

          // ── Reduced motion: make everything visible immediately ──
          if (noMotion) {
            gsap.set('section, section *', { opacity: 1, visibility: 'visible' });
            return;
          }

          // ── 0. Hero entrance ──
          const heroH1 = document.querySelector('#home h1') as HTMLElement | null;
          const heroP = document.querySelector('#home p') as HTMLElement | null;
          const heroButtons = document.querySelector('#home .pt-4') as HTMLElement | null;
          const brainBox = document.querySelector('#home .hidden.md\\:flex') as HTMLElement | null;

          if (heroH1 || heroP || heroButtons) {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            if (heroH1) {
              gsap.set(heroH1, { opacity: 0, y: 40 });
              tl.to(heroH1, { opacity: 1, y: 0, duration: 0.9 }, 0.1);
            }
            if (heroP) {
              gsap.set(heroP, { opacity: 0, y: 25 });
              tl.to(heroP, { opacity: 1, y: 0, duration: 0.8 }, 0.25);
            }
            if (heroButtons) {
              gsap.set(heroButtons, { opacity: 0, y: 20 });
              tl.to(heroButtons, { opacity: 1, y: 0, duration: 0.7 }, 0.4);
            }
          }

          // BrainCircuit box — gentle continuous wobble
          if (brainBox) {
            gsap.set(brainBox, { opacity: 0, scale: 0.7 });
            gsap.to(brainBox, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.15 });
            gsap.to(brainBox, {
              rotate: 10,
              scale: 1.08,
              duration: 2.5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 1,
            });
          }

          // ── 1. About section ──
          const aboutImg = document.querySelector('#about .aspect-square') as HTMLElement | null;
          if (aboutImg) {
            gsap.set(aboutImg, { opacity: 0, scale: 0.9 });
            ScrollTrigger.create({
              trigger: aboutImg,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                gsap.to(aboutImg, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
                // Float after entrance
                gsap.to(aboutImg, {
                  y: -12,
                  duration: 3,
                  repeat: -1,
                  yoyo: true,
                  ease: 'sine.inOut',
                  delay: 1.1,
                });
              },
            });
          }

          revealOnScroll('#about .grid.md\\:grid-cols-3 > div', { y: 35, stagger: 0.1, start: 'top 85%' });

          // ── 2. Experience rows ──
          revealOnScroll('#experience .space-y-12 > div', { x: -40, y: 0, stagger: 0.12, start: 'top 82%', duration: 0.85 });

          // ── 3. Services cards ──
          revealOnScroll('#services .grid > div', { y: 55, stagger: 0.12, start: 'top 85%', duration: 0.8 });
          // Also reveal section heading
          revealOnScroll('#services h2', { y: 50, stagger: 0, start: 'top 88%' });

          // ── 4. Projects grid ──
          revealOnScroll('#projects .grid > div', { y: 40, stagger: 0.08, start: 'top 88%', duration: 0.65 });

          // ── 5. Documents / Resources ──
          revealOnScroll('#documents .grid > div', { scale: 0.94, y: 20, stagger: 0.1, start: 'top 85%', duration: 0.65 });
          revealOnScroll('#documents h2', { y: 50, stagger: 0, start: 'top 88%' });

          // ── 6. Testimonials ──
          revealOnScroll('#testimonials .grid > div', { y: 55, stagger: 0.15, start: 'top 85%', duration: 0.75 });
          revealOnScroll('#testimonials h2', { y: 50, stagger: 0, start: 'top 88%' });

          // ── 7. Contact ──
          const contactLeft = document.querySelector('#contact .lg\\:col-span-6:first-child') as HTMLElement | null;
          const contactRight = document.querySelector('#contact .lg\\:col-span-6:last-child') as HTMLElement | null;
          if (contactLeft) {
            gsap.set(contactLeft, { opacity: 0, x: -50 });
            ScrollTrigger.create({
              trigger: '#contact',
              start: 'top 80%',
              once: true,
              onEnter: () => gsap.to(contactLeft, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }),
            });
          }
          if (contactRight) {
            gsap.set(contactRight, { opacity: 0, x: 50 });
            ScrollTrigger.create({
              trigger: '#contact',
              start: 'top 80%',
              once: true,
              onEnter: () => gsap.to(contactRight, { opacity: 1, x: 0, duration: 1, delay: 0.15, ease: 'power3.out' }),
            });
          }

          // ── 8. Section headings (experience) ──
          revealOnScroll('#experience h2', { y: 60, stagger: 0, start: 'top 88%', duration: 1 });

          // ── 9. Footer ──
          const footerBrand = document.querySelector('footer .text-2xl') as HTMLElement | null;
          if (footerBrand) {
            gsap.set(footerBrand, { opacity: 0, y: 20 });
            ScrollTrigger.create({
              trigger: 'footer',
              start: 'top 92%',
              once: true,
              onEnter: () => gsap.to(footerBrand, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }),
            });
          }

          return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
          };
        }
      );

      // Refresh after fonts / images load
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
