'use client';

import { Target, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { Flock, DailyRecord } from "@prisma/client";
import { calculateProductionRate, getStandardRateForAge, getLineageDeviation, calculateFlockAge } from "@/lib/utils/poultry";

interface LineageAlertCardProps {
  flock: any; // Using any for simplicity with complex Prisma includes
  latestRecord: DailyRecord | null | undefined;
}

export default function LineageAlertCard({ flock, latestRecord }: LineageAlertCardProps) {
  if (!flock.lineageStandard) {
    return (
      <div className="rounded-[40px] bg-slate-900 p-8 text-white shadow-xl flex flex-col justify-between h-full opacity-60">
        <div className="flex items-center gap-3 mb-6">
          <Target size={20} className="text-slate-500" />
          <h2 className="font-black uppercase tracking-widest text-[10px] text-slate-500">Genética</h2>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-400 italic">Padrão não definido</p>
          <p className="text-[10px] text-slate-600 mt-2">Vincule uma linhagem para ver metas.</p>
        </div>
      </div>
    );
  }

  const currentRate = latestRecord ? calculateProductionRate(latestRecord.eggsTotal, flock.currentQuantity) : 0;
  const age = calculateFlockAge(flock.acquisitionDate, flock.ageAtArrival || 0);
  const standardRate = getStandardRateForAge(flock.lineageStandard.standardsJson, age.totalDays);
  const deviation = getLineageDeviation(currentRate, standardRate);

  const isBelow = deviation < 0;
  const isCritical = deviation <= -5;

  return (
    <div className={`rounded-[40px] p-8 text-white shadow-xl flex flex-col justify-between h-full transition-all duration-500 ${
      isCritical ? 'bg-danger shadow-rose-100' : isBelow ? 'bg-warning shadow-amber-100' : 'bg-slate-900'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target size={20} className={isCritical ? 'text-danger' : isBelow ? 'text-warning' : 'text-primary-light'} />
          <h2 className="font-black uppercase tracking-widest text-[10px] text-white/40">Performance Genética</h2>
        </div>
        {deviation !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
            isBelow ? 'bg-white/10 text-white' : 'bg-success/20 text-success'
          }`}>
            {isBelow ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {Math.abs(deviation)}%
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black italic leading-none">{flock.lineageStandard.name}</p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{flock.lineageStandard.breed}</p>
        </div>
        <p className="text-[10px] font-medium text-white/50 mt-2 italic">Idade: {age.formatted}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="p-4 rounded-md bg-white/5 border border-white/10">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Meta de Postura</span>
            <span className="text-xl font-black italic text-white/90">{standardRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                isCritical ? 'bg-danger' : isBelow ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${currentRate}%` }} 
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[8px] font-black text-white/20 uppercase">Progresso Real</span>
            <span className="text-[10px] font-black text-white/60 italic">{currentRate}%</span>
          </div>
        </div>

        {isCritical && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger/20 border border-danger/30">
            <AlertCircle size={14} className="text-danger shrink-0 mt-0.5" />
            <p className="text-[9px] font-bold text-rose-100 leading-tight">
              Produção significativamente abaixo do padrão. Verifique nutrição e sanidade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
