'use client';

import React, { useState } from 'react';
import { 
  Search,
  Printer, 
  Download
} from "lucide-react";
import LuxuryKpiCard from "@/components/ui/LuxuryKpiCard";
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import ReportHeader from "./ReportHeader";

interface ReportKpi {
  title: string;
  value: string;
  icon: any;
  trend?: string;
}

interface UniversalReportViewerProps {
  title: string;
  subtitle: string;
  reportType: string; // Adicionado para suporte à impressão dedicada
  kpis: ReportKpi[];
  columns: any[];
  data: any[];
  onExport?: (format: 'pdf' | 'excel') => void;
  isLoading?: boolean;
}

export default function UniversalReportViewer({
  title,
  subtitle,
  reportType,
  kpis,
  columns,
  data,
  onExport,
  isLoading = false
}: UniversalReportViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.open(`/reports/${reportType}/print`, '_blank');
    }
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Estilizado para Relatórios */}
      <ReportHeader title={title} subtitle={subtitle} />

      {/* Toolbar Superior */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 no-print">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Buscar nos resultados..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[14px] text-xs font-black text-slate-900 placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-[14px] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Printer size={16} /> Imprimir PDF
          </button>
          <button 
            onClick={() => onExport?.('excel')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-[14px] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* KPIs (A "pitada" de Opção C) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <LuxuryKpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Tabela de Dados (Opção B) */}
      <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden print:border-none print:shadow-none">
        <LuxuryTable 
          variant="light"
          columns={columns}
          data={filteredData}
        />
      </div>

      {/* Rodapé do Relatório */}
      <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 EggTrack Elite - Relatório Analítico de Performance</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Dados Integrados</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">Geração em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
