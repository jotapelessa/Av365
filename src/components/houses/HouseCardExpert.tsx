'use client';

import { Home, Users, Activity, ArrowRight, Trash2, Loader2, Gauge, Thermometer, Wind, Zap } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteHouse } from "@/app/houses/actions";
import { toast } from "sonner";

interface HouseCardExpertProps {
  house: any;
}

export default function HouseCardExpert({ house }: HouseCardExpertProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }

    startTransition(async () => {
      const result = await deleteHouse(house.id);
      if (result.success) {
        toast.success("Galpão excluído com sucesso");
      } else {
        toast.error(result.error || "Erro ao excluir galpão");
      }
    });
  };

  // Cálculo de Área e Densidade
  const area = Number(house.width || 0) * Number(house.length || 0);
  const density = house.flock ? (house.flock.currentQuantity / area).toFixed(2) : "0.00";

  // Mapeamento de Status
  const statusConfig: any = {
    ACTIVE: { label: "Pronto", bg: "bg-success-bg", text: "text-success-text", border: "border-success/10" },
    BUSY: { label: "Ocupado", bg: "bg-primary-bg", text: "text-primary", border: "border-primary/10" },
    MAINTENANCE: { label: "Manutenção", bg: "bg-warning-bg", text: "text-warning-text", border: "border-warning/10" },
    SANITARY_VOID: { label: "Vazio Sanitário", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }
  };

  const currentStatus = house.flock ? statusConfig.BUSY : statusConfig[house.status] || statusConfig.ACTIVE;

  return (
    <div className="relative group/card h-full" data-audit={`houses__card__${house.id}`}>
      {/* Delete Trigger */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        data-audit={`houses__card__delete-${house.id}`}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-md transition-all duration-300 flex items-center gap-2
          ${showConfirm 
            ? "bg-rose-600 text-white w-auto px-4 shadow-lg shadow-rose-200" 
            : "bg-white/80 backdrop-blur-md text-slate-300 hover:text-rose-600 hover:bg-white shadow-sm opacity-0 group-hover/card:opacity-100"
          }`}
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : showConfirm ? (
          <>
            <Trash2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Confirmar?</span>
          </>
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      <Link 
        href={`/houses/${house.id}`}
        data-audit={`houses__card__link-${house.id}`}
        className="relative flex flex-col h-full bento-card-elite !p-0 overflow-hidden"
      >
        <div className="p-10 flex flex-col h-full relative z-10">
          {/* Decorative Background */}
          <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-indigo-500/5 blur-[80px] group-hover:bg-indigo-500/10 transition-colors" />

          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div 
                data-audit={`houses__card__icon-${house.id}`}
                className="p-3 rounded-md bg-primary-bg text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm"
              >
                <Home size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic leading-none group-hover:text-primary transition-colors" data-audit={`houses__card__title-${house.id}`}>
                  {house.name}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2" data-audit={`houses__card__subtitle-${house.id}`}>
                  {house.housingSystem === 'DARK_HOUSE' ? 'Dark House' : 'Sistema Convencional'}
                </p>
              </div>
            </div>
            <div 
              data-audit={`houses__card__status-${house.id}`}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
            >
              {currentStatus.label}
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8" data-audit={`houses__card__metrics-${house.id}`}>
            <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100/50 group-hover:bg-white transition-colors" data-audit={`houses__card__metric-capacity-${house.id}`}>
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Users size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Capacidade</span>
              </div>
              <p className="text-sm font-black text-slate-800 italic">{house.capacity.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-400">aves</span></p>
            </div>

            <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100/50 group-hover:bg-white transition-colors" data-audit={`houses__card__metric-area-${house.id}`}>
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Gauge size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Área Total</span>
              </div>
              <p className="text-sm font-black text-slate-800 italic">{area.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-400">m²</span></p>
            </div>

            <div 
              data-audit={`houses__card__metric-density-${house.id}`}
              className={`p-4 rounded-[6px] border transition-all ${house.flock ? 'bg-primary-bg border-primary/10' : 'bg-slate-50/30 border-slate-100'}`}
            >
              <div className={`flex items-center gap-2 mb-2 ${house.flock ? 'text-primary' : 'text-slate-400'}`}>
                <Activity size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Densidade</span>
              </div>
              <p className={`text-sm font-black ${house.flock ? 'text-primary' : 'text-slate-400'}`}>
                {density} <span className="text-[10px] uppercase">aves/m²</span>
              </p>
            </div>

            <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100/50 group-hover:bg-white transition-colors" data-audit={`houses__card__metric-flock-${house.id}`}>
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Activity size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Lote</span>
              </div>
              <p className="text-sm font-black text-slate-800 truncate">{house.flock?.name || 'Vazio'}</p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 mb-8" data-audit={`houses__card__badges-${house.id}`}>
            {house.hasClimate && (
              <div data-audit={`houses__card__badge-climate-${house.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-black uppercase tracking-tight">
                <Wind size={10} /> Climatizado
              </div>
            )}
            {house.hasAutoFeeding && (
              <div data-audit={`houses__card__badge-auto-feeding-${house.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase tracking-tight">
                <Zap size={10} /> Automação
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50" data-audit={`houses__card__footer-${house.id}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gerenciamento Técnico</span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
