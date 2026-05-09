import { db } from "@/lib/prisma";
import { Receipt, TrendingUp, CreditCard } from "lucide-react";
import AdminBillingListClient from "./AdminBillingListClient";

export default async function AdminBillingPage() {
  const subscriptions = await db.subscription.findMany({
    include: {
      producer: true,
      plan: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const sanitizedSubscriptions = JSON.parse(JSON.stringify(subscriptions));
  const activeSubscriptions = sanitizedSubscriptions.filter((s: any) => s.status === 'ACTIVE').length;
  const totalMRR = sanitizedSubscriptions
    .filter((s: any) => s.status === 'ACTIVE')
    .reduce((acc: number, curr: any) => acc + (Number(curr.plan.priceMonthly) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <TrendingUp size={12} /> Saúde Financeira SaaS
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 italic">Faturamento Global</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoramento executivo de receita e assinaturas.</p>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">Live</div>
          <p className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizado</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[18px] bg-white border border-slate-200 shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MRR Consolidado</p>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 italic">R$ {totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="p-6 rounded-[18px] bg-white border border-slate-200 shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assinaturas Ativas</p>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 italic">{activeSubscriptions}</p>
        </div>

        <div className="p-6 rounded-[18px] bg-white border border-slate-200 shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume Total</p>
            <div className="p-3 rounded-2xl bg-slate-50 text-slate-500 border border-slate-100">
              <Receipt size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 italic">{sanitizedSubscriptions.length}</p>
        </div>
      </div>

      <AdminBillingListClient subscriptions={sanitizedSubscriptions} />
    </div>
  );
}
