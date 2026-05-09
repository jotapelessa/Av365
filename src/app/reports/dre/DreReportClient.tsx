'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface DreReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function DreReportClient({ kpis, tableData }: DreReportClientProps) {
  const columns = [
    {
      key: 'period',
      header: 'Período Mensal',
      render: (row: any) => (
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{row.period}</p>
      )
    },
    {
      key: 'revenue',
      header: 'Faturamento (R$)',
      render: (row: any) => (
        <p className="text-sm font-black text-emerald-600 italic">R$ {row.revenue.toLocaleString('pt-BR')}</p>
      )
    },
    {
      key: 'expenses',
      header: 'Custos (R$)',
      render: (row: any) => (
        <p className="text-sm font-bold text-rose-500 tracking-tighter">R$ {row.expenses.toLocaleString('pt-BR')}</p>
      )
    },
    {
      key: 'profit',
      header: 'Resultado (R$)',
      render: (row: any) => (
        <p className={`text-sm font-black italic tracking-tighter ${row.profit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
          R$ {row.profit.toLocaleString('pt-BR')}
        </p>
      )
    },
    {
      key: 'margin',
      header: 'Margem (%)',
      className: 'text-right',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          row.margin >= 30 ? 'bg-emerald-50 text-emerald-600' : 
          row.margin >= 10 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {row.margin.toFixed(1)}%
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="DRE Simplificado"
      subtitle="Demonstrativo de Resultados do Exercício"
      reportType="dre"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
