'use client';

import { DashboardCard } from './DashboardGrid';
import { Thermometer, Droplets, Activity, RefreshCw } from 'lucide-react';

interface AmbianceRecord {
  id: string;
  houseName: string;
  temperature: number | null;
  humidity: number | null;
  date: string;
}

export function AmbianceMonitor({ data }: { data: AmbianceRecord[] }) {
  return (
    <DashboardCard 
      span={4} 
      auditId="dashboard__hub__ambiance"
      className="flex flex-col bg-white border border-slate-50 shadow-sm relative overflow-hidden group p-[var(--padding-fluid)]"
    >
      <div className="flex items-center justify-between mb-[var(--gap-fluid)]">
        <div className="flex items-center gap-[var(--gap-fluid)]">
          <div className="p-[var(--gap-fluid)] rounded-[18px] bg-emerald-500 text-white shadow-lg shadow-emerald-200 flex-shrink-0">
            <Activity className="icon-fluid-lg" />
          </div>
          <div>
            <h3 data-audit="dashboard__ambiance__title" className="text-h2 text-slate-900 italic tracking-tighter leading-none">Ambiência</h3>
            <p data-audit="dashboard__ambiance__subtitle" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Conforto Térmico</p>
          </div>
        </div>
        <div data-audit="dashboard__ambiance__live-status" className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <RefreshCw size={10} className="animate-spin-slow" /> Live
        </div>
      </div>

      <div className="space-y-[var(--gap-fluid)] flex-1">
        {data.length > 0 ? (
          data.map((record) => {
            // Cálculo THI: (0.8 * T) + [(H / 100) * (T - 14.4)] + 46.4
            const thi = record.temperature && record.humidity 
              ? (0.8 * record.temperature) + ((record.humidity / 100) * (record.temperature - 14.4)) + 46.4
              : null;
            
            const isCritical = thi && thi > 75;
            const isWarning = thi && thi > 72 && thi <= 75;

            return (
              <div 
                key={record.id} 
                data-audit={`dashboard__ambiance__house-${record.id}`}
                className={`p-[var(--gap-fluid)] rounded-[18px] bg-white/40 border transition-all group backdrop-blur-sm shadow-sm ${
                isCritical ? 'border-rose-300 shadow-rose-100' : 
                isWarning ? 'border-amber-300 shadow-amber-100' : 
                'border-white/20 hover:border-emerald-300/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{record.houseName}</span>
                      {isCritical && <span className="text-[8px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest">Estresse Térmico</span>}
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 italic bg-slate-100/50 px-2 py-0.5 rounded-full">{new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2" data-audit={`dashboard__ambiance__temp-${record.id}`}>
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <Thermometer className="icon-fluid" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 italic tracking-tighter">{record.temperature ? `${record.temperature.toFixed(1)}°` : '--'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Temp</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" data-audit={`dashboard__ambiance__humidity-${record.id}`}>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Droplets className="icon-fluid" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 italic tracking-tighter">{record.humidity ? `${record.humidity.toFixed(1)}%` : '--'}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Umid</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-l border-slate-100 pl-4" data-audit={`dashboard__ambiance__thi-${record.id}`}>
                    <div>
                      <p className={`text-lg font-black italic tracking-tighter ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {thi ? thi.toFixed(1) : '--'}
                      </p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">THI</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30 text-center">
             <Activity size={40} className="mb-3 text-slate-300" />
             <p className="text-sm font-black italic text-slate-400">Aguardando telemetria...</p>
          </div>
        )}
      </div>

      <div className="mt-[var(--gap-fluid)] pt-[var(--gap-fluid)] border-t border-slate-100 flex items-center justify-between" data-audit="dashboard__ambiance__footer">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic leading-none">Status</span>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter italic">Sist. Operacional</span>
         </div>
      </div>
    </DashboardCard>
  );
}
