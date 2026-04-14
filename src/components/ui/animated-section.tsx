"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export const AnimatedSection = ({ children, className, delay = 0, id }: AnimatedSectionProps) => {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "20px" }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: delay,
            }}
            className={cn("w-full py-20 px-4 md:px-8 max-w-7xl mx-auto will-change-transform", className)}
        >
            {children}
        </motion.section>
    );
};
