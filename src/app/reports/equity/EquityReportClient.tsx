'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface EquityReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function EquityReportClient({ kpis, tableData }: EquityReportClientProps) {
  const columns = [
    {
      key: 'category',
      header: 'Categoria de Ativo',
      render: (row: any) => (
        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.category}</p>
      )
    },
    {
      key: 'description',
      header: 'Descrição do Grupo',
      render: (row: any) => (
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{row.description}</p>
      )
    },
    {
      key: 'type',
      header: 'Classificação',
      render: (row: any) => (
        <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
          {row.type}
        </span>
      )
    },
    {
      key: 'value',
      header: 'Valor Consolidado (R$)',
      className: 'text-right',
      render: (row: any) => (
        <p className="text-sm font-black text-indigo-600 italic">R$ {row.value.toLocaleString('pt-BR')}</p>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Snapshot Patrimonial"
      subtitle="Balanço Consolidado de Ativos"
      reportType="equity"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
