'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FlocksReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function FlocksReportClient({ kpis, tableData }: FlocksReportClientProps) {
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
      key: 'acquisitionDate',
      header: 'Data de Chegada',
      render: (row: any) => (
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {format(new Date(row.acquisitionDate), "dd/MM/yyyy", { locale: ptBR })}
        </p>
      )
    },
    {
      key: 'houses',
      header: 'Alojamento (Galpões)',
      render: (row: any) => (
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight max-w-[150px] truncate">
          {row.houses}
        </p>
      )
    },
    {
      key: 'status',
      header: 'Estado de Produção',
      className: 'text-right',
      render: () => (
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest border border-indigo-100">
          PRODUÇÃO ATIVA
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Resumo de Lotes"
      subtitle="Visão Consolidada do Plantel Ativo"
      reportType="flocks"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
