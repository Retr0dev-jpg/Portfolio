'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

type Direction = 'left' | 'right' | 'up';

interface AnimatedSectionProps {
  id: string;
  children: ReactNode;
  variant?: Direction;
  /** When false the section spans the full width instead of the centered container. */
  contained?: boolean;
  className?: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OFFSET: Record<Direction, { x: number; y: number }> = {
  left: { x: -50, y: 0 },
  right: { x: 50, y: 0 },
  up: { x: 0, y: 50 },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.6, staggerChildren: 0.1 } },
};

export default function AnimatedSection({
  id,
  children,
  variant = 'up',
  contained = true,
  className = '',
}: AnimatedSectionProps) {
  const wrapperVariants: Variants = {
    hidden: { opacity: 0, ...OFFSET[variant] },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
  };

  return (
    <motion.section
      id={id}
      className={`${contained ? 'container mx-auto' : 'w-full'} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={wrapperVariants} className="space-y-8">
        <motion.div variants={contentVariants}>{children}</motion.div>
      </motion.div>
    </motion.section>
  );
}
