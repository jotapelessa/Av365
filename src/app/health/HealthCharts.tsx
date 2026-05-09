'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MortalityChartProps {
  data: any[];
  standardData?: any[];
}

export function MortalityChart({ data, standardData }: MortalityChartProps) {
  // Processar dados para gráfico acumulado
  let accumulatedMortality = 0;
  const chartData = data.map(record => {
    accumulatedMortality += record.mortality;
    return {
      date: format(new Date(record.date), 'dd/MM'),
      real: accumulatedMortality,
      standard: (standardData?.find(s => s.day === record.age)?.mortality || 0) * accumulatedMortality // Simplificado
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
            }}
            labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="real" 
            name="Mortalidade Real"
            stroke="#f43f5e" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorReal)" 
          />
          <Line 
            type="monotone" 
            dataKey="standard" 
            name="Padrão Linhagem"
            stroke="#cbd5e1" 
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
