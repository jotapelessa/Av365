'use client';

import { DashboardCard } from './DashboardGrid';
import { 
  Zap, 
  Droplets, 
  Scale, 
  ArrowUpRight,
  Gauge
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface ResourceStats {
  feed: number;
  water: number;
  energy: number;
}

export function ResourceIntelligenceHub({ resources, sparkline }: { resources: ResourceStats, sparkline: any[] }) {
  const items = [
    { 
      label: 'Água', 
      value: `${resources.water.toLocaleString('pt-BR')} L`, 
      icon: Droplets, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      dataKey: 'water',
      auditId: 'water'
    },
    { 
      label: 'Ração', 
      value: `${resources.feed.toLocaleString('pt-BR')} kg`, 
      icon: Scale, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      dataKey: 'feed',
      auditId: 'feed'
    },
    { 
      label: 'Energia', 
      value: `${resources.energy.toLocaleString('pt-BR')} kWh`, 
      icon: Zap, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      dataKey: 'energy',
      auditId: 'energy'
    },
  ];

  return (
    <DashboardCard 
      auditId="dashboard__hub__resource-intelligence"
      span={4} 
      className="flex flex-col bg-white border border-slate-50 shadow-sm relative overflow-hidden group p-[var(--padding-fluid)]"
    >
      <div className="flex items-center justify-between mb-[var(--gap-fluid)]">
        <div className="flex items-center gap-[var(--gap-fluid)]">
          <div className="p-[var(--gap-fluid)] rounded-2xl bg-primary text-white shadow-lg shadow-indigo-200 flex-shrink-0">
            <Gauge className="icon-fluid-lg" />
          </div>
          <div>
            <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none" data-audit="dashboard__resources__title">Insumos Vital</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1" data-audit="dashboard__resources__subtitle">Recursos & Eficiência</p>
          </div>
        </div>
        <div data-audit="dashboard__resources__status-badge" className="hidden sm:block px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Otimização Ativa</span>
        </div>
      </div>

      <div className="space-y-[var(--gap-fluid)] flex-1">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            data-audit={`dashboard__resources__metric-${item.auditId}`}
            className="relative p-[var(--gap-fluid)] rounded-[18px] bg-white/40 border border-white/20 hover:border-primary/20 transition-all group backdrop-blur-sm shadow-sm overflow-hidden"
          >
            {/* Sparkline de fundo sutil */}
            <div className="absolute inset-x-0 bottom-0 h-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <AreaChart data={sparkline}>
                  <Area 
                    type="monotone" 
                    dataKey={item.dataKey} 
                    stroke="currentColor" 
                    className={item.color}
                    strokeWidth={1} 
                    fill="currentColor" 
                    fillOpacity={0.1}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-md ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
              </div>
              <div className="text-right">
                <p className="text-stat text-slate-900 tracking-tighter leading-none" style={{ fontSize: 'var(--text-fluid-h3)' }}>{item.value}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                   <ArrowUpRight size={10} className="text-emerald-500" />
                   <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Normal</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[var(--gap-fluid)] pt-[var(--gap-fluid)] border-t border-slate-100 flex items-center justify-between" data-audit="dashboard__resources__footer">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Custo de Insumo / Ave</p>
        <span className="text-h3 font-black text-primary italic">R$ 1,42 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest not-italic ml-1">Est.</span></span>
      </div>
    </DashboardCard>
  );
}
