'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HealthReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function HealthReportClient({ kpis, tableData }: HealthReportClientProps) {
  const columns = [
    {
      key: 'flock',
      header: 'Lote Afetado',
      render: (row: any) => (
        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.flock}</p>
      )
    },
    {
      key: 'type',
      header: 'Tipo de Alerta',
      render: (row: any) => (
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.type}</p>
      )
    },
    {
      key: 'severity',
      header: 'Gravidade',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
          row.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
          row.severity === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {row.severity}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status Atual',
      render: (row: any) => (
        <p className={`text-[10px] font-black uppercase tracking-widest ${row.status === 'ATIVO' ? 'text-rose-500' : 'text-emerald-500'}`}>
          {row.status}
        </p>
      )
    },
    {
      key: 'date',
      header: 'Data do Registro',
      className: 'text-right',
      render: (row: any) => (
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {format(new Date(row.date), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Mapa de Sanidade"
      subtitle="Monitoramento de Alertas e Saúde Animal"
      reportType="health"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
