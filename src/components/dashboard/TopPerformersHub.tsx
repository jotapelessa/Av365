'use client';

import { DashboardCard } from './DashboardGrid';
import { Trophy, Medal, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { calculateProductionRate } from '@/lib/utils/poultry';

interface Flock {
  id: string;
  name: string;
  breed: string;
  currentQuantity: number;
  records: any[];
}

export function TopPerformersHub({ flocks }: { flocks: Flock[] }) {
  const rankedFlocks = flocks.map(f => {
    const latestRecord = f.records?.[0];
    const rate = latestRecord ? calculateProductionRate(latestRecord.eggsTotal, f.currentQuantity) : 0;
    return { ...f, rate };
  }).sort((a, b) => b.rate - a.rate).slice(0, 5);

  return (
    <DashboardCard 
      auditId="dashboard__hub__top-performers"
      span={12} 
      className="bg-white border border-slate-50 shadow-sm relative overflow-hidden group p-[var(--padding-fluid)]"
    >
      <div className="absolute top-0 right-0 p-[var(--padding-fluid)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none rotate-12">
        <Trophy size={180} className="text-primary" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-[var(--gap-fluid)]">
          <div className="flex items-center gap-[var(--gap-fluid)]">
            <div className="p-[var(--gap-fluid)] rounded-2xl bg-indigo-50 text-primary flex-shrink-0">
              <Star className="icon-fluid-lg" />
            </div>
            <div>
              <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none" data-audit="dashboard__top-performers__title">Elite de Performance</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1" data-audit="dashboard__top-performers__subtitle">Ranking de Produtividade</p>
            </div>
          </div>
          <div data-audit="dashboard__top-performers__efficiency-badge" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
            <TrendingUp size={12} /> Alta Eficiência
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-[var(--gap-fluid)]">
          {rankedFlocks.length > 0 ? (
            rankedFlocks.map((flock, index) => (
              <div 
                key={flock.id} 
                data-audit={`dashboard__top-performers__item-${index + 1}`}
                className="flex flex-col p-[var(--gap-fluid)] rounded-[18px] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group/item border-b-4 border-b-transparent hover:border-b-primary"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-amber-100 text-amber-600' :
                    index === 1 ? 'bg-slate-200 text-slate-500' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {index < 3 ? <Medal className="icon-fluid" /> : <Star className="icon-fluid" />}
                  </div>
                  <span className="text-[10px] font-black text-slate-400">#{index + 1}</span>
                </div>
                
                <h3 className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight mb-1" data-audit={`dashboard__top-performers__name-${flock.id}`}>
                  {flock.name}
                </h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 truncate" data-audit={`dashboard__top-performers__breed-${flock.id}`}>
                  {flock.breed}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxa Postura</p>
                      <p className="text-lg font-black text-primary italic leading-none" data-audit={`dashboard__top-performers__rate-${flock.id}`}>
                        {flock.rate}%
                      </p>
                    </div>
                    <ArrowUpRight size={14} className="text-emerald-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-5 py-20 text-center opacity-30" data-audit="dashboard__top-performers__empty">
              <Trophy size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-sm font-black italic text-slate-400">Dados de performance insuficientes.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
