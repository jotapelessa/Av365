'use client';

import { DashboardCard } from './DashboardGrid';
import { useState, useEffect } from 'react';
import { 
  LucideIcon, 
  Egg, 
  TrendingUp, 
  Activity, 
  Bird, 
  DollarSign,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

const iconMap = {
  egg: Egg,
  trending: TrendingUp,
  activity: Activity,
  bird: Bird,
  dollar: DollarSign,
  alert: AlertTriangle,
  zap: Zap
};

type IconType = keyof typeof iconMap;

interface KPICardExpertProps {
  label: string;
  value: string | number;
  icon: IconType;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color: string;
  bg: string;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  data?: any[];
  dataKey?: string;
  auditId?: string;
}

export function KPICardExpert({ 
  label, 
  value, 
  icon, 
  trend, 
  trendType = 'neutral',
  color, 
  bg,
  span = 1,
  data = [],
  dataKey = 'value',
  auditId
}: KPICardExpertProps) {
  const Icon = iconMap[icon] || Activity;
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  const trendColor = {
    positive: 'text-emerald-500',
    negative: 'text-rose-500',
    neutral: 'text-slate-400'
  };

  const chartColors = {
    positive: '#10b981',
    negative: '#f43f5e',
    neutral: '#6366f1'
  };

  return (
    <DashboardCard 
      span={span} 
      auditId={auditId}
      className="bento-card-elite group overflow-hidden flex flex-col relative"
    >
      
      {/* Background Sparkline (Subtle) */}
      <div className="absolute inset-x-0 bottom-0 h-[48px] min-h-[48px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none overflow-hidden">
        {data && data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <AreaChart data={data}>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={chartColors[trendType]} 
                strokeWidth={2} 
                fill={chartColors[trendType]} 
                fillOpacity={0.1}
                animationDuration={1500}
                isAnimationActive={false} // Desativar animação em mobile/redimensionamento para evitar glitches
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-w-0">
        {/* Label Section */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none truncate pr-2">
            {label}
          </p>
          <div className={`p-2 rounded-[4px] bg-indigo-50/50 border border-indigo-100/50 shadow-sm ${color} flex-shrink-0`}>
            <Icon className="icon-fluid" />
          </div>
        </div>

        {/* Value Section */}
        <div className="mt-auto space-y-2 min-w-0">
          <h3 
            data-audit={`kpi-value-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-stat text-slate-900 tracking-tighter italic leading-none" 
            title={String(value)}
          >
            {value}
          </h3>
          
          {/* Trend Section (Arrow & Label) */}
          {trend && (
            <div className="flex items-center gap-1.5 leading-none">
               <span className={`text-xs font-black ${trendColor[trendType]}`}>
                  {trendType === 'positive' ? '↑' : trendType === 'negative' ? '↓' : '•'}
               </span>
               <span className={`text-[9px] font-black uppercase tracking-widest ${trendColor[trendType]}`}>
                  {trend}
               </span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Ghost Detail */}
      <div className="absolute -right-2 -top-2 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none">
         <Icon size={80} />
      </div>
    </DashboardCard>
  );
}
