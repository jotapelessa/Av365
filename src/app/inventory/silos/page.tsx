import { getSilos } from "./actions";
import { Layers, Plus, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import LuxuryKpiCard from "@/components/ui/LuxuryKpiCard";
import SiloListClient from "./SiloListClient";

export default async function SilosPage() {
  const silos = await getSilos();
  
  const totalCapacity = silos.reduce((acc: number, s: any) => acc + s.capacity, 0);
  const currentTotalStock = silos.reduce((acc: number, s: any) => acc + s.currentStock, 0);
  const occupancyRate = totalCapacity > 0 ? (currentTotalStock / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Logística & Nutrição</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Layers size={10} /> Gestão de Silos
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Estoque de <span className="text-primary italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Ração</span>
            </h1>
          </div>

          <Link 
            href="/inventory/silos/new"
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-[18px] font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Novo Silo
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <LuxuryKpiCard 
          title="Capacidade Total"
          value={`${totalCapacity.toLocaleString()} t`}
          icon="package"
          trend="Capacidade Máxima"
        />
        <LuxuryKpiCard 
          title="Estoque Atual"
          value={`${currentTotalStock.toLocaleString()} t`}
          icon="trending-up"
          trend={`${occupancyRate.toFixed(1)}%`}
        />
        <LuxuryKpiCard 
          title="Alertas Ativos"
          value={silos.filter((s: any) => s.currentStock < (s.capacity * 0.15)).length.toString()}
          icon="alert-triangle"
          trend="Nível Crítico"
        />
      </div>

      <SiloListClient initialSilos={JSON.parse(JSON.stringify(silos))} />
    </div>
  );
}
