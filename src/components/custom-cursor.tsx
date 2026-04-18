'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Continuous detection for hybrid devices
        const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
        const checkCapabilities = () => setIsHidden(!hoverMedia.matches);
        
        checkCapabilities();
        hoverMedia.addEventListener('change', checkCapabilities);

        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsHidden(false);
        };

        const onPointerOver = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .cursor-pointer')) {
                setIsHovering(true);
            }
        };

        const onPointerOut = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, textarea, [role="button"], .cursor-pointer')) {
                setIsHovering(false);
            }
        };

        const onMouseLeave = () => setIsHidden(true);

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerover', onPointerOver, { passive: true });
        window.addEventListener('pointerout', onPointerOut, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerover', onPointerOver);
            window.removeEventListener('pointerout', onPointerOut);
            document.removeEventListener('mouseleave', onMouseLeave);
            hoverMedia.removeEventListener('change', checkCapabilities);
        };
    }, [cursorX, cursorY]);

    if (isHidden) return null;

    return (
        <>
            {/* Outer ring */}
            <motion.div
                className="custom-cursor-ring"
                style={{
                    x: springX,
                    y: springY,
                }}
                animate={{
                    width: isHovering ? 48 : 32,
                    height: isHovering ? 48 : 32,
                    borderColor: isHovering ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                }}
                transition={{ duration: 0.2 }}
            />
            {/* Inner dot */}
            <motion.div
                className="custom-cursor-dot"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    width: isHovering ? 8 : 5,
                    height: isHovering ? 8 : 5,
                    backgroundColor: isHovering ? '#ffffff' : 'rgba(255,255,255,0.9)',
                }}
                transition={{ duration: 0.15 }}
            />
        </>
    );
};
