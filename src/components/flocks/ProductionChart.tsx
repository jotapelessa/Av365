'use client';

import { useState, useEffect } from 'react';

import { 
  ComposedChart,
  Area, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calculateDailyIntake, calculateProductionRate, getStandardRateForAge } from '@/lib/utils/poultry';
import { differenceInDays } from 'date-fns';

interface ProductionChartProps {
  data: any[];
  birdQuantity: number;
  lineageStandard?: any;
  acquisitionDate?: Date;
  ageAtArrival?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[6px] border border-slate-100 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-300">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 leading-none italic">{label}</p>
          <div className="space-y-4">
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Postura Real</span>
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              {payload[0].value}%
            </p>
          </div>
          {payload.find((p: any) => p.dataKey === 'standard') && (
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.4)]" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Meta Genética</span>
              </div>
              <p className="text-lg font-black text-slate-400 tracking-tight italic">
                {payload.find((p: any) => p.dataKey === 'standard').value}%
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Consumo</span>
            </div>
            <p className="text-lg font-black text-emerald-600 tracking-tight">
              {payload.find((p: any) => p.dataKey === 'intake')?.value} <span className="text-[10px] font-bold text-success">g/ave</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProductionChart({ 
  data, 
  birdQuantity, 
  lineageStandard,
  acquisitionDate,
  ageAtArrival
}: ProductionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Formatar dados para o gráfico (Expert Correlation)
  const chartData = [...data].reverse().map(record => {
    // Calcular idade exata no dia do registro para bater com a meta semanal (apenas se houver dados de origem)
    let standardRate = null;
    if (lineageStandard && acquisitionDate && ageAtArrival !== undefined) {
      const daysSinceAcquisition = differenceInDays(new Date(record.date), new Date(acquisitionDate));
      const ageInDays = daysSinceAcquisition + ageAtArrival;
      standardRate = getStandardRateForAge(lineageStandard.standardsJson, ageInDays);
    }

    return {
      date: format(new Date(record.date), 'dd/MM', { locale: ptBR }),
      rate: calculateProductionRate(record.eggsTotal, birdQuantity),
      intake: calculateDailyIntake(record.feedConsumed, birdQuantity),
      standard: standardRate,
    };
  });

  const COLORS = {
    primary: '#4f46e5',
    success: '#10b981',
    slate: '#cbd5e1',
    white: '#ffffff'
  };

  if (!mounted) return <div className="h-full w-full bg-slate-50/50 animate-pulse rounded-[6px] min-h-[350px]" />;

  return (
    <div className="w-full h-full min-h-[350px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 0, left: -20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
            </linearGradient>
            <filter id="shadow" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid 
            strokeDasharray="12 12" 
            vertical={false} 
            stroke="#f8fafc" 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 900 }}
            dy={20}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tick={{ fill: COLORS.primary, fontSize: 10, fontWeight: 900 }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
            tick={{ fill: COLORS.success, fontSize: 10, fontWeight: 900 }}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#f1f5f9', strokeWidth: 40, strokeOpacity: 0.5 }}
            wrapperStyle={{ outline: 'none' }}
          />
          
          {/* Postura % (Area - Primary Y Axis) */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="rate"
            stroke={COLORS.primary}
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorRate)"
            animationDuration={2000}
            filter="url(#shadow)"
          />

          {/* Meta Genética % (Line - Dotted) */}
          {lineageStandard && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="standard"
              stroke={COLORS.slate}
              strokeWidth={2}
              strokeDasharray="10 10"
              dot={false}
              animationDuration={3000}
            />
          )}

          {/* Consumo g/ave (Line - Secondary Y Axis) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="intake"
            stroke={COLORS.success}
            strokeWidth={4}
            dot={{ r: 4, fill: COLORS.success, strokeWidth: 2, stroke: COLORS.white }}
            activeDot={{ r: 8, fill: COLORS.success, strokeWidth: 4, stroke: COLORS.white }}
            animationDuration={2500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
