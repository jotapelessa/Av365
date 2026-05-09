'use client';

import React from 'react';
import { CalendarDays } from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";

interface AdminBillingListClientProps {
  subscriptions: any[];
}

export default function AdminBillingListClient({ subscriptions }: AdminBillingListClientProps) {
  return (
    <LuxuryTable 
      variant="light"
      columns={[
        {
          key: 'producer',
          header: 'Produtor',
          render: (sub) => (
            <div>
              <p className="text-sm font-black text-slate-800 italic">{sub.producer.name}</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">ID: {sub.id.slice(0, 8)}</p>
            </div>
          )
        },
        {
          key: 'plan',
          header: 'Plano / MRR',
          render: (sub) => (
            <div>
              <p className="text-sm font-black text-slate-900 italic">R$ {Number(sub.plan.priceMonthly).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{sub.plan.name}</p>
            </div>
          )
        },
        {
          key: 'status',
          header: 'Status',
          render: (sub) => (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
              sub.status === 'ACTIVE' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
              {sub.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}
            </div>
          )
        },
        {
          key: 'nextCycle',
          header: 'Próximo Ciclo',
          className: 'text-right',
          render: (sub) => (
            <div className="flex items-center justify-end gap-2 text-slate-400 font-black">
              <CalendarDays size={14} className="text-indigo-400" />
              <span className="text-[10px] uppercase tracking-widest tabular-nums">
                {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('pt-BR') : 'Sem data'}
              </span>
            </div>
          )
        }
      ]}
      data={subscriptions}
    />
  );
}
