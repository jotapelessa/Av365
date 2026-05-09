'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useLayout } from '@/components/admin/LayoutContext';
export { DashboardGrid } from './DashboardGridContainer';



interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  noPadding?: boolean;
  auditId?: string;
  'data-audit'?: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as any,
      stiffness: 260,
      damping: 20
    }
  }
};

export function DashboardCard({ 
  children, 
  className = '', 
  span = 12, 
  noPadding = false, 
  auditId,
  ...props 
}: DashboardCardProps & HTMLMotionProps<"div">) {
  const { configs } = useLayout();
  
  const finalAuditId = auditId || props['data-audit'] as string || 'dashboard__generic-card';
  
  // Prioriza o span do banco de dados se existir
  const activeSpan = configs[finalAuditId]?.span || span;
  const activeOrder = configs[finalAuditId]?.order || 0;

  const colSpan: Record<number, string> = {
    1: 'lg:col-span-1 md:col-span-2',
    2: 'lg:col-span-2 md:col-span-3',
    3: 'lg:col-span-3 md:col-span-6',
    4: 'lg:col-span-4 md:col-span-6',
    6: 'lg:col-span-6 md:col-span-6',
    8: 'lg:col-span-8 md:col-span-12',
    12: 'lg:col-span-12 md:col-span-12'
  };

  const spanClass = colSpan[activeSpan] || 'lg:col-span-12';

  return (
    <motion.div 
      layout
      variants={itemVariants}
      data-audit={finalAuditId}
      style={{ order: activeOrder }}
      className={`${spanClass} min-w-0 bento-card-elite rounded-[18px] ${noPadding ? '!p-0' : ''} ${className} group/card relative`}
      {...props}
    >
      {/* Overlay de Orquestração (Apenas visível para Admin via CSS) */}
      <div className="absolute inset-0 rounded-[18px] border-2 border-transparent group-hover/card:border-indigo-500/30 transition-colors pointer-events-none z-10" />
      {children}
    </motion.div>
  );
}
