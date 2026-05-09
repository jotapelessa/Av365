'use client';

import { DashboardCard } from './DashboardGrid';
import { DashboardGrid } from './DashboardGridContainer';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  PieChart,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface FinancialStats {
  monthlyRevenue: number;
  monthlyExpenses: number;
  currentBalance: number;
}

export function FinancialPerformanceHub({ stats }: { stats: FinancialStats }) {
  const margin = stats.monthlyRevenue > 0 
    ? ((stats.monthlyRevenue - stats.monthlyExpenses) / stats.monthlyRevenue) * 100 
    : 0;

  return (
    <DashboardGrid className="gap-8" auditId="dashboard__section__financial">
      {/* Principal: Fluxo de Caixa */}
      <DashboardCard 
        span={8} 
        auditId="dashboard__financial__cash-flow"
        className="bento-card-elite bg-white border border-slate-50 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <DollarSign size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-indigo-50 text-primary">
                <PieChart size={24} />
              </div>
              <div>
                <h2 
                  data-audit="dashboard__financial__title"
                  className="text-2xl font-black text-slate-900 tracking-tight italic leading-none"
                >
                  Fluxo de Caixa
                </h2>
                <p 
                  data-audit="dashboard__financial__subtitle"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1"
                >
                  Consolidado Mensal
                </p>
              </div>
            </div>
            
            <Link 
              href="/finance" 
              data-audit="dashboard__financial__link-explore"
              className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-audit="dashboard__financial__metrics-grid">
            <div className="space-y-2 min-w-0" data-audit="dashboard__financial__metric-revenue">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                  <ArrowUpRight size={12} />
                </span>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Receita Bruta</p>
              </div>
              <p className="text-stat text-slate-900 kpi-value-fluid" data-audit="dashboard__financial__value-revenue">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.monthlyRevenue)}
              </p>
            </div>
            
            <div className="space-y-2 border-l border-slate-100 pl-6 min-w-0" data-audit="dashboard__financial__metric-expenses">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                  <ArrowDownRight size={12} />
                </span>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Despesas Totais</p>
              </div>
              <p className="text-stat text-slate-900 kpi-value-fluid" data-audit="dashboard__financial__value-expenses">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.monthlyExpenses)}
              </p>
            </div>
            
            <div className="space-y-2 border-l border-slate-100 pl-8 min-w-0" data-audit="dashboard__financial__metric-balance">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-50 text-primary">
                  <CreditCard size={12} />
                </span>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Saldo Líquido</p>
              </div>
              <p className="text-stat text-primary italic underline decoration-indigo-200 underline-offset-8 kpi-value-fluid" data-audit="dashboard__financial__value-balance">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.currentBalance)}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Insight: Margem Operacional */}
      <DashboardCard 
        span={4} 
        auditId="dashboard__financial__margin"
        className="bento-card-elite bg-indigo-600 text-white relative overflow-hidden group"
      >
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <TrendingUp size={180} fill="white" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col">
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2" data-audit="dashboard__financial__margin-label">Análise de Eficiência</p>
          <h3 className="text-xl font-black italic leading-tight mb-6" data-audit="dashboard__financial__margin-title">Margem <br/>Operacional</h3>
          
          <div className="mt-auto space-y-4">
            <div className="p-5 rounded-md bg-white/10 backdrop-blur-md border border-white/10" data-audit="dashboard__financial__margin-indicator">
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-black italic" data-audit="dashboard__financial__margin-value">{margin.toFixed(1)}%</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Status: {margin > 20 ? 'Excelente' : 'Atenção'}</p>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000" 
                  style={{ width: `${Math.min(margin, 100)}%` }}
                />
              </div>
            </div>
            
            <Link 
              href="/finance" 
              data-audit="dashboard__financial__link-dre"
              className="flex items-center justify-between w-full p-4 rounded-md bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
            >
              Explorar DRE <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </DashboardCard>
    </DashboardGrid>
  );
}
