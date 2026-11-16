'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        // Continuous detection for hybrid devices
        const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
        const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        const isAutomated = Boolean(typeof navigator !== 'undefined' && navigator.webdriver);

        if (!hoverMedia.matches || isAutomated) {
            setIsHidden(true);
            return;
        }

        if (!ringRef.current || !dotRef.current) return;

        const ring = ringRef.current;
        const dot = dotRef.current;

        // Keep ring and dot centered on pointer coordinates when using quickSetter
        gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

        // quickSetter for high-freq perf
        const setRingX = gsap.quickSetter(ring, 'x', 'px');
        const setRingY = gsap.quickSetter(ring, 'y', 'px');
        const setDotX = gsap.quickSetter(dot, 'x', 'px');
        const setDotY = gsap.quickSetter(dot, 'y', 'px');

        // Spring state for ring
        let ringX = 0, ringY = 0;
        let mouseX = 0, mouseY = 0;
        let isFirstMove = true;

        // Lerp ticker for ring (fluid, snappy follow)
        const updateRing = () => {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
            ringX += dx * 0.35;
            ringY += dy * 0.35;
            setRingX(ringX);
            setRingY(ringY);
        };

        let tickerActive = false;
        const syncTicker = () => {
            const automated = Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
            if (!hoverMedia.matches || automated) {
                setIsHidden(true);
                if (tickerActive) {
                    gsap.ticker.remove(updateRing);
                    tickerActive = false;
                }
                return;
            }

            if (!motionMedia.matches && !tickerActive) {
                gsap.ticker.add(updateRing);
                tickerActive = true;
            } else if (motionMedia.matches && tickerActive) {
                gsap.ticker.remove(updateRing);
                tickerActive = false;
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!hoverMedia.matches || e.pointerType === 'touch') return;
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            setDotX(e.clientX);
            setDotY(e.clientY);

            // First contact or recovery: snap ring immediately to cursor to prevent flying from (-100, -100)
            if (isFirstMove) {
                ringX = e.clientX;
                ringY = e.clientY;
                setRingX(e.clientX);
                setRingY(e.clientY);
                isFirstMove = false;
            }

            if (motionMedia.matches) {
                setRingX(e.clientX);
                setRingY(e.clientY);
                ringX = e.clientX;
                ringY = e.clientY;
            }
            setIsHidden(false);
        };

        const onPointerOver = (e: PointerEvent) => {
            if (!hoverMedia.matches || e.pointerType === 'touch') return;
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .cursor-pointer')) {
                if (motionMedia.matches) {
                    gsap.set(ring, { width: 44, height: 44, borderColor: 'rgba(255,255,255,0.8)' });
                    gsap.set(dot, { width: 7, height: 7, backgroundColor: '#ffffff' });
                } else {
                    gsap.to(ring, { width: 44, height: 44, borderColor: 'rgba(255,255,255,0.8)', duration: 0.2, ease: 'power2.out' });
                    gsap.to(dot, { width: 7, height: 7, backgroundColor: '#ffffff', duration: 0.15, ease: 'power2.out' });
                }
            }
        };

        const onPointerOut = (e: PointerEvent) => {
            if (!hoverMedia.matches || e.pointerType === 'touch') return;
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .cursor-pointer')) {
                if (motionMedia.matches) {
                    gsap.set(ring, { width: 32, height: 32, borderColor: 'rgba(255,255,255,0.4)' });
                    gsap.set(dot, { width: 5, height: 5, backgroundColor: 'rgba(255,255,255,0.9)' });
                } else {
                    gsap.to(ring, { width: 32, height: 32, borderColor: 'rgba(255,255,255,0.4)', duration: 0.2, ease: 'power2.out' });
                    gsap.to(dot, { width: 5, height: 5, backgroundColor: 'rgba(255,255,255,0.9)', duration: 0.15, ease: 'power2.out' });
                }
            }
        };

        const onMouseLeave = () => {
            setIsHidden(true);
            isFirstMove = true;
        };

        syncTicker();
        hoverMedia.addEventListener('change', syncTicker);
        motionMedia.addEventListener('change', syncTicker);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerover', onPointerOver, { passive: true });
        window.addEventListener('pointerout', onPointerOut, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            if (tickerActive) gsap.ticker.remove(updateRing);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerover', onPointerOver);
            window.removeEventListener('pointerout', onPointerOut);
            document.removeEventListener('mouseleave', onMouseLeave);
            hoverMedia.removeEventListener('change', syncTicker);
            motionMedia.removeEventListener('change', syncTicker);
        };
    }, []);

    return (
        <>
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="custom-cursor-ring"
                aria-hidden="true"
                style={{ width: 32, height: 32, borderColor: 'rgba(255,255,255,0.4)', visibility: isHidden ? 'hidden' : 'visible' }}
            />
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="custom-cursor-dot"
                aria-hidden="true"
                style={{ width: 5, height: 5, backgroundColor: 'rgba(255,255,255,0.9)', visibility: isHidden ? 'hidden' : 'visible' }}
            />
        </>
    );
};
