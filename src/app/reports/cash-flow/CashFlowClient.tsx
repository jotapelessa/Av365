'use client';

import ReportHeader from "@/components/reports/ReportHeader";
import { Printer, ArrowLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";

interface CashFlowClientProps {
  sales: any[];
  expenses: any[];
  totalIn: number;
  totalOut: number;
  netFlow: number;
}

export default function CashFlowClient({ 
  sales, 
  expenses,
  totalIn,
  totalOut,
  netFlow
}: CashFlowClientProps) {
  return (
    <div className="bg-white min-h-screen p-4 md:p-10">
      {/* HEADER DE NAVEGAÇÃO (ESCONDIDO NA IMPRESSÃO) */}
      <div className="no-print flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
        <Link 
          href="/reports"
          className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para Relatórios
        </Link>
        
        <button 
          onClick={() => typeof window !== 'undefined' && window.open('/reports/cash-flow/print', '_blank')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-[14px] font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Printer size={16} /> Imprimir / Gerar PDF
        </button>
      </div>

      {/* CONTEÚDO DO RELATÓRIO (SERÁ O PDF) */}
      <div className="max-w-4xl mx-auto">
        <ReportHeader 
          title="Fluxo de Caixa Consolidado" 
          subtitle="Análise Tática de Receitas e Despesas" 
        />

        {/* KPI GRID PARA PDF */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-[20px] bg-slate-50 border border-slate-100 avoid-break">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Entradas Totais</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 italic">R$ {totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
          </div>
          <div className="p-6 rounded-[20px] bg-slate-50 border border-slate-100 avoid-break">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Saídas Totais</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 italic">R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <TrendingDown size={20} className="text-rose-500" />
            </div>
          </div>
          <div className="p-6 rounded-[20px] bg-indigo-600 text-white shadow-xl shadow-indigo-100 avoid-break">
            <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-2">Fluxo Líquido</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black italic">R$ {netFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* TABELA DE MOVIMENTAÇÕES PARA PDF */}
        <div className="avoid-break mb-10">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
             Detalhamento de Operações <span className="h-[2px] flex-1 bg-slate-100" />
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s: any) => (
                <tr key={s.id} className="border-b border-slate-50">
                  <td className="py-4 text-[11px] font-bold text-slate-600">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4 text-[11px] font-black text-slate-900">{s.description || `Venda: ${s.product}`}</td>
                  <td className="py-4 text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">Receita</td>
                  <td className="py-4 text-right text-[11px] font-black text-emerald-600 italic">+ R$ {Number(s.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {expenses.map((e: any) => (
                <tr key={e.id} className="border-b border-slate-50">
                  <td className="py-4 text-[11px] font-bold text-slate-600">{new Date(e.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4 text-[11px] font-black text-slate-900">{e.description || e.category}</td>
                  <td className="py-4 text-[11px] font-bold text-rose-500 uppercase tracking-tighter">Despesa</td>
                  <td className="py-4 text-right text-[11px] font-black text-rose-500 italic">- R$ {Number(e.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RODAPÉ DO PDF */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between opacity-50">
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">AV365 Elite Dashboard - Todos os direitos reservados</p>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Página 1 de 1</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          body { background-color: #f8fafc; }
        }
        @media print {
          .no-print { display: none !important; }
          .avoid-break { break-inside: avoid; }
        }
      `}} />
    </div>
  );
}
