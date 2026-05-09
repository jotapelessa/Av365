import { getTenantDb } from "@/lib/tenant";
import { ArrowLeft, Bird } from "lucide-react";
import Link from "next/link";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import FlockFormClient from "@/components/flocks/FlockFormClient";

export default async function NewFlockPage() {
  const tenantPrisma = await getTenantDb();
  
  // Buscar galpões ativos para o seletor
  const houses = await tenantPrisma.house.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true }
  });

  return (
    <DashboardContainer>
      <div className="max-w-4xl mx-auto">
      <DashboardItem className="mb-10">
        <div className="flex items-center gap-5">
          <Link 
            href="/flocks" 
            className="p-3 rounded-[6px] bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-indigo-600 hover:border-indigo-100 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Novo <span className="text-indigo-600 italic">Lote</span> Profissional
            </h1>
            <p className="text-slate-400 font-medium text-sm">Configure os marcos zero biológicos e financeiros da produção.</p>
          </div>
        </div>
      </DashboardItem>

      <DashboardItem>
        <FlockFormClient houses={houses} />
      </DashboardItem>

      <DashboardItem className="mt-8">
        <div className="p-8 rounded-3xl bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="p-4 rounded-[6px] bg-white text-indigo-600 shadow-indigo-100/50 shadow-xl ring-1 ring-indigo-50">
            <Bird size={32} />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Visão do Especialista</h4>
            <p className="text-sm text-indigo-900/60 leading-relaxed font-medium max-w-xl">
              O registro do peso médio e custo unitário no alojamento é o segredo para identificar o lote mais rentável. No EggTrack, esses dados geram automaticamente o seu ROI projetado.
            </p>
          </div>
        </div>
      </DashboardItem>
      </div>
    </DashboardContainer>
  );
}
