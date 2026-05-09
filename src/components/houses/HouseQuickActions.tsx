'use client';

import { DashboardCard } from "@/components/dashboard/DashboardGrid";
import { ClipboardList, Wrench, AlertTriangle, Droplets, Pencil } from "lucide-react";
import { toast } from "sonner";

interface HouseQuickActionsProps {
  house: any;
}

export function HouseQuickActions({ house }: HouseQuickActionsProps) {
  const actions = [
    {
      label: 'Novo Registro',
      icon: <ClipboardList size={20} />,
      color: 'bg-indigo-50 text-indigo-600',
      action: () => toast.info("Abrindo formulário de registro diário...")
    },
    {
      label: 'Manutenção',
      icon: <Wrench size={20} />,
      color: 'bg-amber-50 text-amber-600',
      action: () => toast.info("Abrindo ordens de serviço...")
    },
    {
      label: 'Ambiência',
      icon: <Droplets size={20} />,
      color: 'bg-blue-50 text-blue-600',
      action: () => toast.info("Configurando setpoints de climatização...")
    },
    {
      label: 'Alerta Crítico',
      icon: <AlertTriangle size={20} />,
      color: 'bg-rose-50 text-rose-600',
      action: () => toast.error("Alerta disparado para equipe técnica!")
    }
  ];

  return (
    <DashboardCard span={12} className="p-8 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900 tracking-tight">Ações Rápidas</h4>
        <button className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-center">
           <Pencil size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center gap-4 p-4 rounded-md border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all duration-300 group text-left"
          >
            <div className={`p-3 rounded-md ${item.color} group-hover:scale-110 transition-transform duration-500`}>
              {item.icon}
            </div>
            <span className="text-sm font-bold text-slate-700 tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Última Sanitização</p>
        <p className="text-xs text-slate-600 text-center font-medium mt-1">
          {house.lastSanitized ? new Date(house.lastSanitized).toLocaleDateString('pt-BR') : 'Não registrada'}
        </p>
      </div>
    </DashboardCard>
  );
}
