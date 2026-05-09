'use client';

import React from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProductionInsightsProps {
  realRate: number;
  idealRate: number;
  breedName: string;
  week: number;
}

export function ProductionInsights({ realRate, idealRate, breedName, week }: ProductionInsightsProps) {
  const diff = realRate - idealRate;
  const isBelow = diff < 0;

  return (
    <div className="bg-white p-10 rounded-[28px] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        {isBelow ? <TrendingDown size={120} /> : <TrendingUp size={120} />}
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-md ${isBelow ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100'}`}>
            {isBelow ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <h3 className="text-xl font-black italic text-slate-800 tracking-tight">Diagnóstico Genético</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Semana {week} • {breedName}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-50 pb-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Desvio da Curva</p>
              <h4 className={`text-3xl font-black italic tracking-tighter ${isBelow ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isBelow ? '-' : '+'}{Math.abs(diff).toFixed(1)}%
              </h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Operacional</p>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isBelow ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {isBelow ? 'Abaixo do Potencial' : 'Performance Elite'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50/50 p-6 rounded-md border border-slate-100">
            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 italic">Análise Técnica:</h5>
            <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
              {isBelow 
                ? `O lote apresenta uma produção de ${realRate.toFixed(1)}%, enquanto o padrão genético para ${breedName} na semana ${week} é de ${idealRate.toFixed(1)}%. Recomenda-se auditar a ambiência e a qualidade da ração.`
                : `Excelente performance! O lote está superando o padrão genético de ${breedName} em ${diff.toFixed(1)} pontos percentuais. Mantenha os protocolos de sanidade atuais.`
              }
            </p>
          </div>

          {isBelow && (
            <button className="w-full py-4 px-6 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg shadow-slate-200">
              Solicitar Assistência Veterinária <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
