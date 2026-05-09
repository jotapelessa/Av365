'use client';

import React from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  Building2, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  MoreVertical,
  PiggyBank,
  DollarSign
} from 'lucide-react';
import { DashboardContainer, DashboardItem } from '@/components/dashboard/DashboardClient';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { LuxuryTable } from '@/components/ui/LuxuryTable';
import UserNav from '@/components/layout/UserNav';
import AccountModal from './AccountModal';
import TransferModal from './TransferModal';

interface AccountsDashboardClientProps {
  accounts: any[];
  transfers: any[];
  totalBalance: number;
}

export default function AccountsDashboardClient({
  accounts,
  transfers,
  totalBalance
}: AccountsDashboardClientProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<any>(null);

  const openAccountModal = (acc: any = null) => {
    setSelectedAccount(acc);
    setIsAccountModalOpen(true);
  };
  return (
    <DashboardContainer>
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Gestão Patrimonial</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <PiggyBank size={10} /> Disponibilidades
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Gerenciador de <span className="text-primary italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Contas</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Administre seus saldos bancários, caixas internos e transferências.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <LuxuryButton 
            variant="primary"
            icon="plus"
            onClick={() => openAccountModal()}
          >
            Nova Conta
          </LuxuryButton>
          <LuxuryButton 
            variant="outline"
            icon="arrow-left-right"
            onClick={() => setIsTransferModalOpen(true)}
          >
            Transferência
          </LuxuryButton>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          <UserNav />
        </div>
      </DashboardItem>

      <DashboardItem className="mb-10">
        <DashboardGrid cols={4}>
          <div className="ui-card">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-md">
                <PiggyBank size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Saldo Consolidado</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              R$ {totalBalance.toLocaleString('pt-BR')}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase tracking-widest leading-none">Liquidez Total</p>
          </div>

          <div className="ui-card">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                <Building2 size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bancos</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              R$ {accounts.filter((a: any) => a.type === 'BANK').reduce((acc: number, c: any) => acc + c.balance, 0).toLocaleString('pt-BR')}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase tracking-widest leading-none">Saldos Institucionais</p>
          </div>

          <div className="ui-card">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
                <Wallet size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Caixas</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              R$ {accounts.filter((a: any) => a.type === 'CASH').reduce((acc: number, c: any) => acc + c.balance, 0).toLocaleString('pt-BR')}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase tracking-widest leading-none">Dinheiro em Espécie / Sede</p>
          </div>
        </DashboardGrid>
      </DashboardItem>

      <DashboardItem className="mb-12">
        <div className="ui-card !p-0 overflow-hidden bg-white border-slate-100">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Contas <span className="text-primary italic">Ativas</span>
              <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg border border-slate-100">{accounts.length}</span>
            </h2>
          </div>
          
          <LuxuryTable 
            columns={[
              {
                key: 'name',
                header: 'Instituição / Conta',
                render: (acc) => (
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-md flex items-center justify-center shadow-sm border ${
                      acc.type === 'BANK' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {acc.type === 'BANK' ? <Building2 size={20} /> : <Wallet size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-tight">{acc.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{acc.type}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'balance',
                header: 'Saldo Atual',
                className: 'text-right',
                render: (acc) => (
                  <div className="text-right">
                    <p className={`text-lg font-black ${acc.balance >= 0 ? 'text-slate-900' : 'text-danger'}`}>
                      R$ {acc.balance.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Atualizado agora</p>
                  </div>
                )
              },
              {
                key: 'actions',
                header: '',
                className: 'w-20',
                render: (acc) => (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => openAccountModal(acc)}
                      className="p-2 hover:bg-slate-50 rounded-md text-slate-400 hover:text-primary transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                )
              }
            ]}
            data={accounts}
          />
        </div>
      </DashboardItem>

      <DashboardItem>
        <div className="ui-card !p-0 overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Movimentação <span className="text-primary italic">Interna</span>
            </h2>
            <Link href="/finance/transfers" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Histórico Completo</Link>
          </div>
          
          <LuxuryTable 
            columns={[
              {
                key: 'transfer',
                header: 'Fluxo de Origem & Destino',
                render: (tr) => (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <TrendingDown size={14} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">{tr.fromAccount?.name}</p>
                    </div>
                    
                    <ArrowRightLeft size={14} className="text-primary animate-pulse" />
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/5 flex items-center justify-center text-success border border-success/10">
                        <TrendingUp size={14} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">{tr.toAccount?.name}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'amount',
                header: 'Valor Transacionado',
                className: 'text-right',
                render: (tr) => (
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">R$ {tr.amount.toLocaleString('pt-BR')}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(tr.date).toLocaleDateString()}
                    </p>
                  </div>
                )
              }
            ]}
            data={transfers}
          />
        </div>
      </DashboardItem>

      <AccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        account={selectedAccount}
      />

      <TransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={accounts}
      />
    </DashboardContainer>
  );
}
