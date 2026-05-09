'use client';

import React, { useTransition, useState } from 'react';
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import { togglePlanStatus } from "./actions";
import { toast } from "sonner";
import { Power, Edit3, MoreHorizontal, Users, BarChart3, ShieldCheck } from "lucide-react";
import PlanEditModal from './PlanEditModal';

interface AdminPlansListClientProps {
  plans: any[];
}

export default function AdminPlansListClient({ plans }: AdminPlansListClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await togglePlanStatus(id, currentStatus);
      if (result.success) {
        toast.success(`Plano ${currentStatus ? 'desativado' : 'ativado'} com sucesso.`);
      } else {
        toast.error("Erro ao processar alteração.");
      }
    });
  };

  const handleOpenEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <LuxuryTable 
        variant="light"
        columns={[
          {
            key: 'id',
            header: 'Identificador',
            render: (plan) => (
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] italic">{plan.id}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400/20 flex items-center justify-center">
                    <div className={`w-1 h-1 rounded-full ${plan.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{plan.stripeProductId || "Aguardando Stripe"}</p>
                </div>
              </div>
            )
          },
          {
            key: 'revenue',
            header: 'Performance (R$)',
            render: (plan) => (
              <div className="flex flex-col">
                <p className="text-xs font-black text-slate-900 italic">R$ {Number(plan.priceMonthly).toLocaleString('pt-BR')}/mês</p>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tight">R$ {Number(plan.priceYearly).toLocaleString('pt-BR')}/ano</p>
              </div>
            )
          },
          {
            key: 'subscribers',
            header: 'Ecossistema',
            render: () => (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">
                      <Users size={8} />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-black text-slate-700 italic">42 Ativos</p>
              </div>
            )
          },
          {
            key: 'actions',
            header: 'Engenharia Operacional',
            className: 'text-right',
            render: (plan) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                  disabled={isPending}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    plan.isActive 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={plan.isActive ? "Desativar Oferta" : "Ativar Oferta"}
                >
                  <Power size={14} strokeWidth={3} />
                </button>
                
                <button 
                  onClick={() => handleOpenEdit(plan)}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer"
                  title="Editar Configuração"
                >
                  <Edit3 size={14} strokeWidth={3} />
                </button>

                <button className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
                  <MoreHorizontal size={14} strokeWidth={3} />
                </button>
              </div>
            )
          }
        ]}
        data={plans}
      />

      {selectedPlan && (
        <PlanEditModal 
          plan={selectedPlan}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </>
  );
}
