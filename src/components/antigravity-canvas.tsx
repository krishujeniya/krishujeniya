'use client';

import { useEffect, useRef } from 'react';
import { AntigravityEngine } from '@/lib/motion/antigravity-engine';
import { AntigravityConfig } from '@/lib/motion/motion-config';

interface AntigravityCanvasProps {
  className?: string;
  config?: Partial<AntigravityConfig>;
}

export function AntigravityCanvas({ className = '', config }: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<AntigravityEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Accessibility and automation constraints
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isAutomated = Boolean(typeof navigator !== 'undefined' && (navigator as any).webdriver);

    const engine = new AntigravityEngine(config);
    engineRef.current = engine;
    engine.initialize(canvas);

    let isIntersecting = false;
    let cachedRect: DOMRect | null = null;

    const updateCachedBounds = () => {
      if (isIntersecting) {
        cachedRect = container.getBoundingClientRect();
      }
    };

    // Resize handling with ResizeObserver for exact responsive bounds (active even in static frame)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          engine.resize(width, height);
          if (motionMedia.matches || isAutomated) {
            engine.renderStaticFrame();
          }
        }
      }
      updateCachedBounds();
    });
    resizeObserver.observe(container);

    // Viewport intersection handling to pause when scrolled out of view and track visibility state
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
          engine.setIntersecting(isIntersecting);
          if (isIntersecting) {
            cachedRect = container.getBoundingClientRect();
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const syncMotion = () => {
      if (motionMedia.matches || isAutomated) {
        engine.pause();
        engine.renderStaticFrame();
      } else {
        engine.start();
        if (isIntersecting) {
          engine.resume();
        }
      }
    };
    syncMotion();
    motionMedia.addEventListener('change', syncMotion);

    // Localized pointer tracking: only measure bounds when active and intersecting
    const onPointerMove = (e: PointerEvent) => {
      if (!isIntersecting || !cachedRect) return;
      const isInside =
        e.clientX >= cachedRect.left &&
        e.clientX <= cachedRect.right &&
        e.clientY >= cachedRect.top &&
        e.clientY <= cachedRect.bottom;

      if (isInside) {
        engine.updatePointer(e.clientX, e.clientY, true);
      } else {
        engine.updatePointer(-9999, -9999, false);
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (!isIntersecting) return;
      if (!cachedRect) cachedRect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= cachedRect.left &&
        e.clientX <= cachedRect.right &&
        e.clientY >= cachedRect.top &&
        e.clientY <= cachedRect.bottom;

      if (isInside) {
        engine.updatePointer(e.clientX, e.clientY, true);
      }
    };

    const onPointerLeave = () => {
      engine.updatePointer(-9999, -9999, false);
    };

    const onScroll = () => {
      if (isIntersecting) {
        cachedRect = container.getBoundingClientRect();
        engine.refreshBounds();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerenter', onPointerEnter, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      motionMedia.removeEventListener('change', syncMotion);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerenter', onPointerEnter);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none block"
      />
    </div>
  );
}
