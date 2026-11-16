'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        // Continuous detection for hybrid devices
        const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
        const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsHidden(!hoverMedia.matches);

        if (!ringRef.current || !dotRef.current) return;

        const ring = ringRef.current;
        const dot = dotRef.current;

        // quickSetter for high-freq perf
        const setRingX = gsap.quickSetter(ring, 'x', 'px');
        const setRingY = gsap.quickSetter(ring, 'y', 'px');
        const setDotX = gsap.quickSetter(dot, 'x', 'px');
        const setDotY = gsap.quickSetter(dot, 'y', 'px');

        // Spring state for ring
        let ringX = -100, ringY = -100;
        let mouseX = -100, mouseY = -100;

        // Lerp ticker for ring (spring-like follow)
        const updateRing = () => {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
            ringX += dx * 0.18;
            ringY += dy * 0.18;
            setRingX(ringX);
            setRingY(ringY);
        };

        let tickerActive = false;
        const syncTicker = () => {
            const isAutomated = Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
            setIsHidden(!hoverMedia.matches || isAutomated);
            if (hoverMedia.matches && !motionMedia.matches && !isAutomated && !tickerActive) {
                gsap.ticker.add(updateRing);
                tickerActive = true;
            } else if ((!hoverMedia.matches || motionMedia.matches || isAutomated) && tickerActive) {
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
                    gsap.set(ring, { width: 48, height: 48, borderColor: 'rgba(255,255,255,0.8)' });
                    gsap.set(dot, { width: 8, height: 8, backgroundColor: '#ffffff' });
                } else {
                    gsap.to(ring, { width: 48, height: 48, borderColor: 'rgba(255,255,255,0.8)', duration: 0.2, ease: 'power2.out' });
                    gsap.to(dot, { width: 8, height: 8, backgroundColor: '#ffffff', duration: 0.15, ease: 'power2.out' });
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

        const onMouseLeave = () => setIsHidden(true);

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
