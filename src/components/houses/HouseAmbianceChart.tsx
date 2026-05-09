'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AmbianceRecord {
  date: Date;
  temperature: number | null;
  humidity: number | null;
}

interface HouseAmbianceChartProps {
  records: AmbianceRecord[];
}

export function HouseAmbianceChart({ records }: HouseAmbianceChartProps) {
  // Formata dados para o gráfico
  const chartData = records.map(record => ({
    displayDate: format(new Date(record.date), 'dd/MM', { locale: ptBR }),
    temp: record.temperature || 0,
    humi: record.humidity || 0,
  }));

  return (
    <div className="w-full h-[350px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHumi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            unit="°C"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px'
            }}
            labelStyle={{ 
              fontSize: '10px', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              color: '#64748b',
              marginBottom: '4px'
            }}
            itemStyle={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '2px 0'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            content={({ payload }) => (
              <div className="flex gap-6 justify-end mb-8">
                {payload?.map((entry: any, index: number) => (
                  <div key={`item-${index}`} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {entry.value === 'temp' ? 'Temperatura' : 'Umidade'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="temp"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
            name="temp"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="humi"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorHumi)"
            name="humi"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
