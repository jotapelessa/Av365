'use client';

import { motion } from "framer-motion";
import { TrendingUp, Bird, Thermometer, ArrowUpRight, Wind, Activity } from "lucide-react";

export function CardsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* CARD 1: KPI STANDARD */}
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-white p-8 rounded-[6px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-6 text-slate-50 group-hover:scale-110 transition-transform duration-700">
          <Bird size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
              <Activity size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plantel Ativo</span>
          </div>
          <h4 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-2">12.450</h4>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">+2.4% vs meta</span>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: GLASSMORPHISM / AMBIENCE */}
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[6px] shadow-2xl shadow-indigo-200/50 text-white relative overflow-hidden group"
      >
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="p-2.5 rounded-md bg-white/10 text-white">
              <Wind size={20} />
            </div>
            <div className="px-2 py-1 rounded-full bg-white/20 text-[8px] font-black uppercase tracking-widest">Live Sensor</div>
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Temperatura Interna</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black italic">27.4</span>
              <span className="text-xl font-black text-indigo-200">ºC</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: HIGH DENSITY / CHART CONTAINER */}
      <motion.div 
        whileHover={{ y: -8 }}
        className="lg:col-span-2 bg-white p-10 rounded-[6px] border border-slate-100 shadow-2xl shadow-slate-200/40"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-indigo-600 text-white shadow-lg shadow-indigo-100">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic text-slate-800">Performance Produtiva</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ovos por Ave / Semana 34</p>
            </div>
          </div>
          <button className="p-3 rounded-md bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm">
            <ArrowUpRight size={18} />
          </button>
        </div>
        
        {/* Mock Chart Area */}
        <div className="h-48 w-full bg-slate-50/50 rounded-md border-2 border-dashed border-slate-100 flex items-center justify-center">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Área de Gráfico de Alta Densidade (p-10)</span>
        </div>
      </motion.div>

      {/* CARD 4: INTERACTIVE ACTION */}
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-slate-900 p-8 rounded-[6px] shadow-2xl shadow-slate-300/50 text-white group cursor-pointer"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <h4 className="text-xl font-black italic tracking-tight group-hover:text-indigo-400 transition-colors">Relatório Biométrico</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Análise profunda da conversão alimentar e ganho de peso diário.
            </p>
          </div>
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Gerar PDF Agora</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ChevronRight({ size, className }: any) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
