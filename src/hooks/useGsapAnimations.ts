'use client';

import { useEffect } from 'react';
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

  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAutomated = typeof navigator !== 'undefined' && navigator.webdriver;
  if (isReduced || isAutomated) {
    gsap.set(els, { opacity: 1, visibility: 'visible', clearProps: 'all' });
    return;
  }

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
  useEffect(() => {
    let context: gsap.Context | undefined;
    const refreshOnLoad = () => ScrollTrigger.refresh();

    // Give React one frame to finish painting before querying DOM
    const raf = requestAnimationFrame(() => {
      context = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add(
          {
            noMotion: '(prefers-reduced-motion: reduce)',
            motion: '(prefers-reduced-motion: no-preference)',
          },
          (ctx) => {
            const { noMotion } = (ctx as unknown as { conditions: { noMotion: boolean } }).conditions;
            const isReduced = noMotion || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
            const isAutomated = Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
            const skipMotion = isReduced || isAutomated;

            // ── Reduced motion or automated runner: make everything visible immediately ──
            if (skipMotion) {
              gsap.set('section, section *', { opacity: 1, visibility: 'visible', clearProps: 'transform,filter' });
              gsap.set(
                '.char-reveal, .word-reveal, .text-clip-inner, .blur-to-sharp, .scroll-heading-reveal, .headline-scale-reveal, .animated-counter',
                {
                  opacity: 1,
                  visibility: 'visible',
                  filter: 'none',
                  transform: 'none',
                  clearProps: 'all',
                }
              );
              return;
            }

            // ── 31. Character-by-character text entrance ──
            const charEls = gsap.utils.toArray<HTMLElement>('.char-reveal');
            if (charEls.length) {
              gsap.fromTo(
                charEls,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, stagger: 0.02, duration: 0.45, ease: 'power2.out', delay: 0.1 }
              );
            }

            // ── 32. Word-by-word staggered reveal ──
            const wordEls = gsap.utils.toArray<HTMLElement>('.word-reveal');
            if (wordEls.length) {
              gsap.fromTo(
                wordEls,
                { opacity: 0, y: '100%' },
                { opacity: 1, y: '0%', stagger: 0.035, duration: 0.6, ease: 'power3.out', delay: 0.3 }
              );
            }

            // ── 35. Text clipping and masking ──
            const clipInners = gsap.utils.toArray<HTMLElement>('.text-clip-mask .text-clip-inner');
            clipInners.forEach((ci) => {
              ScrollTrigger.create({
                trigger: ci,
                start: 'top 92%',
                once: true,
                onEnter: () => {
                  gsap.fromTo(ci, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.8, ease: 'power3.out' });
                },
              });
            });

            // ── 36. Headline scale transitions ──
            const scaleHeadlines = gsap.utils.toArray<HTMLElement>('.headline-scale-reveal');
            scaleHeadlines.forEach((hl) => {
              ScrollTrigger.create({
                trigger: hl,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                  gsap.fromTo(hl, { scale: 0.95 }, { scale: 1, duration: 0.85, ease: 'power2.out', clearProps: 'transform' });
                },
              });
            });

            // ── 37. Blur-to-sharp text entrance ──
            const blurEls = gsap.utils.toArray<HTMLElement>('.blur-to-sharp');
            blurEls.forEach((el) => {
              ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: () => {
                  gsap.fromTo(
                    el,
                    { filter: 'blur(10px)', opacity: 0 },
                    { filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power2.out', clearProps: 'filter' }
                  );
                },
              });
            });

            // ── 39. Scroll-triggered heading reveal ──
            const scrollHeadings = gsap.utils.toArray<HTMLElement>('.scroll-heading-reveal');
            scrollHeadings.forEach((sh) => {
              ScrollTrigger.create({
                trigger: sh,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                  gsap.fromTo(
                    sh,
                    { y: 35, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' }
                  );
                },
              });
            });

            // ── 41. Animated number counters ──
            const counterEls = gsap.utils.toArray<HTMLElement>('.animated-counter');
            counterEls.forEach((c) => {
              const target = parseFloat(c.getAttribute('data-target') || '0');
              const suffix = c.getAttribute('data-suffix') || '';
              const isDecimal = target % 1 !== 0;
              ScrollTrigger.create({
                trigger: c,
                start: 'top 92%',
                once: true,
                onEnter: () => {
                  const obj = { val: 0 };
                  gsap.to(obj, {
                    val: target,
                    duration: 1.4,
                    ease: 'power2.out',
                    onUpdate: () => {
                      c.textContent = (isDecimal ? obj.val.toFixed(1) : Math.round(obj.val).toString()) + suffix;
                    },
                    onComplete: () => {
                      c.textContent = (isDecimal ? target.toFixed(1) : target.toString()) + suffix;
                    },
                  });
                },
              });
            });

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

            // BrainCircuit box — gentle entrance and settling
            if (brainBox) {
              gsap.set(brainBox, { opacity: 0, scale: 0.7 });
              gsap.to(brainBox, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.15 });
              gsap.to(brainBox, {
                rotate: 10,
                scale: 1.05,
                duration: 1.2,
                repeat: 1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 0.95,
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
                    duration: 1.5,
                    repeat: 1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 1.0,
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
            revealOnScroll('#documents .grid > div', { scale: 0.96, y: 15, stagger: 0.05, start: 'top 95%', duration: 0.35 });
            revealOnScroll('#documents h2', { y: 30, stagger: 0, start: 'top 95%', duration: 0.4 });

            // ── 6. Testimonials ──
            revealOnScroll('#testimonials .grid > div', { y: 30, stagger: 0.07, start: 'top 95%', duration: 0.4 });
            revealOnScroll('#testimonials h2', { y: 30, stagger: 0, start: 'top 95%', duration: 0.4 });

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
          }
        );

        // Refresh after fonts / images load
        window.addEventListener('load', refreshOnLoad, { once: true });
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refreshOnLoad);
      context?.revert();
    };
  }, []);
}
