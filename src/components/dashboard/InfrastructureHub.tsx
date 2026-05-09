'use client';

import { DashboardCard } from './DashboardGrid';
import { Home, Zap, Box, Settings } from 'lucide-react';

interface InfrastructureSummary {
  total: number;
  busy: number;
  empty: number;
  maintenance: number;
  occupancyRate: number | string;
}

export function InfrastructureHub({ summary }: { summary: InfrastructureSummary }) {
  const items = [
    { label: 'Total', value: summary.total, icon: Home, bg: 'bg-indigo-50', color: 'text-primary' },
    { label: 'Ocupados', value: summary.busy, icon: Zap, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Vazios', value: summary.empty, icon: Box, bg: 'bg-slate-50', color: 'text-slate-400' },
    { label: 'Manutenção', value: summary.maintenance, icon: Settings, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  return (
    <DashboardCard 
      auditId="dashboard__hub__infrastructure"
      span={4} 
      className="bg-white border border-slate-50 shadow-sm flex flex-col relative overflow-hidden group p-[var(--padding-fluid)]"
    >
      <div className="absolute -right-10 -top-10 p-[var(--padding-fluid)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none rotate-12">
        <Home size={140} className="text-primary" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-[var(--gap-fluid)]">
          <div className="flex items-center gap-[var(--gap-fluid)]">
            <div className="p-[var(--gap-fluid)] rounded-2xl bg-indigo-50 text-primary flex-shrink-0">
              <Home className="icon-fluid-lg" />
            </div>
            <div>
              <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none" data-audit="dashboard__infrastructure__title">Infraestrutura</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1" data-audit="dashboard__infrastructure__subtitle">Galpões & Ocupação</p>
            </div>
          </div>
        </div>

        <div className="space-y-[var(--gap-fluid)] flex-1">
          {/* Ocupação Global */}
          <div className="space-y-3" data-audit="dashboard__infrastructure__occupancy-section">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ocupação de Alojamento</span>
               <span className="text-xs font-black text-slate-900">{summary.occupancyRate}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-1000" 
                 style={{ width: `${summary.occupancyRate}%` }}
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[var(--gap-fluid)]">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                data-audit={`dashboard__infrastructure__metric-${item.label.toLowerCase()}`}
                className="flex items-center justify-between p-[var(--gap-fluid)] rounded-[18px] bg-white/40 border border-white/20 hover:border-slate-300/50 transition-all group backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-md ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm flex-shrink-0`}>
                    <item.icon size={12} />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter truncate">{item.label}</span>
                </div>
                <span className="text-lg font-black text-slate-900 italic tracking-tighter leading-none">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
