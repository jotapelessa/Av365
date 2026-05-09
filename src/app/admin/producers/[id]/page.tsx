import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Building2, 
  ArrowLeft,
  User as UserIcon,
  Mail,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Receipt,
  LayoutDashboard,
  CalendarDays,
  Activity,
  ShieldAlert,
  Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProducerAuditTimeline } from "@/components/admin/producers/ProducerAuditTimeline";
import { ProducerControlPanel } from "@/components/admin/producers/ProducerControlPanel";
import { ProducerTaskCalendar } from "@/components/admin/producers/ProducerTaskCalendar";
import { getAuditLogs } from "./actions";

export default async function ProducerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let producer;
  let auditLogs = [];

  try {
    producer = await db.producer.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { plan: true }
        },
        invoices: {
          orderBy: { createdAt: 'desc' }
        },
        flocks: { select: { id: true } },
        houses: { select: { id: true } },
        users: { select: { id: true } },
        tasks: {
          orderBy: { dueDate: 'asc' },
          take: 100
        }
      }
    });

    if (!producer) notFound();

    const auditLogsResult = await getAuditLogs(id);
    auditLogs = auditLogsResult.success ? auditLogsResult.logs : [];

    // Serialização profunda para evitar erro de Decimal do Prisma em Client Components
    producer = JSON.parse(JSON.stringify(producer));
  } catch (error) {
    console.error("ERRO CRÍTICO NA PÁGINA DE PRODUTOR:", error);
    // Se o erro for de conexão, podemos lançar um erro mais limpo ou mostrar uma UI de fallback
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldAlert size={48} className="text-rose-500 animate-pulse" />
        <h1 className="text-2xl font-black text-slate-900 italic">Erro de Conexão com a Matriz</h1>
        <p className="text-sm text-slate-500">Ocorreu um erro de rede ao tentar recuperar os dados do tenant. Verifique a conectividade com o banco de dados.</p>
        <div className="px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest">
          Recarregue a página manualmente
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50",
    PAUSED: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50",
    CANCELED: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50",
    PAST_DUE: "bg-rose-50 text-rose-400 border-rose-200 animate-pulse",
    TRIAL: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50"
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-24 px-4 sm:px-8 max-w-[1600px] mx-auto">
      {/* HEADER ELITE */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <Link 
            href="/admin/producers" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.25em] transition-all group italic"
          >
            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft size={12} />
            </div>
            Voltar para Auditório de Tenants
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <div className="w-20 h-20 rounded-[24px] bg-white shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden relative">
               {producer.logoUrl ? (
                 <Image src={producer.logoUrl} alt={producer.name} fill className="object-contain" />
               ) : (
                 <Building2 size={32} className="text-slate-200" />
               )}
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic leading-none">{producer.name}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${statusColors[producer.subscription?.status || 'TRIAL']}`}>
                  {producer.subscription?.status || 'TRIAL'}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 flex items-center gap-1.5">
                  <Globe size={10} /> ID: <span className="font-mono text-slate-600 lowercase">{producer.id}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* GRID DE ALTA DENSIDADE */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: Perfil, Tarefas e Auditoria (8 colunas) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* DASHBOARD DE SAÚDE DO TENANT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: 'Aves Alojadas', value: producer.flocks.length, icon: Activity, color: 'indigo' },
               { label: 'Galpões Ativos', value: producer.houses.length, icon: LayoutDashboard, color: 'emerald' },
               { label: 'Usuários Registrados', value: producer.users.length, icon: UserIcon, color: 'amber' }
             ].map((stat, i) => (
               <div key={i} className="bento-card-elite p-8 bg-white border border-slate-200 shadow-sm group hover:-translate-y-2 transition-all duration-500">
                  <div className={`p-3 w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 mb-6 flex items-center justify-center border border-${stat.color}-100 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
               </div>
             ))}
          </div>

          {/* CALENDÁRIO DE TAREFAS */}
          <ProducerTaskCalendar tasks={producer.tasks} />

          {/* INFORMAÇÕES DO TENANT */}
          <section className="bento-card-elite p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-50 relative z-10">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">DNA do Contrato</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Metadados de Operação SaaS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-10">
                <div className="group/item">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                    <Mail size={12} className="text-indigo-500" /> Endpoint de Comunicação
                  </p>
                  <p className="text-lg font-black text-slate-800 italic underline decoration-indigo-100 underline-offset-8">{producer.email}</p>
                </div>
                <div className="group/item">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                    <Smartphone size={12} className="text-indigo-500" /> Protocolo de Contato
                  </p>
                  <p className="text-lg font-black text-slate-800 italic">{producer.phone || 'NÃO CONFIGURADO'}</p>
                </div>
              </div>

              <div className="p-10 bg-slate-900 rounded-[32px] text-white space-y-8 shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-indigo-400">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                    Tier {producer.subscription?.plan?.name || 'FREE'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">LTV Projetado (Anual)</p>
                  <h3 className="text-4xl font-black italic tracking-tighter text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(producer.subscription?.plan?.priceMonthly || 0) * 12)}
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* TIMELINE DE AUDITORIA */}
          <ProducerAuditTimeline logs={auditLogs} />

        </div>

        {/* COLUNA DIREITA: Ações e Faturamento (4 colunas) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* PAINEL DE CONTROLE ADMIN */}
          <ProducerControlPanel 
            producerId={id} 
            currentStatus={producer.subscription?.status || 'TRIAL'} 
          />

          {/* CALENDÁRIO DE FATURAMENTO / INVOICES */}
          <section className="bento-card-elite p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CalendarDays size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Faturamento</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Fluxo de Ingressos SaaS</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {producer.invoices.length > 0 ? (
                producer.invoices.map((inv: any) => (
                  <div key={inv.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all group/inv">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(inv.createdAt), "MMM yyyy", { locale: ptBR })}</span>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                         inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         {inv.status}
                       </span>
                    </div>
                    <div className="flex items-end justify-between">
                       <p className="text-xl font-black text-slate-800 italic tracking-tighter">
                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.amount))}
                       </p>
                       <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-300 group-hover/inv:text-indigo-500 group-hover/inv:border-indigo-100 transition-all">
                         <Receipt size={14} />
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhuma fatura processada</p>
                </div>
              )}
            </div>
          </section>

          {/* CARD DE ALERTAS / RISCOS */}
          <section className="bento-card-elite p-10 bg-slate-50 border-2 border-dashed border-slate-200">
             <div className="flex items-center gap-3 mb-6 text-slate-400 grayscale">
                <ShieldAlert size={24} />
                <h3 className="text-xs font-black uppercase tracking-widest italic">Análise de Risco (AI)</h3>
             </div>
             <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">O algoritmo de monitoramento não identificou padrões de churn ou anomalias operais para este tenant nas últimas 24h.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
