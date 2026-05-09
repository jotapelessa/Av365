'use client';

import React from 'react';
import { Wallet, CreditCard, Banknote, Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { DashboardItem } from '@/components/dashboard/DashboardClient';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface LiquidityMapProps {
  accounts: Account[];
}

export default function LiquidityMap({ accounts }: LiquidityMapProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'BANK': return <Landmark size={18} />;
      case 'CASH': return <Wallet size={18} />;
      case 'EQUITY': return <Banknote size={18} />;
      default: return <CreditCard size={18} />;
    }
  };

  const getAccountColor = (index: number) => {
    const colors = [
      'bg-indigo-50 text-indigo-600 border-indigo-100',
      'bg-emerald-50 text-emerald-600 border-emerald-100',
      'bg-rose-50 text-rose-600 border-rose-100',
      'bg-amber-50 text-amber-600 border-amber-100',
      'bg-slate-50 text-slate-600 border-slate-100',
    ];
    return colors[index % colors.length];
  };

  return (
    <DashboardItem>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Mapa de <span className="text-rose-600 italic">Liquidez</span></h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponibilidade por Conta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((account, index) => (
          <div 
            key={account.id}
            className="p-5 bg-white border border-slate-100 rounded-[18px] hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all group-hover:scale-110 ${getAccountColor(index)}`}>
                {getAccountIcon(account.type)}
              </div>
              <div className="flex items-center gap-1">
                {account.balance >= 0 ? (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={10} /> Ativo
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-full">
                    <ArrowDownLeft size={10} /> Passivo
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{account.type === 'CASH' ? 'Disponibilidade Física' : 'Instituição Bancária'}</p>
              <h4 className="text-sm font-black text-slate-900 mb-2 truncate group-hover:text-rose-600 transition-colors">{account.name}</h4>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                <span className="text-xs text-slate-400 font-normal mr-1">R$</span>
                {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full p-10 border-2 border-dashed border-slate-100 rounded-[18px] flex flex-col items-center justify-center text-center">
            <Landmark size={32} className="text-slate-200 mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhuma conta cadastrada</p>
          </div>
        )}
      </div>
    </DashboardItem>
  );
}
