'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Egg, CalendarDays, TrendingUp, Zap } from 'lucide-react';

interface FlockVitalStatsHubProps {
  stats: {
    daily: number;
    weekly: number;
    monthly: number;
    effectiveness: number;
    flockQuantity: number;
  };
}

export function FlockVitalStatsHub({ stats }: FlockVitalStatsHubProps) {
  const cards = [
    {
      label: 'Produção Hoje',
      value: stats.daily.toLocaleString('pt-BR'),
      subValue: 'Ovos coletados',
      icon: <Zap size={20} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'Volume Semanal',
      value: stats.weekly.toLocaleString('pt-BR'),
      subValue: 'Últimos 7 dias',
      icon: <CalendarDays size={20} />,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      label: 'Acumulado Mensal',
      value: stats.monthly.toLocaleString('pt-BR'),
      subValue: 'Ciclo 30 dias',
      icon: <Egg size={20} />,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-100',
    },
    {
      label: 'Eficácia vs. Linhagem',
      value: `${stats.effectiveness.toFixed(1)}%`,
      subValue: stats.effectiveness >= 95 ? 'Performance Elite' : 'Abaixo do padrão',
      icon: <TrendingUp size={20} />,
      color: stats.effectiveness >= 95 ? 'text-emerald-600' : 'text-rose-600',
      bg: stats.effectiveness >= 95 ? 'bg-emerald-50' : 'bg-rose-50',
      border: stats.effectiveness >= 95 ? 'border-emerald-100' : 'border-rose-100',
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card, idx) => (
        <motion.div 
          key={idx}
          variants={item}
          className={`relative p-8 rounded-[22px] bg-white border ${card.border} shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group`}
        >
          <div className={`absolute -right-4 -top-4 w-20 h-20 ${card.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`} />
          
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-md ${card.bg} ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {card.icon}
            </div>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 italic">
              {card.value}
            </h3>
            <p className="text-[11px] font-bold text-slate-400 italic">{card.subValue}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
