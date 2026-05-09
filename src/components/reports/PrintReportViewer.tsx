'use client';

import React, { useEffect } from 'react';
import ReportHeader from "./ReportHeader";

import { format } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, LabelList
} from 'recharts';

interface PrintReportViewerProps {
  title: string;
  subtitle: string;
  type: string;
  kpis: any[];
  data: any[];
  chartConfig?: {
    type: 'bar' | 'line' | 'area';
    dataKey: string;
    categoryKey: string;
    title: string;
    color?: string;
  };
}

export default function PrintReportViewer({
  title,
  subtitle,
  type,
  kpis = [],
  data = [],
  chartConfig
}: PrintReportViewerProps) {
  
  const [mounted, setMounted] = React.useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Custom label renderer for clarity in print
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    
    return (
      <text 
        x={x + width / 2} 
        y={y - 8} 
        fill="#64748b" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className="text-[9px] font-black italic"
      >
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </text>
    );
  };

  // Definição de Colunas no CLIENTE para evitar erro de serialização de funções
  const getColumns = () => {
    switch (type) {
      case 'dre':
        return [
          { key: 'period', header: 'Período' },
          { key: 'revenue', header: 'Receita (R$)', render: (row: any) => `R$ ${row.revenue.toLocaleString('pt-BR')}` },
          { key: 'expenses', header: 'Custos (R$)', render: (row: any) => `R$ ${row.expenses.toLocaleString('pt-BR')}` },
          { key: 'profit', header: 'Resultado (R$)', render: (row: any) => `R$ ${row.profit.toLocaleString('pt-BR')}` },
          { key: 'margin', header: 'Margem (%)', render: (row: any) => `${row.margin.toFixed(1)}%` }
        ];
      case 'production':
        return [
          { key: 'name', header: 'Lote' },
          { key: 'quantity', header: 'Plantel', render: (row: any) => `${row.quantity} aves` },
          { key: 'layRate', header: 'Postura (%)', render: (row: any) => `${row.layRate.toFixed(1)}%` },
          { key: 'fcr', header: 'Conversão', render: (row: any) => `${row.fcr.toFixed(3)} kg/dz` },
          { key: 'mortality', header: 'Mortalidade', render: (row: any) => `${row.mortality} aves` }
        ];
      case 'flocks':
        return [
          { key: 'name', header: 'Identificação' },
          { key: 'breed', header: 'Linhagem' },
          { key: 'quantity', header: 'Quantidade' },
          { key: 'acquisitionDate', header: 'Chegada', render: (row: any) => row.acquisitionDate ? format(new Date(row.acquisitionDate), "dd/MM/yyyy") : 'N/A' },
          { key: 'houses', header: 'Galpões' }
        ];
      case 'health':
        return [
          { key: 'flock', header: 'Lote' },
          { key: 'type', header: 'Tipo' },
          { key: 'severity', header: 'Gravidade' },
          { key: 'status', header: 'Status' },
          { key: 'date', header: 'Data', render: (row: any) => row.date ? format(new Date(row.date), "dd/MM/yyyy") : 'N/A' }
        ];
      case 'silos':
        return [
          { key: 'name', header: 'Silo' },
          { key: 'feedType', header: 'Ração' },
          { key: 'capacity', header: 'Capacidade (t)' },
          { key: 'currentStock', header: 'Estoque (t)' },
          { key: 'occupancy', header: 'Ocupação (%)', render: (row: any) => `${row.occupancy.toFixed(1)}%` }
        ];
      case 'equity':
        return [
          { key: 'category', header: 'Ativo' },
          { key: 'description', header: 'Descrição' },
          { key: 'type', header: 'Tipo' },
          { key: 'value', header: 'Valor (R$)', render: (row: any) => `R$ ${row.value.toLocaleString('pt-BR')}` }
        ];
      case 'customers':
        return [
          { key: 'name', header: 'Cliente' },
          { key: 'count', header: 'Pedidos' },
          { key: 'revenue', header: 'Faturamento (R$)', render: (row: any) => `R$ ${row.revenue.toLocaleString('pt-BR')}` },
          { key: 'avgTicket', header: 'Ticket Médio', render: (row: any) => `R$ ${row.avgTicket.toLocaleString('pt-BR')}` }
        ];
      case 'employees':
        return [
          { key: 'name', header: 'Colaborador' },
          { key: 'total', header: 'Tarefas' },
          { key: 'completed', header: 'Concluídas' },
          { key: 'rate', header: 'Eficiência (%)', render: (row: any) => `${row.rate.toFixed(1)}%` }
        ];
      case 'cash-flow':
        return [
          { key: 'date', header: 'Data', render: (row: any) => row.date ? format(new Date(row.date), "dd/MM/yyyy") : 'N/A' },
          { key: 'description', header: 'Descrição', render: (row: any) => row.description || row.category || 'Operação' },
          { key: 'type', header: 'Tipo' },
          { key: 'val', header: 'Valor (R$)', render: (row: any) => `R$ ${row.val.toLocaleString('pt-BR')}` }
        ];
      default:
        return [];
    }
  };

  const columns: { key: string; header: string; render?: (row: any, idx?: number) => any; className?: string }[] = getColumns();

  useEffect(() => {
    if (data.length > 0 || kpis.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [data, kpis]);

  if (!data.length && !kpis.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4 no-print"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest no-print">Carregando Relatório Elite...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-0 font-sans text-slate-900 print:p-0">
      <div className="max-w-[210mm] mx-auto p-8 print:p-0">
      {/* Cabeçalho de Impressão */}
      <ReportHeader title={title} subtitle={subtitle} />

      {/* Grid de KPIs - Layout em colunas simples para papel */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 border border-slate-200 rounded-lg">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.title}</p>
            <p className="text-xl font-black text-slate-900 italic">{kpi.value}</p>
            {kpi.trend && <p className="text-[9px] font-bold text-indigo-600 uppercase mt-1">{kpi.trend}</p>}
          </div>
        ))}
      </div>

      {/* Gráfico Analítico (Opcional) */}
      {chartConfig && mounted && (
        <div className="mb-10 space-y-4">
          <div className="p-6 border border-slate-200 rounded-lg">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{chartConfig.title}</p>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartConfig.type === 'bar' ? (
                  <BarChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey={chartConfig.categoryKey} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <Bar dataKey={chartConfig.dataKey} fill={chartConfig.color || "#4f46e5"} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      <LabelList dataKey={chartConfig.dataKey} content={renderCustomLabel} />
                    </Bar>
                  </BarChart>
                ) : chartConfig.type === 'line' ? (
                  <LineChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey={chartConfig.categoryKey} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey={chartConfig.dataKey} stroke={chartConfig.color || "#4f46e5"} strokeWidth={3} dot={{ r: 4, fill: chartConfig.color || "#4f46e5", strokeWidth: 0 }} isAnimationActive={false}>
                      <LabelList dataKey={chartConfig.dataKey} position="top" offset={10} className="text-[9px] font-black italic fill-slate-500" />
                    </Line>
                  </LineChart>
                ) : (
                  <AreaChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey={chartConfig.categoryKey} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey={chartConfig.dataKey} stroke={chartConfig.color || "#4f46e5"} fill={`${chartConfig.color || "#4f46e5"}20`} isAnimationActive={false}>
                      <LabelList dataKey={chartConfig.dataKey} position="top" offset={10} className="text-[9px] font-black italic fill-slate-500" />
                    </Area>
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabela de Apoio Técnica (Opção B do Brainstorm) */}
          <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Detalhamento Técnico de Pontos de Dados</p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-y-3 gap-x-6">
              {data.slice(0, 12).map((item, idx) => (
                <div key={idx} className="flex flex-col border-l-2 border-slate-200 pl-2">
                  <span className="text-[8px] font-bold text-slate-400 uppercase truncate">{item[chartConfig.categoryKey]}</span>
                  <span className="text-xs font-black text-slate-800 italic">
                    {typeof item[chartConfig.dataKey] === 'number' 
                      ? item[chartConfig.dataKey].toLocaleString('pt-BR') 
                      : item[chartConfig.dataKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Dados - Sem sombras ou arredondamento excessivo */}
      <div className="border border-slate-200 rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-100 last:border-none">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-3 text-sm ${col.className || ''}`}>
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rodapé de Página */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center opacity-50">
        <p className="text-[9px] font-black uppercase tracking-widest">© 2026 EggTrack Elite - Documento Oficial Analítico</p>
        <p className="text-[9px] font-black uppercase tracking-widest"> Fazenda: {mounted ? window.location.hostname : 'EggTrack'} </p>
      </div>

      </div>

      <style jsx global>{`
        @page {
          size: A4;
          margin: 15mm;
        }
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
