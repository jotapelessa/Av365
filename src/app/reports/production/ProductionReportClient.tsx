'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface ProductionReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function ProductionReportClient({ kpis, tableData }: ProductionReportClientProps) {
  const columns = [
    {
      key: 'name',
      header: 'Identificação do Lote',
      render: (row: any) => (
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.breed}</p>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Plantel Atual',
      render: (row: any) => (
        <p className="text-sm font-black text-slate-700 italic">{row.quantity.toLocaleString('pt-BR')} aves</p>
      )
    },
    {
      key: 'layRate',
      header: 'Taxa Postura (30d)',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black italic ${row.layRate >= 90 ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {row.layRate.toFixed(1)}%
          </span>
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${row.layRate >= 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${row.layRate}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'fcr',
      header: 'Conversão Alimentar',
      render: (row: any) => (
        <p className="text-[11px] font-black text-slate-900 tracking-tight">
          {row.fcr.toFixed(3)} <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">kg/dz</span>
        </p>
      )
    },
    {
      key: 'mortality',
      header: 'Mortalidade',
      className: 'text-right',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          row.mortality > 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
        }`}>
          {row.mortality} aves
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Eficiência Produtiva"
      subtitle="Análise de Desempenho e Conversão"
      reportType="production"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
