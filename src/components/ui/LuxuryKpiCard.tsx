'use client';

import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Receipt,
  Filter,
  Plus,
  ArrowRight,
  AlertTriangle,
  Package,
  History,
  LucideIcon 
} from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, LucideIcon> = {
  'dollar': DollarSign,
  'trending-up': TrendingUp,
  'shopping-bag': ShoppingBag,
  'receipt': Receipt,
  'filter': Filter,
  'plus': Plus,
  'arrow-right': ArrowRight,
  'alert-triangle': AlertTriangle,
  'package': Package,
  'history': History
};

interface LuxuryKpiCardProps {
  title: string;
  value: string;
  description?: string;
  icon: 'dollar' | 'trending-up' | 'shopping-bag' | 'receipt' | 'filter' | 'plus' | 'arrow-right' | 'alert-triangle' | 'package' | 'history';
  trend?: string | {
    value: string;
    label: string;
    isNegative?: boolean;
  };
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function LuxuryKpiCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'primary',
  className = ""
}: LuxuryKpiCardProps) {
  const Icon = ICON_MAP[icon] || DollarSign;

  const renderTrend = () => {
    if (!trend) return null;
    
    if (typeof trend === 'string') {
      const isNegative = trend.startsWith('-');
      return (
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
          isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {trend}
        </div>
      );
    }

    return (
      <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
        trend.isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {trend.value} <span className="opacity-50 ml-1 uppercase">{trend.label}</span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 border rounded-[6px] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group ${
        variant === 'primary' ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200'
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-md flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${
          variant === 'primary' 
            ? 'bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600' 
            : 'bg-white text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
        }`}>
          <Icon size={22} />
        </div>
        {renderTrend()}
      </div>

      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        {description && (
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
