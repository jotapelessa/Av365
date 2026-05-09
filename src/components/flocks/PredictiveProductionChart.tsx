'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';

interface Standard {
  week: number;
  prodRate: number;
  cumEggs?: number;
  feedDaily?: number;
}

interface PredictiveProductionChartProps {
  records: Array<{
    id: string;
    date: Date | string;
    eggsTotal: number;
    feedConsumed: number;
    mortality: number;
  }>;
  flockQuantity: number;
  lineageStandard: {
    standardsJson: unknown;
  } | null;
  birthDate: string;
}

interface ChartDataPoint {
  date: string;
  real: number;
  ideal: number | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[24px] border border-slate-100 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-300">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-none italic">{label}</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Real</span>
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              {payload[0].value.toFixed(1)}%
            </p>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Ideal</span>
              </div>
              <p className="text-lg font-black text-slate-400 tracking-tight italic">
                {payload[1].value.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function PredictiveProductionChart({ 
  records, 
  flockQuantity, 
  lineageStandard,
  birthDate
}: PredictiveProductionChartProps) {
  
  // Preparar dados cruzando Real vs. Ideal
  const chartData: ChartDataPoint[] = records.slice(0, 15).reverse().map(record => {
    const recordDate = new Date(record.date);
    const ageInDays = Math.floor((recordDate.getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24));
    const ageInWeeks = Math.floor(ageInDays / 7);
    
    const standards = lineageStandard?.standardsJson as Standard[];
    const standardForWeek = standards?.find(s => s.week === ageInWeeks);
    
    return {
      date: recordDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      real: ((record.eggsTotal / flockQuantity) * 100),
      ideal: standardForWeek ? standardForWeek.prodRate : null
    };
  });

  return (
    <div className="bg-white p-10 rounded-[22px] border border-slate-100 shadow-2xl shadow-slate-200/40 h-full flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-indigo-50 text-primary">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Análise de Curva</h2>
            <h3 className="text-xl font-black text-slate-800 italic">Real vs. Padrão Genético</h3>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Ideal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              hide
              domain={['auto', 'auto']}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#f1f5f9', strokeWidth: 40, strokeOpacity: 0.5 }}
            />
            <Area 
              type="monotone" 
              dataKey="ideal" 
              stroke="#e2e8f0" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
              name="Padrão Linhagem"
            />
            <Area 
              type="monotone" 
              dataKey="real" 
              stroke="#4f46e5" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorReal)"
              name="Produção Real"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
