'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const hasTouchRef = useRef(false);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Detect touch device
        const detectTouch = () => {
            hasTouchRef.current = true;
            setIsHidden(true);
        };
        window.addEventListener('touchstart', detectTouch, { once: true });

        const onMouseMove = (e: MouseEvent) => {
            if (hasTouchRef.current) return;
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const onMouseEnterInteractive = () => setIsHovering(true);
        const onMouseLeaveInteractive = () => setIsHovering(false);
        const onMouseLeaveWindow = () => setIsHidden(true);
        const onMouseEnterWindow = () => {
            if (!hasTouchRef.current) setIsHidden(false);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeaveWindow);
        document.addEventListener('mouseenter', onMouseEnterWindow);

        // Add hover detection for interactive elements
        const interactiveSelectors = 'a, button, input, textarea, [role="button"], .magnetic-btn';
        const interactiveElements = document.querySelectorAll(interactiveSelectors);
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnterInteractive);
            el.addEventListener('mouseleave', onMouseLeaveInteractive);
        });

        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll(interactiveSelectors);
            newElements.forEach((el) => {
                el.addEventListener('mouseenter', onMouseEnterInteractive);
                el.addEventListener('mouseleave', onMouseLeaveInteractive);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeaveWindow);
            document.removeEventListener('mouseenter', onMouseEnterWindow);
            window.removeEventListener('touchstart', detectTouch);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnterInteractive);
                el.removeEventListener('mouseleave', onMouseLeaveInteractive);
            });
            observer.disconnect();
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
