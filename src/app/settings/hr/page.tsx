import { getTenantDb } from "@/lib/tenant";
import { Users2, ShieldPlus, Landmark, FileText, BadgeCheck } from "lucide-react";
import HRHubClient from "@/app/settings/hr/HRHubClient";

export default async function HRSettingsPage() {
  const tenantPrisma = await getTenantDb();

  const employees = await tenantPrisma.employee.findMany({
    orderBy: { name: 'asc' }
  });

  // Sanitização
  const sanitizedEmployees = JSON.parse(JSON.stringify(employees));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* KPI STRIP LUXURY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bento-card-elite flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Users2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Equipe</p>
            <h3 className="text-xl font-black text-slate-900">{sanitizedEmployees.length}</h3>
          </div>
        </div>

        <div className="bento-card-elite flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <BadgeCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Conformidade</p>
            <h3 className="text-xl font-black text-slate-900">100%</h3>
          </div>
        </div>

        <div className="bento-card-elite flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Landmark size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Folha Bruta</p>
            <h3 className="text-xl font-black text-slate-900">
              R$ {sanitizedEmployees.reduce((acc: number, emp: any) => acc + Number(emp.baseSalary || 0), 0).toLocaleString('pt-BR')}
            </h3>
          </div>
        </div>

        <div className="bento-card-elite flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contratos</p>
            <h3 className="text-xl font-black text-slate-900">{sanitizedEmployees.filter((e: any) => e.contractUrl).length} Docs</h3>
          </div>
        </div>
      </div>

      {/* CLIENT HUB */}
      <section className="bento-card-elite !p-0 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white text-indigo-600 border border-slate-200 shadow-sm">
              <ShieldPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 italic leading-none">Gestão de Talentos & Folha</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configurações de salários, impostos e documentação legal</p>
            </div>
          </div>
        </div>
        
        <HRHubClient initialEmployees={sanitizedEmployees} />
      </section>

    </div>
  );
}
