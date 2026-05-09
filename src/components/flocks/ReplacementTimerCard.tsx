'use client';

import React from 'react';
import { History, Hourglass, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PredictionData {
  daysUntilReplacement: number;
  replacementDate: string;
  productionDrop: boolean;
  dropValue: string;
}

interface ReplacementTimerCardProps {
  prediction: PredictionData;
}

export function ReplacementTimerCard({ prediction }: ReplacementTimerCardProps) {
  const days = prediction.daysUntilReplacement;
  
  // Lógica de cores baseada na urgência
  const statusColor = days > 60 ? 'text-emerald-600' : days > 30 ? 'text-amber-600' : 'text-rose-600';
  const statusBg = days > 60 ? 'bg-emerald-50' : days > 30 ? 'bg-amber-50' : 'bg-rose-50';
  const statusBorder = days > 60 ? 'border-emerald-100' : days > 30 ? 'border-amber-100' : 'border-rose-100';

  // Lógica de ciclo de vida baseada no progresso (exemplo: 90 semanas total)
  const totalDays = 630;
  const daysPassed = totalDays - days;
  const progress = (daysPassed / totalDays) * 100;
  
  let cyclePhase = "Postura Ativa";
  if (progress < 20) cyclePhase = "Início de Postura";
  else if (progress < 60) cyclePhase = "Pico de Produção";
  else if (progress < 85) cyclePhase = "Postura Estável";
  else cyclePhase = "Fim de Ciclo";

  const needsOrder = days <= 60;

  return (
    <div className={`p-10 rounded-[28px] bg-white border ${statusBorder} shadow-2xl shadow-slate-200/40 relative overflow-hidden group h-full flex flex-col`}>
      {/* Background Icon Watermark */}
      <div className={`absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 ${statusColor}`}>
        <History size={240} />
      </div>

      <div className="relative z-10 flex-1 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-md ${statusBg} ${statusColor} shadow-sm`}>
              <Hourglass size={20} />
            </div>
            <div>
              <h2 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Cronômetro de Reposição</h2>
              <p className={`text-[9px] font-black uppercase tracking-widest ${statusColor}`}>{cyclePhase}</p>
            </div>
          </div>
          {needsOrder && (
            <div className="animate-pulse flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest">
              Fazer Pedido de Pintainhas
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Janela de Troca (Dias)</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-8xl font-black italic tracking-tighter ${statusColor} tabular-nums`}>{days}</span>
            <span className="text-xl font-black text-slate-300 uppercase italic">dias</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div 
              className={`h-full ${statusColor.replace('text', 'bg')} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data de Reposição</p>
              <p className="text-sm font-black text-slate-800 italic">
                {format(new Date(prediction.replacementDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Final</p>
              <span className={`text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                {days > 30 ? 'Ciclo em Curso' : 'Substituir Agora'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
