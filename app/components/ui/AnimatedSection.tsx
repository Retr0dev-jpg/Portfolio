'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type AnimatedSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  variant?: 'left' | 'right' | 'up';
  showTitle?: boolean;
  className?: string;
};

export default function AnimatedSection({ 
  id, 
  title, 
  children, 
  variant = 'up',
  showTitle = true,
  className = ''
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const variants = {
    hidden: {
      opacity: 0,
      x: variant === 'left' ? -50 : variant === 'right' ? 50 : 0,
      y: variant === 'up' ? 50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
        staggerChildren: 0.1,
      }
    }
  };

  return (
    <section 
      id={id}
      ref={ref}
      className={`container mx-auto px-4 py-20 md:py-32 ${className}`}
    >
      {showTitle && (
        <motion.h2 
          className="section-heading"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          {title}
        </motion.h2>
      )}

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        className="space-y-8"
      >
        <motion.div variants={contentVariants}>
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
} 