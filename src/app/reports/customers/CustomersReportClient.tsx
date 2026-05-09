'use client';

import React from 'react';
import UniversalReportViewer from "@/components/reports/UniversalReportViewer";

interface CustomersReportClientProps {
  kpis: any[];
  tableData: any[];
}

export default function CustomersReportClient({ kpis, tableData }: CustomersReportClientProps) {
  const columns = [
    {
      key: 'name',
      header: 'Cliente / Parceiro',
      render: (row: any) => (
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{row.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.taxId}</p>
        </div>
      )
    },
    {
      key: 'count',
      header: 'Volume de Pedidos',
      render: (row: any) => (
        <p className="text-sm font-bold text-slate-500 tracking-tight">{row.count} vendas</p>
      )
    },
    {
      key: 'revenue',
      header: 'Faturamento Total (R$)',
      render: (row: any) => (
        <p className="text-sm font-black text-emerald-600 italic">R$ {row.revenue.toLocaleString('pt-BR')}</p>
      )
    },
    {
      key: 'avgTicket',
      header: 'Ticket Médio',
      render: (row: any) => (
        <p className="text-[11px] font-black text-slate-900 tracking-tight">R$ {row.avgTicket.toLocaleString('pt-BR')}</p>
      )
    },
    {
      key: 'rank',
      header: 'Nível de Fidelidade',
      className: 'text-right',
      render: (row: any, index: number) => (
        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
          index < 3 ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-400'
        }`}>
          {index < 3 ? 'VIP' : 'PADRÃO'}
        </span>
      )
    }
  ];

  return (
    <UniversalReportViewer 
      title="Ranking de Clientes"
      subtitle="Análise Comercial e Fidelização"
      reportType="customers"
      kpis={kpis}
      columns={columns}
      data={tableData}
    />
  );
}
