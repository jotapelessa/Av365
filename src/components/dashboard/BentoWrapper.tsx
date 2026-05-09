'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoWrapperProps {
  children: ReactNode;
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export function BentoContainer({ children, className }: BentoWrapperProps) {
  return (
    <motion.div
      variants={container as any}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BentoItem({ children, className }: BentoWrapperProps) {
  return (
    <motion.div
      variants={item as any}
      className={className}
    >
      {children}
    </motion.div>
  );
}
