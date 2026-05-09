'use client';

import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import UserNav from "@/components/layout/UserNav";
import { DashboardItem } from "@/components/dashboard/DashboardClient";
import HouseForm from "./HouseForm";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export default function HousePageClient() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DashboardItem 
        data-audit="houses__header"
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5" data-audit="houses__header__badges">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]" data-audit="houses__header__badge-infra">Infraestrutura</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
            <span className="text-[10px] font-black text-warning uppercase tracking-widest flex items-center gap-1" data-audit="houses__header__badge-assets">
              <Zap size={10} className="fill-warning" /> Ativos Físicos
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight" data-audit="houses__header__title">
            Gestão de <span className="text-primary italic">Galpões</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium" data-audit="houses__header__subtitle">
            Monitore a ocupação, capacidade e o status dos seus espaços de produção.
          </p>
        </div>
        
        <div className="flex items-center gap-4" data-audit="houses__header__actions">
          <div data-audit="houses__header__action-new">
            <LuxuryButton 
              onClick={() => setShowModal(true)}
              variant="secondary"
              icon={Plus}
            >
              Novo Galpão
            </LuxuryButton>
          </div>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          
          <div className="flex items-center gap-3 bg-white p-1 pr-1 rounded-md border border-slate-100 shadow-sm" data-audit="houses__header__user-nav">
            <UserNav />
          </div>
        </div>
      </DashboardItem>

      {showModal && <HouseForm onClose={() => setShowModal(false)} />}
    </>
  );
}
