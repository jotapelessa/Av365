'use client';

import { Bird, Calendar, TrendingUp, Skull, Activity, ArrowRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteFlock } from "@/app/flocks/actions";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { calculateFlockAge, calculateProductionRate, calculateViability } from "@/lib/utils/poultry";
import { toast } from "sonner";

interface FlockCardExpertProps {
  flock: any;
}

export default function FlockCardExpert({ flock }: FlockCardExpertProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // Reset após 3s
      return;
    }

    startTransition(async () => {
      const result = await deleteFlock(flock.id);
      if (result.success) {
        toast.success("Lote excluído com sucesso");
      } else {
        toast.error("Erro ao excluir lote: " + result.error);
      }
    });
  };

  const age = calculateFlockAge(flock.acquisitionDate, flock.ageAtArrival || 0);
  
  // Dados para o Sparkline (últimos 15 registros)
  const sparklineData = flock.records?.slice(0, 15).reverse().map((r: any) => ({
    date: new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    rate: calculateProductionRate(r.eggsTotal, flock.currentQuantity)
  })) || [];

  const latestRecord = flock.records?.[0];
  const previousRecord = flock.records?.[1];
  
  const currentRate = latestRecord 
    ? calculateProductionRate(latestRecord.eggsTotal, flock.currentQuantity)
    : 0;

  const previousRate = previousRecord
    ? calculateProductionRate(previousRecord.eggsTotal, flock.currentQuantity)
    : currentRate;
  
  const rateTrend = currentRate >= previousRate ? 'up' : 'down';
  
  const viability = calculateViability(flock.initialQuantity, flock.currentQuantity);

  return (
    <div className="relative group/card">
      {/* Botão de Excluir Flutuante */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-[6px] transition-all duration-300 flex items-center gap-2
          ${showConfirm 
            ? "bg-rose-600 text-white w-auto px-4 shadow-lg shadow-rose-200" 
            : "bg-white/80 backdrop-blur-md text-slate-300 hover:text-rose-600 hover:bg-white shadow-sm opacity-0 group-hover/card:opacity-100"
          }`}
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : showConfirm ? (
          <>
            <Trash2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Confirmar?</span>
          </>
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      <Link 
        href={`/flocks/${flock.id}`}
        data-audit={`flock-card-link-${flock.id}`}
        className="relative flex flex-col p-8 lg:p-10 rounded-[6px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden h-[520px] min-w-0"
      >
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 blur-[80px] group-hover:bg-indigo-500/10 transition-colors" />

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 rounded-md bg-indigo-50 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
            <Bird size={24} />
          </div>
          <div className="min-w-0">
            <h3 data-audit="flock-card-name" className="text-xl font-black text-slate-900 tracking-tight italic leading-none group-hover:text-primary transition-colors truncate">{flock.name}</h3>
            <p data-audit="flock-card-breed" className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 truncate">{flock.breed}</p>
          </div>
        </div>
        <div data-audit="flock-card-status" className={`px-3 py-1.5 rounded-[6px] text-[9px] font-black uppercase tracking-widest border shrink-0 ${
          flock.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
        }`}>
          {flock.status}
        </div>
      </div>

      {/* Grid de Métricas Densas */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100/50 min-w-0" data-audit="flock-metric-age">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Calendar size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest">Idade</span>
          </div>
          <p className="text-sm font-black text-slate-800 italic truncate">{age.formatted}</p>
        </div>

        <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100/50 min-w-0" data-audit="flock-metric-quantity">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Activity size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest">Aves</span>
          </div>
          <p className="text-sm font-black text-slate-800 truncate">{flock.currentQuantity.toLocaleString('pt-BR')}</p>
        </div>

        <div className="p-4 rounded-[6px] bg-emerald-50/50 border border-emerald-100/30 min-w-0" data-audit="flock-metric-viability">
          <div className="flex items-center gap-2 mb-2 text-emerald-600">
            <TrendingUp size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Viab.</span>
          </div>
          <p className="text-sm font-black text-emerald-700">{viability}%</p>
        </div>

        <div className="p-4 rounded-[6px] bg-indigo-50/50 border border-indigo-100/30 min-w-0" data-audit="flock-metric-production">
          <div className="flex items-center gap-2 mb-2 text-indigo-600">
            <Activity size={12} />
            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Postura</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <p className="text-sm font-black text-indigo-700 truncate">{currentRate}%</p>
            <span className={`text-[10px] font-black shrink-0 ${rateTrend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {rateTrend === 'up' ? '↑' : '↓'}
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline de Tendência Avançado (15 Dias) */}
      <div className="flex-1 flex flex-col min-h-[140px] mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Desempenho 15D</p>
          </div>
          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest">Live Analytics</span>
        </div>
        
        <div className="flex-1 relative">
          {sparklineData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`colorRate-${flock.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis hide domain={['auto', 'auto']} />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  fill={`url(#colorRate-${flock.id})`} 
                  animationDuration={2000}
                  dot={false}
                  activeDot={{ r: 4, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center border-t border-slate-100 border-dashed">
              <span className="text-[9px] font-bold text-slate-300 italic tracking-wide">Aguardando dados...</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Análise de Lote</span>
          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}
