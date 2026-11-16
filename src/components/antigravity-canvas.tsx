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

    // Check accessibility and automation constraints
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isAutomated = typeof navigator !== 'undefined' && navigator.webdriver;

    const engine = new AntigravityEngine(config);
    engineRef.current = engine;
    engine.initialize(canvas);

    if (isReduced || isAutomated) {
      // Under reduced motion or automated test runners: render a calm static frame, no animation loop
      engine.renderStaticFrame();
      return () => {
        engine.destroy();
        engineRef.current = null;
      };
    }

    // Start fluid physics loop
    engine.start();

    // Resize handling with ResizeObserver for exact responsive bounds
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          engine.resize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Viewport intersection handling to pause when scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            engine.resume();
          } else {
            engine.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Localized pointer tracking: only activate when pointer is within this container
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        engine.updatePointer(e.clientX, e.clientY, true);
      } else {
        engine.updatePointer(-9999, -9999, false);
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        engine.updatePointer(e.clientX, e.clientY, true);
      }
    };

    const onPointerLeave = () => {
      engine.updatePointer(-9999, -9999, false);
    };

    const onScroll = () => {
      engine.refreshBounds();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerenter', onPointerEnter, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
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
