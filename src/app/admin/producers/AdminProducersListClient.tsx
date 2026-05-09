'use client';

import React from 'react';
import { Calendar } from "lucide-react";
import Link from "next/link";
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import { ProducerActions } from "./ProducerActions";

interface AdminProducersListClientProps {
  producers: any[];
}

export default function AdminProducersListClient({ producers }: AdminProducersListClientProps) {
  return (
    <LuxuryTable 
      variant="light"
      columns={[
        { 
          key: 'name', 
          header: 'Produtor / Empresa',
          render: (producer) => (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 group-hover:scale-110 transition-all shadow-sm">
                {producer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <Link href={`/admin/producers/${producer.id}`} className="block group/link">
                  <p className="font-black text-slate-800 text-sm group-hover/link:text-indigo-600 transition-colors tracking-tight italic">{producer.name}</p>
                </Link>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-tight">{producer.users[0]?.email || 'Sem usuário'}</p>
              </div>
            </div>
          )
        },
        {
          key: 'plan',
          header: 'Plano',
          render: (producer) => (
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
              {producer.subscription?.plan?.name || 'Iniciante'}
            </span>
          )
        },
        {
          key: 'status',
          header: 'Status',
          render: (producer) => {
            const status = producer.subscription?.status || 'INACTIVE';
            return (
              <div className={`
                inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border
                ${status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                  status === 'PAUSED' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                  'text-rose-600 bg-rose-50 border-rose-100'}
              `}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                {status === 'ACTIVE' ? 'Operante' : status}
              </div>
            );
          }
        },
        {
          key: 'expiry',
          header: 'Vencimento',
          render: (producer) => (
            <div className="flex items-center gap-2 text-slate-400 font-black">
              <Calendar size={14} className="text-indigo-400" />
              <span className="text-[10px] uppercase tracking-widest tabular-nums">
                {producer.subscription?.currentPeriodEnd ? new Date(producer.subscription.currentPeriodEnd).toLocaleDateString('pt-BR') : 'N/A'}
              </span>
            </div>
          )
        },
        {
          key: 'actions',
          header: 'Ações',
          className: 'text-right',
          render: (producer) => (
            <ProducerActions 
              producerId={producer.id} 
              status={producer.subscription?.status || 'INACTIVE'} 
            />
          )
        }
      ]}
      data={producers}
    />
  );
}
