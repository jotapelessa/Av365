'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface SilosReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function SilosReportClient({ kpis, tableData }: SilosReportClientProps) {
  const columns = [
    {
      key: 'name',
      header: 'Identificação do Silo',
      render: (row: any) => (
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.feedType}</p>
        </div>
      )
    },
    {
      key: 'capacity',
      header: 'Capacidade (t)',
      render: (row: any) => (
        <p className="text-sm font-bold text-slate-500 tracking-tight">{row.capacity.toLocaleString('pt-BR')} t</p>
      )
    },
    {
      key: 'currentStock',
      header: 'Estoque Atual (t)',
      render: (row: any) => (
        <p className={`text-sm font-black italic ${row.status === 'CRÍTICO' ? 'text-rose-600' : 'text-slate-900'}`}>
          {row.currentStock.toLocaleString('pt-BR')} t
        </p>
      )
    },
    {
      key: 'occupancy',
      header: 'Nível de Ocupação',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black italic ${row.occupancy < 15 ? 'text-rose-600' : 'text-slate-900'}`}>
            {row.occupancy.toFixed(1)}%
          </span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${row.occupancy < 15 ? 'bg-rose-500' : 'bg-primary'}`}
              style={{ width: `${row.occupancy}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Estado Logístico',
      className: 'text-right',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
          row.status === 'CRÍTICO' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Inventário de Silos"
      subtitle="Controle de Insumos e Armazenagem"
      reportType="silos"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
