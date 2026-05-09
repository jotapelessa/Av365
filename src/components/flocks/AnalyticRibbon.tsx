import { calculateDailyIntake, calculateFCR, calculateProductionRate, calculateViability, calculateTrend } from "@/lib/utils/poultry";
import { DailyRecord, Flock } from "@prisma/client";
import { Activity, TrendingUp, Zap, Skull, Egg, Droplets, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AnalyticRibbonProps {
  flock: Flock & { initialQuantity: number; currentQuantity: number };
  latestRecord: DailyRecord | null | undefined;
  previousRecord?: DailyRecord | null;
}

export default function AnalyticRibbon({ flock, latestRecord, previousRecord }: AnalyticRibbonProps) {
  const viability = calculateViability(flock.initialQuantity, flock.currentQuantity);
  
  // Métricas Atuais
  const currentRate = latestRecord ? calculateProductionRate(latestRecord.eggsTotal, flock.currentQuantity) : 0;
  const dailyIntake = latestRecord ? calculateDailyIntake(latestRecord.feedConsumed, flock.currentQuantity) : 0;
  const dailyWater = latestRecord?.waterConsumed || 0;
  const fcr = latestRecord ? calculateFCR(latestRecord.feedConsumed, latestRecord.eggsTotal) : 0;

  // Tendências (Deltas)
  const prevRate = previousRecord ? calculateProductionRate(previousRecord.eggsTotal, flock.currentQuantity) : currentRate;
  const rateTrend = calculateTrend(currentRate, prevRate);

  const TrendBadge = ({ value }: { value: number }) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    return (
      <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${isPositive ? 'bg-success-bg text-success-text' : 'bg-danger-bg text-danger-text'}`}>
        {isPositive ? <ArrowUpRight size={8} /> : <ArrowDownRight size={8} />}
        {Math.abs(value)}%
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {/* 1. Taxa de Postura (Destaque Principal) */}
      <div className="p-6 rounded-[6px] bg-primary shadow-xl shadow-indigo-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-md bg-white/10 text-white group-hover:bg-white group-hover:text-primary transition-colors">
            <Activity size={18} />
          </div>
          <TrendBadge value={rateTrend} />
        </div>
        <div>
          <p className="text-3xl font-black text-white tracking-tighter italic">{currentRate}%</p>
          <p className="text-[10px] font-black text-indigo-100/60 uppercase tracking-widest mt-1">Postura Real</p>
        </div>
      </div>

      {/* 2. Viabilidade */}
      <div className="p-6 rounded-[6px] bg-white/70 backdrop-blur-md border border-white shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-success-bg text-success-text">
            <TrendingUp size={18} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Viabilidade</span>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{viability}%</p>
          <div className="mt-2 flex items-center gap-1.5">
            <Skull size={10} className="text-danger" />
            <span className="text-[9px] font-bold text-slate-400 italic">Mortalidade sob controle</span>
          </div>
        </div>
      </div>

      {/* 3. Consumo Água (Crucial para Saúde) */}
      <div className="p-6 rounded-[6px] bg-white/70 backdrop-blur-md border border-white shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-sky-50 text-sky-600">
            <Droplets size={18} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Hidratação</span>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{dailyWater} <span className="text-sm font-bold text-slate-400 tracking-normal">L</span></p>
          <div className="mt-2 flex items-center gap-1.5 text-sky-600/60">
            <span className="text-[9px] font-bold italic leading-none">Consumo total/dia</span>
          </div>
        </div>
      </div>

      {/* 4. Gramagem Ração */}
      <div className="p-6 rounded-[6px] bg-white/70 backdrop-blur-md border border-white shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-warning-bg text-warning-text">
            <Zap size={18} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Gramagem</span>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{dailyIntake} <span className="text-sm font-bold text-slate-400 tracking-normal">g/ave</span></p>
          <div className="mt-2 flex items-center gap-1.5 text-amber-600/60">
            <span className="text-[9px] font-bold italic leading-none">Meta Lohmann: 110g</span>
          </div>
        </div>
      </div>

      {/* 5. Conversão Alimentar */}
      <div className="p-6 rounded-[6px] bg-white/70 backdrop-blur-md border border-white shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-slate-900 text-white">
            <Egg size={18} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">CA (G/Ovo)</span>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{fcr}</p>
          <div className="mt-2 flex items-center gap-1.5 text-slate-400">
            <span className="text-[9px] font-bold italic leading-none">Eficiência biológica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
