import { db } from "@/lib/prisma";
import { CreditCard, Check, Layers, Zap, Crown, ShieldCheck, BarChart3, RefreshCw } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import AdminPlansListClient from "./AdminPlansListClient";

export default async function AdminPlansPage() {
  const plans = await db.subscriptionPlan.findMany({
    orderBy: { priceMonthly: 'asc' }
  });

  const sanitizedPlans = JSON.parse(JSON.stringify(plans));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Zap size={12} /> Engenharia Comercial de Elite
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">Catálogo de Planos</h1>
          <p className="text-slate-500 text-sm font-medium">Controle de ofertas, precificação e limites operacionais SaaS.</p>
        </div>

        <div className="flex items-center gap-3">
          <LuxuryButton 
            variant="outline"
            icon="refresh-cw"
            className="!border-slate-200 !text-slate-500"
          >
            Sincronizar Stripe
          </LuxuryButton>
          <LuxuryButton 
            variant="primary"
            icon="plus"
          >
            Novo Plano Master
          </LuxuryButton>
        </div>
      </header>

      {/* Admin BI Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "MRR Projetado", value: "R$ 42.500", trend: "+12%", icon: CreditCard, color: "bg-indigo-50 text-indigo-600" },
          { label: "Assinaturas Ativas", value: "124", trend: "+5", icon: Check, color: "bg-emerald-50 text-emerald-600" },
          { label: "Ticket Médio", value: "R$ 342", trend: "Estável", icon: Zap, color: "bg-amber-50 text-amber-600" },
          { label: "Churn Rate", value: "1.2%", trend: "-0.4%", icon: Layers, color: "bg-rose-50 text-rose-600" },
        ].map((kpi, idx) => (
          <div key={idx} className="bento-card-elite !p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl border shadow-sm ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-xl font-black text-slate-900 italic">{kpi.value}</h4>
                <span className={`text-[9px] font-black uppercase ${kpi.trend.startsWith('+') ? 'text-emerald-600' : kpi.trend === 'Estável' ? 'text-slate-400' : 'text-rose-600'}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans Grid Elite Pastel - High Density (cols-4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sanitizedPlans.map((plan: any) => (
          <div key={plan.id} className="bento-card-elite !p-8 group">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 -translate-x-[-10%] -translate-y-[10%] transition-transform duration-1000 group-hover:scale-150 ${
              plan.id === 'diamond' ? 'bg-indigo-400' : plan.id === 'gold' ? 'bg-amber-400' : 'bg-slate-400'
            }`} />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl border shadow-sm ${
                  plan.id === 'diamond' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 
                  plan.id === 'gold' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                  'bg-slate-50 border-slate-100 text-slate-500'
                }`}>
                  {plan.id === 'diamond' ? <Crown size={20} /> : plan.id === 'gold' ? <Zap size={20} /> : <Layers size={20} />}
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${plan.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 italic">{plan.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold mb-6 leading-relaxed italic line-clamp-2">{plan.description || "Gestão avícola profissional."}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black text-slate-400">R$</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter italic">{Number(plan.priceMonthly).toFixed(0)}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">/mês</span>
                </div>
                <div className="h-px w-full bg-slate-100/50" />
              </div>

              {/* Functional Limits */}
              <div className="space-y-3 mb-8 flex-1">
                {[
                  { label: "Lotes", value: plan.maxFlocks },
                  { label: "Galpões", value: plan.maxHouses },
                  { label: "Operadores", value: plan.maxUsers }
                ].map((limit, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{limit.label}</p>
                    <p className="text-xs font-black text-slate-800 italic">{limit.value}</p>
                  </div>
                ))}
              </div>

              {/* Technical Modules - Poultry Focused */}
              <div className="space-y-2 mb-8 border-t border-slate-50 pt-6">
                {[
                  { label: "Módulo Bio-Seguridade", icon: ShieldCheck },
                  { label: "Mapa de Sanidade", icon: BarChart3 },
                  { label: "IA Financeira", icon: Zap }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <feature.icon size={10} className="text-indigo-400" />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{feature.label}</p>
                  </div>
                ))}
              </div>

              <LuxuryButton 
                variant="outline"
                className="w-full !py-2.5 !text-[10px] !border-slate-200 hover:!border-indigo-600/40 !text-slate-500 hover:!text-indigo-600 hover:!bg-indigo-50/50"
              >
                Engenharia Comercial
              </LuxuryButton>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table Luxury */}
      <section className="bento-card-elite !p-10">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
              <CreditCard size={18} />
            </div>
            Matriz de Configuração Técnica
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Build Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-100">STABLE</span>
          </div>
        </header>
        
        <AdminPlansListClient plans={sanitizedPlans} />
      </section>
    </div>
  );
}
