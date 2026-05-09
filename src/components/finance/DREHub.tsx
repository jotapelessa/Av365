'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  ArrowRight,
  DollarSign,
  PieChart,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DREHubProps {
  data: {
    grossRevenue: number;
    variableCosts: {
      feed: number;
      flocks: number;
      utilities: number;
    };
    fixedCosts: {
      labor: number;
      maintenance: number;
      others: number;
    };
    bioIndicators: {
      totalBirds: number;
      activeFlocks: number;
      costPerBird: number;
    };
  };
}

export default function DREHub({ data }: DREHubProps) {
  const totalVariableCosts = data.variableCosts.feed + data.variableCosts.flocks + data.variableCosts.utilities;
  const contributionMargin = data.grossRevenue - totalVariableCosts;
  const marginPercentage = data.grossRevenue > 0 ? (contributionMargin / data.grossRevenue) * 100 : 0;
  
  const totalFixedCosts = data.fixedCosts.labor + data.fixedCosts.maintenance + data.fixedCosts.others;
  const ebitda = contributionMargin - totalFixedCosts;
  const netMargin = data.grossRevenue > 0 ? (ebitda / data.grossRevenue) * 100 : 0;

  const Row = ({ label, value, type = 'normal', isPositive = true }: any) => (
    <div className={`flex items-center justify-between py-4 border-b border-slate-50 last:border-0 ${type === 'total' ? 'mt-2 pt-6 border-t-2 border-slate-900' : ''}`}>
      <span className={`text-[11px] font-black uppercase tracking-widest ${type === 'total' ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
      <div className="text-right">
        <span className={`text-sm font-black ${
          type === 'total' 
            ? (ebitda >= 0 ? 'text-emerald-600' : 'text-rose-600') 
            : (type === 'subtotal' ? 'text-slate-900' : 'text-slate-600')
        }`}>
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[6px] border border-white/20 p-10 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Gestão de Resultados</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
            DRE <span className="text-primary font-normal not-italic">Simplificado</span>
          </h2>
        </div>
        <div className="w-12 h-12 rounded-[6px] bg-indigo-50 text-primary flex items-center justify-center">
          <PieChart size={20} />
        </div>
      </div>

      <div className="space-y-1">
        {/* RECEITA */}
        <Row label="Receita Bruta Operacional" value={data.grossRevenue} type="subtotal" />
        
        {/* CUSTOS VARIÁVEIS */}
        <div className="py-2 ml-4">
          <Row label="(-) Insumos & Ração" value={-data.variableCosts.feed} />
          <Row label="(-) Aquisição de Aves" value={-data.variableCosts.flocks} />
          <Row label="(-) Energia & Água" value={-data.variableCosts.utilities} />
        </div>
        
        <div className="flex items-center justify-between py-4 bg-slate-50/50 px-4 rounded-md mb-4">
          <div className="flex items-center gap-2">
            <Percent size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Margem de Contribuição</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">R$ {contributionMargin.toLocaleString('pt-BR')}</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{marginPercentage.toFixed(1)}% da receita</p>
          </div>
        </div>

        {/* DESPESAS FIXAS */}
        <div className="py-2 ml-4">
          <Row label="(-) Mão de Obra" value={-data.fixedCosts.labor} />
          <Row label="(-) Manutenção" value={-data.fixedCosts.maintenance} />
          <Row label="(-) Outras Despesas" value={-data.fixedCosts.others} />
        </div>

        {/* RESULTADO FINAL */}
        <Row label="Lucro Líquido Operacional (EBITDA)" value={ebitda} type="total" />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-[6px]">
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ponto de Equilíbrio</p>
          <p className="text-lg font-black text-slate-900">R$ {(totalFixedCosts / (marginPercentage/100 || 1)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[6px]">
          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Margem Líquida</p>
          <p className="text-lg font-black text-slate-900">{netMargin.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-4 p-5 bg-slate-900 rounded-[6px] text-white">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Indicadores Biológicos</p>
          <Target size={14} className="text-rose-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Plantel Ativo</p>
            <p className="text-sm font-black">{data.bioIndicators.totalBirds.toLocaleString('pt-BR')} aves</p>
          </div>
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Custo / Cabeça</p>
            <p className="text-sm font-black text-rose-500">R$ {data.bioIndicators.costPerBird.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
