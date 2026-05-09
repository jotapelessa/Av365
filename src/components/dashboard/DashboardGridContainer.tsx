'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 12;
  stagger?: boolean;
  auditId?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export function DashboardGrid({ 
  children, 
  className = '', 
  cols = 12, 
  stagger = true,
  auditId 
}: DashboardGridProps) {
  const gridCols: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2 md:grid-cols-2',
    3: 'lg:grid-cols-3 md:grid-cols-2',
    4: 'lg:grid-cols-4 md:grid-cols-2',
    12: 'lg:grid-cols-12 md:grid-cols-6'
  };

  const colsClass = gridCols[cols] || 'lg:grid-cols-12';
  const finalAuditId = auditId || 'dashboard__grid';

  return (
    <motion.div 
      variants={stagger ? containerVariants : {}}
      initial="hidden"
      animate="visible"
      data-audit={finalAuditId}
      className={`grid grid-cols-1 ${colsClass} gap-[var(--gap-fluid)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
