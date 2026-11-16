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

  if (typeof navigator !== 'undefined' && navigator.webdriver) {
    gsap.set(els, { opacity: 1, visibility: 'visible' });
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
            const skipMotion = noMotion || (typeof navigator !== 'undefined' && navigator.webdriver);

            // ── Reduced motion or automated runner: make everything visible immediately ──
            if (skipMotion) {
              gsap.set('section, section *', { opacity: 1, visibility: 'visible' });
              return;
            }

            // ── 0. Hero entrance ──
            const heroName = document.querySelector('#home .hero-name') as HTMLElement | null;
            const heroH1 = document.querySelector('#home h1') as HTMLElement | null;
            const heroButtons = document.querySelector('#home .hero-buttons, #home .pt-4') as HTMLElement | null;

            if (heroName || heroH1 || heroButtons) {
              const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
              if (heroName) {
                gsap.set(heroName, { opacity: 0, y: 20 });
                tl.to(heroName, { opacity: 1, y: 0, duration: 0.8 }, 0.05);
              }
              if (heroH1) {
                gsap.set(heroH1, { opacity: 0, y: 40 });
                tl.to(heroH1, { opacity: 1, y: 0, duration: 0.9 }, 0.15);
              }
              if (heroButtons) {
                gsap.set(heroButtons, { opacity: 0, y: 20 });
                tl.to(heroButtons, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
              }
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

            // ── 9. Footer Antigravity Liftoff & Floating Flow ──
            const footerContainer = document.querySelector('footer') as HTMLElement | null;
            const groundedLetters = gsap.utils.toArray<HTMLElement>('.footer-brand-title .footer-letter:not(.floating-letter)');
            const float1 = document.querySelector('.floating-letter-1') as HTMLElement | null;
            const float2 = document.querySelector('.floating-letter-2') as HTMLElement | null;
            const float3 = document.querySelector('.floating-letter-3') as HTMLElement | null;

            if (footerContainer && (groundedLetters.length || float1 || float2 || float3)) {
              if (skipMotion) {
                gsap.set(groundedLetters, { opacity: 1, y: 0 });
                if (float1) gsap.set(float1, { opacity: 1, y: -26, rotate: -2.5 });
                if (float2) gsap.set(float2, { opacity: 1, y: -68, rotate: -5.5 });
                if (float3) gsap.set(float3, { opacity: 1, y: -118, rotate: -9 });
              } else {
                gsap.set(groundedLetters, { opacity: 0.9, y: 0 });
                if (float1) gsap.set(float1, { opacity: 1, y: 0, rotate: 0 });
                if (float2) gsap.set(float2, { opacity: 1, y: 0, rotate: 0 });
                if (float3) gsap.set(float3, { opacity: 1, y: 0, rotate: 0 });

                let idleTweens: gsap.core.Tween[] = [];

                const killIdle = () => {
                  idleTweens.forEach((t) => t.kill());
                  idleTweens = [];
                };

                const startLiftoff = () => {
                  killIdle();
                  const isMobile = window.innerWidth < 768;
                  const lift1 = isMobile ? -20 : -28;
                  const lift2 = isMobile ? -50 : -72;
                  const lift3 = isMobile ? -92 : -124;

                  const bob1 = isMobile ? '-=8' : '-=12';
                  const bob2 = isMobile ? '-=14' : '-=18';
                  const bob3 = isMobile ? '-=20' : '-=26';

                  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

                  tl.fromTo(groundedLetters, { y: 20, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.02 }, 0);

                  if (float1) {
                    tl.to(float1, { y: lift1, rotate: -2.5, duration: 1.1, ease: 'power3.out' }, 0.1);
                  }
                  if (float2) {
                    tl.to(float2, { y: lift2, rotate: -5.5, duration: 1.3, ease: 'power3.out' }, 0.2);
                  }
                  if (float3) {
                    tl.to(float3, { y: lift3, rotate: -9, duration: 1.5, ease: 'power3.out' }, 0.3);
                  }

                  tl.add(() => {
                    if (float1) {
                      idleTweens.push(
                        gsap.to(float1, {
                          y: bob1,
                          rotate: '+=1.5',
                          duration: 2.2,
                          repeat: -1,
                          yoyo: true,
                          ease: 'sine.inOut',
                        })
                      );
                    }
                    if (float2) {
                      idleTweens.push(
                        gsap.to(float2, {
                          y: bob2,
                          rotate: '-=2',
                          duration: 2.7,
                          repeat: -1,
                          yoyo: true,
                          ease: 'sine.inOut',
                          delay: 0.2,
                        })
                      );
                    }
                    if (float3) {
                      idleTweens.push(
                        gsap.to(float3, {
                          y: bob3,
                          rotate: '-=3',
                          duration: 3.2,
                          repeat: -1,
                          yoyo: true,
                          ease: 'sine.inOut',
                          delay: 0.4,
                        })
                      );
                    }
                  });
                };

                const returnToRealPlace = () => {
                  killIdle();
                  // Animate smoothly back into grounded real place on the baseline!
                  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 0.65 } });
                  if (float1) tl.to(float1, { y: 0, rotate: 0 }, 0);
                  if (float2) tl.to(float2, { y: 0, rotate: 0 }, 0.05);
                  if (float3) tl.to(float3, { y: 0, rotate: 0 }, 0.1);
                };

                ScrollTrigger.create({
                  trigger: footerContainer,
                  start: 'top 85%',
                  end: 'bottom bottom',
                  onEnter: startLiftoff,
                  onEnterBack: startLiftoff,
                  onLeaveBack: returnToRealPlace,
                });
              }
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
