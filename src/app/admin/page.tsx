import { db } from "@/lib/prisma";
import { 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  UserCheck,
  Building2
} from "lucide-react";
import * as motion from "framer-motion/client";

export default async function AdminDashboard() {
  // ... (keeping variables same)
  const producersCount = await db.producer.count();
  const usersCount = await db.user.count();
  const activeSubs = await db.subscription.count({ where: { status: 'ACTIVE' } });
  
  const globalAggregates = await db.$transaction([
    db.dailyRecord.aggregate({ _sum: { eggsTotal: true } }),
    db.flock.aggregate({ _sum: { currentQuantity: true } }),
    db.sale.aggregate({ _sum: { amount: true } }),
    db.dailyRecord.count()
  ]);

  const totalEggs = globalAggregates[0]._sum.eggsTotal || 0;
  const totalBirds = globalAggregates[1]._sum.currentQuantity || 0;
  const totalRevenue = Number(globalAggregates[2]._sum.amount || 0);
  const globalLayRate = totalBirds > 0 ? ((totalEggs / (totalBirds * 30)) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Ovos Coletados (Global)", value: new Intl.NumberFormat('pt-BR').format(totalEggs), icon: Activity, color: "bg-indigo-50 text-indigo-600", trend: "Produção Ativa", trendUp: true },
    { label: "Plantel Ativo (Aves)", value: new Intl.NumberFormat('pt-BR').format(totalBirds), icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", trend: "Capacidade Total", trendUp: true },
    { label: "Taxa de Postura Média", value: `${globalLayRate}%`, icon: UserCheck, color: "bg-amber-50 text-amber-600", trend: "Performance Bio", trendUp: true },
    { label: "Faturamento Bruto (SaaS)", value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue), icon: CreditCard, color: "bg-rose-50 text-rose-600", trend: "Volume de Vendas", trendUp: true },
  ];

  const recentProducers = await db.producer.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { subscription: { include: { plan: true } } }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Master Operações */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 italic">
            <Activity size={12} className="animate-pulse" /> Operações Globais AV365
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">Cockpit Master</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão tática e biosseguridade do ecossistema EggTrack Elite.</p>
        </div>
        
        <div className="flex items-center gap-4 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Admins Ativos</p>
        </div>
      </header>

      {/* Grid de Stats Elite Pastel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="ui-card group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} border border-current opacity-80 shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tighter ${stat.trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 italic">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gestão de Plantel (Tenants) */}
        <div className="lg:col-span-8 bento-card-elite">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 italic">Produtores Recentes</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Novas Granjas Integradas</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors flex items-center gap-2 group italic">
              Auditório Completo <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Entidade</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plano</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Integração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentProducers.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm group-hover:scale-110 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-transform italic">
                          {p.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 italic">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{p.slug}.eggtrack.app</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-tighter italic">
                        {p.subscription?.plan?.name || 'Iniciante'}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight italic">{p.status}</span>
                      </div>
                    </td>
                    <td className="py-5 text-right text-[10px] font-black text-slate-400 uppercase tabular-nums italic">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biosseguridade & System Health */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bento-card-elite">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2 italic">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Activity size={16} />
              </div>
              Saúde do SaaS
            </h3>
            <div className="space-y-6">
              {[
                { label: "Uptime Global", value: "99.99%", color: "text-emerald-600" },
                { label: "Latência Média", value: "38ms", color: "text-emerald-600" },
                { label: "Security Shield", value: "Ativa", color: "text-indigo-600" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{m.label}</span>
                  <span className={`text-xs font-black ${m.color} italic`}>{m.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic text-center">
                Isolamento tático de dados via RLS para {producersCount} granjas ativas.
              </p>
            </div>
          </section>

          <section className="p-8 rounded-[18px] bg-indigo-600 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-3 relative z-10 italic">Meta Global 2026</p>
            <h4 className="text-xl font-black italic mb-6 relative z-10 leading-tight">Expansão do Plantel Tecnológico</h4>
            <div className="h-2 bg-white/20 rounded-full relative z-10 overflow-hidden mb-3">
              {/* @ts-ignore - framer motion client side component */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full" 
              />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] text-indigo-100 font-black uppercase tracking-tighter italic">65% Progressão</span>
              <span className="text-[10px] text-indigo-100 font-black uppercase tracking-tighter italic">1.5M Aves Monitoradas</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
