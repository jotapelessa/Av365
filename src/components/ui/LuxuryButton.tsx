'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  ArrowRight, 
  Search, 
  Download,
  FileText,
  ArrowRightLeft,
  PencilLine,
  Bird,
  Trash2,
  Save,
  Building2,
  Sparkles,
  PackageCheck,
  UserPlus,
  RefreshCw,
  LucideIcon 
} from 'lucide-react';
import Link from 'next/link';

const ICON_MAP: Record<string, LucideIcon> = {
  'plus': Plus,
  'filter': Filter,
  'arrow-right': ArrowRight,
  'search': Search,
  'download': Download,
  'file-text': FileText,
  'arrow-left-right': ArrowRightLeft,
  'pencil': PencilLine,
  'bird': Bird,
  'trash': Trash2,
  'save': Save,
  'building': Building2,
  'sparkles': Sparkles,
  'package-check': PackageCheck,
  'user-plus': UserPlus,
  'refresh-cw': RefreshCw
};

interface LuxuryButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: 'plus' | 'filter' | 'arrow-right' | 'search' | 'download' | 'file-text' | 'arrow-left-right' | 'pencil' | 'bird' | 'trash' | 'save' | 'building' | 'sparkles' | 'package-check' | 'user-plus' | 'refresh-cw' | LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  href?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  href,
  className = '',
  ...props
}) => {
  const Icon = typeof icon === 'string' ? ICON_MAP[icon] : icon;

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 border border-indigo-500/20',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 border border-slate-800/20',
    outline: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm',
    ghost: 'bg-transparent text-slate-500 hover:bg-indigo-50 hover:text-indigo-600',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white shadow-sm',
  };

  const sizes = {
    sm: 'h-10 px-4 text-[9px]',
    md: 'h-12 px-6 text-[10px]',
    lg: 'h-14 px-8 text-[11px]',
    xl: 'h-16 px-10 text-[12px]',
  };

  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl italic';

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <span className="flex items-center gap-2">
      {isLoading ? (
        <>
          Sincronizando...
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="contents">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={buttonClasses}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      disabled={isLoading || (props as any).disabled}
      {...props as any}
    >
      {content}
    </motion.button>
  );
};
