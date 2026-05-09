'use client';

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface FinanceChartProps {
  data: {
    date: string;
    realized: number;
    projected: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-[24px] border border-slate-100 shadow-2xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-slate-900">
                R$ {Number(entry.value).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
          
          <Area 
            name="Projeção"
            type="monotone" 
            dataKey="projected" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProjected)" 
            strokeDasharray="5 5"
          />
          
          <Bar 
            name="Realizado"
            dataKey="realized" 
            fill="#10b981" 
            radius={[6, 6, 0, 0]} 
            barSize={20} 
          />
          
          <Line 
            name="Tendência"
            type="monotone" 
            dataKey="realized" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
