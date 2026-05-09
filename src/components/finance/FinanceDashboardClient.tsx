'use client';

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { TrendingUp, DollarSign, FileText, Plus, ChevronRight } from 'lucide-react';
import LuxuryKpiCard from '@/components/ui/LuxuryKpiCard';
import { LuxuryTable } from '@/components/ui/LuxuryTable';
import FinanceChart from '@/components/finance/FinanceChart';
import UserNav from '@/components/layout/UserNav';
import DREHub from '@/components/finance/DREHub';
import LiquidityMap from '@/components/finance/LiquidityMap';
import ReceivablesAgingCard from '@/components/finance/ReceivablesAgingCard';
import { seedTestData, clearFinancialData } from '@/app/finance/actions';

interface FinanceDashboardClientProps {
  sales: any[];
  expenses: any[];
  installments: any[];
  accounts: any[];
  flocks: any[];
  stats: {
    totalSales: number;
    totalExpenses: number;
    currentBalance: number;
    projectedBalance: number;
    totalEquity: number;
    biologicalAssetsValue: number;
  };
  chartData: any[];
  period: string;
}

export default function FinanceDashboardClient({
  sales,
  expenses,
  installments,
  accounts,
  flocks,
  stats,
  chartData,
  period
}: FinanceDashboardClientProps) {
  // Cálculos para o DRE
  const totalBirds = flocks.reduce((acc, f) => acc + (f.quantity || 0), 0);
  
  const dreData = {
    grossRevenue: stats.totalSales,
    variableCosts: {
      feed: expenses.filter(e => e.category === 'FEED' || e.category === 'MEDICINE').reduce((acc, e) => acc + Number(e.amount), 0),
      flocks: expenses.filter(e => e.description?.toLowerCase().includes('lote') || e.description?.toLowerCase().includes('aquisição')).reduce((acc, e) => acc + Number(e.amount), 0),
      utilities: expenses.filter(e => e.category === 'ENERGY').reduce((acc, e) => acc + Number(e.amount), 0),
    },
    fixedCosts: {
      labor: expenses.filter(e => e.category === 'LABOR').reduce((acc, e) => acc + Number(e.amount), 0),
      maintenance: expenses.filter(e => e.category === 'MAINTENANCE').reduce((acc, e) => acc + Number(e.amount), 0),
      others: expenses.filter(e => e.category === 'OTHER').reduce((acc, e) => acc + Number(e.amount), 0),
    },
    bioIndicators: {
      totalBirds,
      activeFlocks: flocks.length,
      costPerBird: totalBirds > 0 ? (expenses.reduce((acc, e) => acc + Number(e.amount), 0) / totalBirds) : 0
    }
  };


  return (
    <div className="space-y-10">
      <div className="flex justify-end mb-12">
        <UserNav />
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-[6px] flex items-center justify-center shadow-2xl shadow-slate-200 rotate-3">
              <TrendingUp size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Cockpit Financeiro</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <DollarSign size={10} /> Governança Operacional
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Fluxo de <span className="text-rose-600 italic">Elite</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[6px] shadow-sm self-start">
            {[
              { id: '30days', label: '30 Dias' },
              { id: 'month', label: 'Mês Atual' },
              { id: 'year', label: 'Ano Fiscal' }
            ].map(p => (
              <Link
                key={p.id}
                href={`/finance?period=${p.id}`}
                className={`px-4 py-2 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <LuxuryKpiCard 
          title="Patrimônio Total" 
          value={`R$ ${stats.totalEquity.toLocaleString('pt-BR')}`} 
          description="Liquidez + Recebíveis + Lotes" 
          icon="trending-up"
          variant="primary"
          trend="+8%" 
        />
        <LuxuryKpiCard 
          title="Liquidez Imediata" 
          value={`R$ ${stats.currentBalance.toLocaleString('pt-BR')}`} 
          description="Disponível em Contas" 
          icon="dollar"
        />
        <LuxuryKpiCard 
          title="Projetado (30d)" 
          value={`R$ ${stats.projectedBalance.toLocaleString('pt-BR')}`} 
          description="Forecast de Fluxo" 
          icon="arrow-right"
          variant="secondary"
        />
        <LuxuryKpiCard 
          title="Ativos Biológicos" 
          value={`R$ ${stats.biologicalAssetsValue.toLocaleString('pt-BR')}`} 
          description="Valor Estimado do Plantel" 
          icon="filter" 
        />
      </div>

      {/* DRE INTEGRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance <span className="text-rose-600 italic">Temporal</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realizado vs Projetado</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Realizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-black text-slate-400 uppercase">Projetado</span>
                </div>
              </div>
            </div>
            <div className="h-[350px]">
              <FinanceChart data={chartData} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Vendas <span className="text-emerald-600 italic">Recentes</span></h3>
                  <Link href="/finance/sales/new">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                      <Plus size={14} /> Nova Venda
                    </button>
                  </Link>
                </div>
                <LuxuryTable 
                  columns={[
                    { key: "date", header: "Data", render: (item) => format(new Date(item.date), "dd/MM/yy") },
                    { key: "amount", header: "Valor", render: (item) => `R$ ${Number(item.amount).toLocaleString('pt-BR')}`, className: "text-emerald-600 font-black" },
                    { key: "customer", header: "Cliente", render: (item) => <span className="text-slate-400 italic text-[10px] truncate max-w-[80px] block">{item.customer?.name || "Geral"}</span> }
                  ]}
                  data={sales.slice(0, 5)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Custos <span className="text-rose-600 italic">Recentes</span></h3>
                  <Link href="/finance/expenses/new">
                    <button className="px-4 py-2 bg-rose-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2">
                      <Plus size={14} /> Nova Despesa
                    </button>
                  </Link>
                </div>
                <LuxuryTable 
                  columns={[
                    { key: "date", header: "Data", render: (item) => format(new Date(item.date), "dd/MM/yy") },
                    { key: "amount", header: "Valor", render: (item) => `R$ ${Number(item.amount).toLocaleString('pt-BR')}`, className: "text-rose-600 font-black" },
                    { key: "status", header: "Status", render: (item) => (
                      <div className={`w-2 h-2 rounded-full ${item.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`} title={item.status === 'PAID' ? 'Pago' : 'Pendente'} />
                    )}
                  ]}
                  data={expenses.slice(0, 5)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <LiquidityMap accounts={accounts} />
          <ReceivablesAgingCard installments={installments} />
          <DREHub data={dreData} />

          <div className="bg-white p-8 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Atalhos <span className="text-rose-600 italic">Elite</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso rápido ao ERP</p>
              </div>
            </div>
            <div className="space-y-4">
              <Link href="/finance/accounts" className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[18px] hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-[6px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Gerenciar Contas</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bancos e Caixa</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/employees" className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[18px] hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-[6px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Colaboradores</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Gestão de Pessoal</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN TOOLS */}
      <div className="mt-20 pt-10 border-t border-slate-100 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-50 rounded-[6px] border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight tracking-tight italic">Ferramentas de <span className="text-primary font-normal not-italic">Stress-Test</span></h3>
            <p className="text-sm text-slate-500 font-medium max-w-md mt-2 text-balance leading-relaxed">
              Povoamento massivo de dados para validação de performance ou limpeza total do ecossistema financeiro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10">
            <button 
              className="px-6 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              onClick={async () => {
                if (confirm("Deseja povoar o sistema com dados de 5 anos? (Pode levar alguns segundos)")) {
                  await seedTestData();
                  window.location.reload();
                }
              }}
            >
              Povoar 5 Anos
            </button>
 
            <button 
              className="px-6 py-3 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              onClick={async () => {
                if (confirm("TEM CERTEZA? Isso apagará TODAS as vendas, despesas e movimentações financeiras!")) {
                  await clearFinancialData();
                  window.location.reload();
                }
              }}
            >
              Apagar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
