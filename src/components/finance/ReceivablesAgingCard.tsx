'use client';

import React from 'react';
import { Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { DashboardItem } from '@/components/dashboard/DashboardClient';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';

interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
  saleId: string | null;
}

interface ReceivablesAgingCardProps {
  installments: Installment[];
}

export default function ReceivablesAgingCard({ installments }: ReceivablesAgingCardProps) {
  const today = startOfDay(new Date());
  const next7Days = addDays(today, 7);
  const next30Days = addDays(today, 30);
  const next60Days = addDays(today, 60);

  // Apenas parcelas de VENDAS (recebíveis) pendentes
  const receivables = installments.filter(i => !!i.saleId && i.status === 'PENDING');

  const getAmountInRange = (start: Date, end: Date) => {
    return receivables
      .filter(i => {
        const dueDate = new Date(i.dueDate);
        return (isAfter(dueDate, start) || dueDate.getTime() === start.getTime()) && isBefore(dueDate, end);
      })
      .reduce((acc, i) => acc + Number(i.amount), 0);
  };

  const agingData = [
    { label: 'Próximos 7 Dias', amount: getAmountInRange(today, next7Days), color: 'emerald', icon: <Clock size={14} /> },
    { label: '8 a 30 Dias', amount: getAmountInRange(next7Days, next30Days), color: 'indigo', icon: <Calendar size={14} /> },
    { label: 'Acima de 30 Dias', amount: getAmountInRange(next30Days, next60Days), color: 'amber', icon: <ArrowRight size={14} /> },
  ];

  const totalPending = agingData.reduce((acc, d) => acc + d.amount, 0);

  return (
    <DashboardItem className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Maturidade de <span className="text-emerald-600 italic">Recebíveis</span></h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previsão de Caixa Futuro</p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[12px] flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
      </div>

      <div className="space-y-6">
        {agingData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full bg-${data.color}-50 text-${data.color}-600`}>
                  {data.icon}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{data.label}</span>
              </div>
              <span className={`text-sm font-black text-${data.color}-600`}>
                R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${data.color}-500 rounded-full transition-all duration-1000`}
                style={{ width: `${totalPending > 0 ? (data.amount / totalPending) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total a Receber</p>
        <p className="text-lg font-black text-slate-900 tracking-tight">
          <span className="text-xs text-slate-400 font-normal mr-1">R$</span>
          {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </DashboardItem>
  );
}
