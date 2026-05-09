'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface EmployeesReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function EmployeesReportClient({ kpis, tableData }: EmployeesReportClientProps) {
  const columns = [
    {
      key: 'name',
      header: 'Operador / Colaborador',
      render: (row: any) => (
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.email}</p>
        </div>
      )
    },
    {
      key: 'total',
      header: 'Tarefas Atribuídas',
      render: (row: any) => (
        <p className="text-sm font-bold text-slate-500 tracking-tight">{row.total} totais</p>
      )
    },
    {
      key: 'completed',
      header: 'Concluídas',
      render: (row: any) => (
        <p className="text-sm font-black text-emerald-600 italic">{row.completed} concluídas</p>
      )
    },
    {
      key: 'rate',
      header: 'Eficiência (%)',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black italic ${row.rate >= 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {row.rate.toFixed(1)}%
          </span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${row.rate >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${row.rate}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'performance',
      header: 'Avaliação',
      className: 'text-right',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
          row.rate >= 90 ? 'bg-emerald-50 text-emerald-600' : 
          row.rate >= 60 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {row.rate >= 90 ? 'ELITE' : row.rate >= 60 ? 'BOM' : 'REVISÃO'}
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Desempenho de Equipe"
      subtitle="Métricas de Produtividade e Operação"
      reportType="employees"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
