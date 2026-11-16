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
            const nameBanner = document.querySelector('.footer-brand-title') as HTMLElement | null;
            const groundedLetters = gsap.utils.toArray<HTMLElement>('.footer-brand-title .footer-letter:not(.floating-letter)');
            const float1 = document.querySelector('.floating-letter-1') as HTMLElement | null;
            const float2 = document.querySelector('.floating-letter-2') as HTMLElement | null;
            const float3 = document.querySelector('.floating-letter-3') as HTMLElement | null;

            if ((footerContainer || nameBanner) && (groundedLetters.length || float1 || float2 || float3)) {
              if (skipMotion) {
                gsap.set(groundedLetters, { opacity: 1, yPercent: 0, y: 0 });
                if (float1) gsap.set(float1, { opacity: 1, yPercent: -20, rotate: -2 });
                if (float2) gsap.set(float2, { opacity: 1, yPercent: -45, rotate: -5 });
                if (float3) gsap.set(float3, { opacity: 1, yPercent: -75, rotate: -8 });
              } else {
                // Rock-solid visibility: never flicker or blink grounded letters
                gsap.set(groundedLetters, { opacity: 1, yPercent: 0, y: 0 });
                if (float1) gsap.set(float1, { opacity: 1, yPercent: 0, rotate: 0 });
                if (float2) gsap.set(float2, { opacity: 1, yPercent: 0, rotate: 0 });
                if (float3) gsap.set(float3, { opacity: 1, yPercent: 0, rotate: 0 });

                let activeTimeline: gsap.core.Timeline | null = null;
                let idleTweens: gsap.core.Tween[] = [];

                const killAllMotion = () => {
                  if (activeTimeline) {
                    activeTimeline.kill();
                    activeTimeline = null;
                  }
                  idleTweens.forEach((t) => t.kill());
                  idleTweens = [];
                  if (float1) gsap.killTweensOf(float1);
                  if (float2) gsap.killTweensOf(float2);
                  if (float3) gsap.killTweensOf(float3);
                };

                const startLiftoff = () => {
                  killAllMotion();

                  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                  activeTimeline = tl;

                  // Grounded letters stay completely static with no blinking or opacity jumps
                  if (float1) {
                    tl.to(float1, { yPercent: -20, rotate: -2, duration: 1.0 }, 0.05);
                  }
                  if (float2) {
                    tl.to(float2, { yPercent: -45, rotate: -5, duration: 1.2 }, 0.12);
                  }
                  if (float3) {
                    tl.to(float3, { yPercent: -75, rotate: -8, duration: 1.4 }, 0.2);
                  }

                  tl.add(() => {
                    activeTimeline = null;
                    if (float1) {
                      idleTweens.push(
                        gsap.to(float1, {
                          yPercent: -28,
                          rotate: -1,
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
                          yPercent: -55,
                          rotate: -6.5,
                          duration: 2.7,
                          repeat: -1,
                          yoyo: true,
                          ease: 'sine.inOut',
                          delay: 0.15,
                        })
                      );
                    }
                    if (float3) {
                      idleTweens.push(
                        gsap.to(float3, {
                          yPercent: -88,
                          rotate: -9.5,
                          duration: 3.2,
                          repeat: -1,
                          yoyo: true,
                          ease: 'sine.inOut',
                          delay: 0.3,
                        })
                      );
                    }
                  });
                };

                const returnToRealPlace = () => {
                  killAllMotion();
                  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 0.6 } });
                  activeTimeline = tl;
                  if (float1) tl.to(float1, { yPercent: 0, rotate: 0 }, 0);
                  if (float2) tl.to(float2, { yPercent: 0, rotate: 0 }, 0.04);
                  if (float3) tl.to(float3, { yPercent: 0, rotate: 0 }, 0.08);
                };

                // Trigger animation when the viewport bottom edge crosses the vertical center (half) of the name banner
                const triggerTarget = nameBanner || footerContainer;
                ScrollTrigger.create({
                  trigger: triggerTarget,
                  start: 'center bottom',
                  end: 'bottom top',
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
