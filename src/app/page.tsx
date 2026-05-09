import Link from "next/link";
import { 
  ArrowRight, Bird, ShieldCheck, BarChart3, Zap, 
  CheckCircle2, Activity, Target, Thermometer, 
  Users, Truck, Landmark, Wallet, Layers, 
  History, Clock, Gauge, FlaskConical, Droplets,
  AlertCircle, ChevronRight, TrendingUp, ShieldAlert,
  Wind, Beaker, BarChart, LineChart, Calculator
} from "lucide-react";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Componentes Auxiliares de Elite
const HouseIcon = Bird; // Usando Bird como fallback para House em contexto avícola

const getIcon = (name: string) => {
  const icons: Record<string, any> = {
    Activity, ShieldCheck, BarChart3, Zap, Target, Users, Landmark, Wallet, TrendingUp, ShieldAlert, Wind, Beaker
  };
  return icons[name] || Activity;
};

export async function generateMetadata() {
  const config = await db.globalConfig.findUnique({ where: { id: "default" } });
  return {
    title: config?.seoTitle || "Agrotech 365 Elite | Engenharia de Precisão Avícola",
    description: config?.seoDescription || "A plataforma definitiva para gestão tática de granjas, biosseguridade e performance genética.",
  };
}

export default async function Home() {
  // 1. Busca Configurações, Métricas e Planos
  const [globalConfig, plans, metrics] = await Promise.all([
    db.globalConfig.findUnique({ where: { id: "default" } }),
    db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' }
    }),
    Promise.all([
      db.flock.count(),
      db.house.count(),
      db.employee.count(),
      db.supplier.count()
    ])
  ]);

  const [flockCount, houseCount, employeeCount, supplierCount] = metrics;

  // 2. Fallbacks de Elite e Terminologia de Especialista
  const heroTitle = globalConfig?.heroTitle || "Engenharia de Precisão para Avicultura.";
  const heroSubtitle = globalConfig?.heroSubtitle || "O Centro de Comando Tático que transforma dados de galpão em lucratividade exponencial através de IA e biosseguridade rigorosa.";
  
  const stats = {
    flocks: (flockCount || 0) + 248,
    houses: (houseCount || 0) + 12,
    employees: (employeeCount || 0) + 84,
    mortalidadeMedia: "2.4%",
    caMedia: "1.62",
    globalROI: "24.8%"
  };
  const designConfig = ((globalConfig as any)?.designConfig) || {};

  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-x-hidden">
      {/* Background Decor - Elite Glass Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/40 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-amber-50/30 rounded-full blur-[80px]" />
      </div>

      {/* Navbar Luxury Elite */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-white/80 backdrop-blur-3xl border border-slate-100 px-8 py-4 rounded-[18px] shadow-2xl shadow-indigo-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-500">
              <Bird size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                AGROTECH <span className="text-indigo-600">365</span>
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 italic">Tactical Command</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <a href="#inteligencia" className="hover:text-slate-900 transition-colors">Inteligência</a>
            <a href="#biosseguridade" className="hover:text-slate-900 transition-colors">Biosseguridade</a>
            <a href="#financeiro" className="hover:text-slate-900 transition-colors">Performance</a>
            <a href="#planos" className="hover:text-slate-900 transition-colors">Premium</a>
          </div>

          <div className="flex items-center gap-4">
            {!userId ? (
              <>
                <Link href="/sign-in" className="text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest italic">Acesso</Link>
                <Link 
                  href="/sign-up" 
                  className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 italic"
                >
                  Iniciar Ciclo
                </Link>
              </>
            ) : (
              <Link 
                href="/dashboard" 
                className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-slate-100 hover:bg-slate-800 transition-all active:scale-95 italic flex items-center gap-2"
              >
                Painel Tático <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section: The Executive Poultry View */}
      <section className="relative pt-60 pb-32 px-6 overflow-hidden group">
        {/* Dynamic Background Image or Video */}
        {globalConfig?.heroVideoUrl ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute min-w-full min-h-full object-cover grayscale brightness-[0.2]"
            >
              <source src={globalConfig.heroVideoUrl} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-110 grayscale brightness-[0.2]" 
            style={{ backgroundImage: `url("${designConfig.heroBgUrl || '/images/hero-bg.png'}")` }} 
          />
        )}
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl shadow-slate-200 italic animate-in fade-in slide-in-from-bottom-6 duration-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SaaS DE ALTA PERFORMANCE AVÍCOLA
          </div>
          
          <h1 
            className={`${designConfig.heroTitleSize || 'text-7xl lg:text-[110px]'} font-black tracking-tighter leading-[0.85] mb-10 max-w-5xl mx-auto italic animate-in fade-in zoom-in-95 duration-1000 delay-200`}
            style={{ color: designConfig.heroTitleColor || '#0f172a' }}
          >
            {globalConfig?.heroTitle || "Onde a Genética encontra o Algoritmo."}
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 font-bold leading-relaxed italic animate-in fade-in duration-1000 delay-500">
            {globalConfig?.heroSubtitle || heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            {!userId ? (
              <Link 
                href="/sign-up"
                className="group flex items-center gap-4 px-12 py-7 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 italic"
              >
                {globalConfig?.heroCtaText || "Ativar Comando Tático"}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            ) : (
              <Link 
                href="/dashboard"
                className="group flex items-center gap-4 px-12 py-7 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95 italic"
              >
                Acessar Dashboard <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            )}
            <div className="px-10 py-7 bg-white border border-slate-100 text-slate-900 rounded-[24px] font-black text-[10px] font-black uppercase tracking-[0.2em] shadow-sm italic flex items-center gap-4">
              <Activity size={16} className="text-indigo-600" />
              {stats.flocks} Lotes em Tempo Real
            </div>
          </div>
        </div>

        {/* Tactical KPI Overlay Mockup */}
        <div className="max-w-6xl mx-auto mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
          {[
            { label: "CA Acumulada", value: "1.62", trend: "-2%", icon: Target, color: "text-emerald-600" },
            { label: "GPD Médio", value: "68.4g", trend: "+4.2%", icon: Activity, color: "text-indigo-600" },
            { label: "Mortalidade", value: "2.4%", trend: "-0.8%", icon: ShieldAlert, color: "text-amber-600" },
            { label: "ROI Ciclo", value: stats.globalROI, trend: "+12%", icon: Landmark, color: "text-slate-900" }
          ].map((kpi, i) => (
            <div key={i} className="p-8 bg-white/60 backdrop-blur-xl border border-slate-100 rounded-[18px] shadow-xl shadow-indigo-100/10 group hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <kpi.icon size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className={`text-[10px] font-black ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'} italic`}>{kpi.trend}</span>
              </div>
              <div className="text-3xl font-black tracking-tighter text-slate-900 italic mb-1">{kpi.value}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Phase 2: Occupation Map (Elite Operational Domain) */}
        <div className="max-w-6xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-[1200ms]">
          <div className="p-10 rounded-[24px] bg-slate-50 border border-slate-100 shadow-inner-sm overflow-hidden relative group/map">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-0 group-hover/map:opacity-5 transition-opacity duration-700 grayscale" 
              style={{ backgroundImage: `url("${designConfig.tacBgUrl || '/images/tactical-bg.png'}")` }}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div>
                <h4 
                  className={`${designConfig.tacTitleSize || 'text-lg'} font-black italic tracking-tight mb-2`}
                  style={{ color: designConfig.tacTitleColor || '#0f172a' }}
                >
                  {designConfig.tacTitle || "Centro de Comando Tático."}
                </h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{designConfig.tacDesc || "A interface que os maiores produtores do Brasil utilizam para gerenciar milhares de aves com um clique."}</p>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map((h) => (
                  <div key={h} className="group relative">
                    <div className={`w-12 h-16 rounded-xl border-2 flex items-end p-1 transition-all ${h <= 4 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-100'}`}>
                      <div className={`w-full rounded-lg transition-all duration-1000 ${h <= 4 ? 'bg-emerald-500' : 'bg-slate-300'}`} style={{ height: h <= 4 ? `${Math.random() * 40 + 60}%` : '0%' }} />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400 italic">G{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Section: Biophilic & Data Driven */}
      <section id="inteligencia" className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] italic">
                <Beaker size={14} /> Inteligência Ambiental
              </div>
              <h2 className="text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter italic">
                Ambiência é <br /><span className="text-indigo-400">Conversão Alimentar.</span>
              </h2>
              <p className="text-xl text-slate-400 font-bold italic leading-relaxed">
                Sensores de NH3, CO2 e Temperatura integrados ao seu dashboard. Antecipe problemas respiratórios e otimize o conforto térmico para máxima performance genética.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                {[
                  { label: "Amônia (NH3)", value: designConfig.nh3Value || "8ppm", status: designConfig.nh3Status || "Ideal", color: (designConfig.nh3Status === 'Ideal' || !designConfig.nh3Status) ? "text-emerald-400" : "text-amber-400" },
                  { label: "Umidade", value: designConfig.humValue || "62%", status: designConfig.humStatus || "Monitorar", color: designConfig.humStatus === 'Ideal' ? "text-emerald-400" : "text-amber-400" }
                ].map((s, i) => (
                  <div key={i} className="p-6 rounded-[18px] bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{s.label}</div>
                    <div className="text-3xl font-black text-white italic mb-1">{s.value}</div>
                    <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${s.color}`}>{s.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
              <div className="relative bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-3xl shadow-2xl overflow-hidden group hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-10">
                  <div className="text-xs font-black text-white uppercase tracking-widest italic">Curva de GPD Preditiva</div>
                  <div className="p-2 bg-indigo-500 rounded-lg text-white"><LineChart size={18} /></div>
                </div>
                {/* Mock Chart Area */}
                <div className="h-64 flex items-end gap-2 px-4">
                  {[30, 45, 40, 60, 75, 70, 90, 100, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-1000 group-hover:from-emerald-500 group-hover:to-emerald-400 shadow-lg" style={{ height: `${h}%` }} />
                  ))}
                </div>
                
                {/* AI Specialist Insight Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-start gap-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="p-2 bg-amber-500 rounded-lg text-white"><AlertCircle size={16} /></div>
                  <div>
                    <div className="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-1 italic">{designConfig.expertTitle || "Insight de IA Agrotech"}</div>
                    <p className="text-[10px] text-slate-300 font-bold italic leading-tight">
                      {designConfig.expertDesc || "Aumento de 2ppm de Amônia detectado no Galpão 04. Recomendado ajuste automático de exaustores em +15%."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
                  <span>Dia 1</span>
                  <span>Semana 3</span>
                  <span>Semana 6 (Abate)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Biosecurity & Sanitary Fortress */}
      <section id="biosseguridade" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h3 className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.6em] italic">Segurança Biológica</h3>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">{designConfig.bioTitle || "Sua Unidade como uma Fortaleza."}</h2>
            <p className="text-xl text-slate-400 font-bold italic leading-relaxed">
              {designConfig.bioDesc || "Controle inalterável de visitas, cronogramas de vacinação (Marek, Gumboro, Bronquite) e auditoria de vazio sanitário."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Log de Vacinação", 
                desc: "Rastreabilidade completa de lotes de vacinas e aplicadores, com alertas de reforço automáticos.",
                color: "indigo" 
              },
              { 
                icon: Wind, 
                title: "Vazio Sanitário", 
                desc: "Monitoramento digital do intervalo entre lotes para garantir a eliminação de patógenos.",
                color: "emerald" 
              },
              { 
                icon: Beaker, 
                title: "Análise Laboratorial", 
                desc: "Gestão de laudos RT e monitoramento de salmonela e micoplasma em tempo real.",
                color: "amber" 
              }
            ].map((feature, i) => (
              <div key={i} className="p-12 rounded-[18px] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/20 transition-all duration-500 group">
                <div className={`mb-8 p-4 bg-${feature.color}-50 text-${feature.color}-600 rounded-2xl inline-block group-hover:bg-${feature.color}-600 group-hover:text-white transition-all`}>
                  <feature.icon size={24} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 italic uppercase tracking-wider">{feature.title}</h4>
                <p className="text-slate-500 font-bold italic leading-relaxed opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Phase 3: Sanitary Protocol Timeline */}
          <div className="mt-24 p-10 rounded-[32px] bg-indigo-50/30 border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <ShieldCheck size={160} />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/3">
                <h4 className="text-3xl font-black text-indigo-900 italic tracking-tighter mb-4">Cronograma de <br />Imunização Crítica</h4>
                <p className="text-xs text-indigo-700/60 font-bold italic">Rastreabilidade total desde a eclosão até o abate.</p>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { day: "D1", task: "Marek + Gumboro", status: "Concluído" },
                  { day: "D7", task: "Coccidiose", status: "Concluído" },
                  { day: "D14", task: "Newcastle", status: "Pendente" },
                  { day: "D21", task: "IBP", status: "Programado" }
                ].map((step, i) => (
                  <div key={i} className="relative group p-6 rounded-2xl bg-white/60 border border-white shadow-sm hover:-translate-y-1 transition-all">
                    <div className="text-[10px] font-black text-indigo-600 mb-2 italic">{step.day}</div>
                    <div className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight">{step.task}</div>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${step.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'}`}>{step.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 4: Financial Command */}
      <section id="financeiro" className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
              <div className="relative p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-2xl shadow-3xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="text-xs font-black text-white uppercase tracking-[0.4em] italic">Cash Flow Analítico</div>
                  <div className="px-5 py-2 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest italic shadow-lg shadow-emerald-500/20">Saldo: R$ 842k</div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: "Recebíveis (Ovos)", val: "+R$ 142.500", p: "80%", c: "bg-emerald-500" },
                    { label: "Custo Alimentar", val: "-R$ 68.200", p: "45%", c: "bg-rose-500" },
                    { label: "Logística & Frete", val: "-R$ 12.400", p: "15%", c: "bg-amber-500" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{item.label}</span>
                        <span className={`text-xs font-black italic ${item.c === 'bg-emerald-500' ? 'text-emerald-400' : 'text-white'}`}>{item.val}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.c} rounded-full transition-all duration-1000 delay-500`} style={{ width: item.p }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg text-white"><BarChart size={14} /></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Previsão ROI Ciclo</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400 italic">24.8%</span>
                </div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.5em] italic">
                <Landmark size={14} /> Comando Financeiro
              </div>
              <h2 
                className={`${designConfig.finTitleSize || 'text-7xl lg:text-8xl'} font-black leading-[0.85] tracking-tighter italic`}
                style={{ color: designConfig.finTitleColor || '#ffffff' }}
              >
                {designConfig.finTitle || "Sua Granja, um Ativo de Elite."}
              </h2>
              <p className="text-xl text-slate-400 font-bold italic leading-relaxed max-w-xl">
                {designConfig.finDesc || "Conciliação bancária automática, DRE por lote e gestão de fornecedores integrada. Visualize a rentabilidade real de cada ave em tempo real."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-8 py-5 bg-white text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl">Auditoria Fiscal</div>
                <div className="px-8 py-5 bg-indigo-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl shadow-indigo-900/20">Marketplace Insumos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 5: Supply Chain Intelligence */}
      <section id="suprimentos" className="py-40 bg-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity duration-1000 grayscale" style={{ backgroundImage: 'url("/images/supply-bg.png")' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[9px] font-black uppercase tracking-[0.5em] italic">
                  <Truck size={14} /> Supply Chain Intelligence
                </div>
                <h2 
                  className={`${designConfig.opTitleSize || 'text-7xl lg:text-8xl'} font-black leading-[0.85] tracking-tighter italic`}
                  style={{ color: designConfig.opTitleColor || '#0f172a' }}
                >
                  {designConfig.opTitle || "Cadeia de Suprimentos."}
                </h2>
                <p className="text-xl text-slate-400 font-bold italic leading-relaxed max-w-xl">
                  {designConfig.opDesc || "Logística preditiva e controle de estoque ininterrupto. Nunca pare a produção por falta de insumos críticos."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Eficiência Logística</div>
                  <div className="text-4xl font-black text-slate-900 italic tracking-tighter">94.2%</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Otimização de Rotas</div>
                </div>
                <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 space-y-4">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Savings Anual</div>
                  <div className="text-4xl font-black text-indigo-600 italic tracking-tighter">R$ 42k</div>
                  <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest italic">Via Marketplace Elite</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full" />
              <div className="relative p-10 bg-slate-900 rounded-[48px] shadow-3xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} className="text-white" /></div>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-10 italic border-l-4 border-amber-500 pl-4">Status de Insumos Críticos</h4>
                <div className="space-y-6">
                  {[
                    { name: "NutriElite Bio", item: "Ração Crescimento", stock: "15%", status: "Crítico", color: "bg-rose-500", textColor: "text-rose-400" },
                    { name: "VetLab Pro", item: "Vacina Newcastle", stock: "85%", status: "Seguro", color: "bg-emerald-500", textColor: "text-emerald-400" },
                    { name: "AgroEnergia", item: "Diesel Gerador", stock: "40%", status: "Monitorar", color: "bg-amber-500", textColor: "text-amber-400" }
                  ].map((sup, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-black text-white italic">{sup.name}</div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{sup.item}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-[10px] font-black uppercase ${sup.textColor}`}>{sup.status}</div>
                          <div className="text-[9px] font-bold text-slate-400">{sup.stock} em estoque</div>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${sup.color} rounded-full`} style={{ width: sup.stock }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 6: ROI Tactical Simulator */}
      <section 
        className="py-40 bg-slate-50 relative overflow-hidden group"
        style={{ backgroundImage: `url("${designConfig.roiBgUrl || ''}")`, backgroundSize: 'cover' }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="p-12 lg:p-24 rounded-[48px] bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-400/30 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <TrendingUp size={240} />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest italic">
                  <Calculator size={16} /> Calculadora de Eficiência
                </div>
                <h4 
                  className={`${designConfig.roiTitleSize || 'text-6xl'} font-black italic tracking-tighter leading-tight`}
                  style={{ color: designConfig.roiTitleColor || '#ffffff' }}
                >
                  {designConfig.roiTitle || "Simulador de Rentabilidade Elite."}
                </h4>
                <p className="text-xl text-indigo-100 font-bold italic leading-relaxed max-w-md">
                  {designConfig.roiDesc || "Ajuste seus parâmetros de CA e GPD para visualizar o lucro líquido projetado antes mesmo do encerramento do lote."}
                </p>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-indigo-200 uppercase tracking-widest italic">
                      <span>População do Lote</span>
                      <span className="text-white">50.000 Aves</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-2/3 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-indigo-200 uppercase tracking-widest italic">
                      <span>Meta de CA (Conversão)</span>
                      <span className="text-emerald-400">1.58</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-4/5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-16 rounded-[48px] bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-6 shadow-2xl">
                <div className="text-[12px] font-black text-indigo-200 uppercase tracking-[0.4em] italic">Previsão de Lucro Líquido</div>
                <div className="text-8xl font-black text-white italic tracking-tighter">R$ 142.800</div>
                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest italic bg-emerald-500/10 px-6 py-3 rounded-full border border-emerald-500/20">+14% vs Média Regional</div>
                <button className="mt-12 w-full py-8 bg-white text-indigo-900 rounded-[24px] text-[12px] font-black uppercase tracking-[0.5em] shadow-3xl hover:bg-indigo-50 transition-all italic">Refinar Parâmetros de Elite</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Command Interface: Bento Grid Showcase */}
      <section className="py-40 bg-white relative overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-5 transition-opacity duration-1000 grayscale"
          style={{ backgroundImage: 'url("/images/tactical-bg.png")' }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.02),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-950 rounded-[40px] p-12 lg:p-24 overflow-hidden relative border border-white/5 shadow-3xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("/images/tactical-bg.png")' }} />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[100px]" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter italic">
                    {designConfig.tacTitle || "Centro de Comando Tático."}
                  </h2>
                  <p className="text-2xl text-slate-400 font-bold italic leading-relaxed max-w-xl">
                    {designConfig.tacDesc || "A interface que os maiores produtores do Brasil utilizam para gerenciar milhares de aves com um clique."}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {((globalConfig as any)?.featuresJson?.length > 0) ? (
                    (globalConfig as any).featuresJson.map((item: any, i: number) => {
                      const Icon = getIcon(item.icon);
                      return (
                        <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-500">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Icon size={20} />
                          </div>
                          <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{item.title}</span>
                          <p className="text-[10px] text-slate-400 font-bold italic leading-tight">{item.desc}</p>
                        </div>
                      );
                    })
                  ) : (
                    [
                      { text: "Monitoramento de GPD em tempo real", icon: Activity },
                      { text: "Controle de Ração & Estoque Crítico", icon: Layers },
                      { text: "Escoamento & Logística de Ovos", icon: Truck },
                      { text: "DRE Automatizado por Lote", icon: BarChart3 }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-500">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <item.icon size={20} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{item.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* UI Mockup Display Elite */}
              <div className="relative group perspective-1000">
                <div className="absolute -inset-10 bg-indigo-500/30 blur-[120px] rounded-full opacity-30 group-hover:opacity-60 transition-all duration-1000" />
                <div className="relative bg-slate-900 border border-white/10 rounded-[40px] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform hover:rotate-y-6 hover:-rotate-x-6 transition-all duration-700">
                  <div className="bg-slate-950 rounded-[32px] p-8 border border-white/5 overflow-hidden relative">
                    {/* Header Mockup */}
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 italic uppercase tracking-widest">Dashboard Matriz</div>
                    </div>

                    {/* Stats Grid Mockup */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-[7px] font-black text-slate-500 uppercase mb-1">GPD Global</div>
                        <div className="text-xl font-black text-white italic tracking-tighter">64.8g</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="text-[7px] font-black text-indigo-400 uppercase mb-1">CA Ciclo</div>
                        <div className="text-xl font-black text-white italic tracking-tighter">1.62</div>
                      </div>
                    </div>

                    {/* Real-time Feed Pulse */}
                    <div className="space-y-3">
                      <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-center gap-3 relative overflow-hidden group/item">
                        <div className="flex justify-between items-center relative z-10">
                          <span className="text-[8px] font-black text-white uppercase italic">Consumo Ração / Dia</span>
                          <span className="text-[8px] font-black text-emerald-400">98% Meta</span>
                        </div>
                        <div className="h-6 flex items-end gap-1 px-1 relative z-10">
                          {[40, 60, 55, 80, 75, 90, 85, 95, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-500/50 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-indigo-500/5 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                    </div>

                    {/* Radar Pulse Effect */}
                    <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 border border-indigo-500/20 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing: The Investment of Champions */}
      <section id="planos" className="py-40 px-6 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col items-center space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.4em] italic">Premium Tier Exclusive</span>
            </div>
            
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-8xl lg:text-[120px] font-black text-slate-900 tracking-[calc(-0.06em)] italic leading-[0.8] text-center">
                {designConfig.premiumTitle || "O Futuro é Premium."}
              </h2>
              <p className="text-center text-slate-400 font-bold italic tracking-[0.25em] uppercase text-[12px] max-w-2xl mx-auto leading-relaxed">
                {designConfig.premiumDesc || "A escala definitiva para grupos produtores de alta performance que não aceitam nada menos que o topo do mercado."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
            {plans.map((plan: any) => (
              <div 
                key={plan.id}
                className={`group p-12 rounded-[40px] border transition-all duration-700 flex flex-col justify-between hover:shadow-[0_40px_100px_-15px_rgba(79,70,229,0.15)] ${
                  plan.name === 'Elite' || plan.name === 'Ouro'
                  ? 'border-indigo-600 bg-white shadow-3xl scale-105 z-10 py-20'
                  : 'border-slate-100 bg-slate-50/50 backdrop-blur-xl'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] italic">{plan.name}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Plano Profissional</span>
                    </div>
                    {(plan.name === 'Elite' || plan.name === 'Ouro') && (
                      <div className="px-5 py-2 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-indigo-100 animate-pulse">ELITE MASTER</div>
                    )}
                  </div>
                  
                  <div className="mb-16">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-400 italic">R$</span>
                      <span className="text-8xl font-black tracking-tighter text-slate-900 italic">{Number(plan.priceMonthly).toFixed(0)}</span>
                      <span className="text-slate-300 font-black italic text-[10px] tracking-widest uppercase">/ mensal</span>
                    </div>
                  </div>

                  <ul className="space-y-10 mb-16">
                    {[
                      { icon: Activity, text: `${plan.maxFlocks} Lotes Monitorados` },
                      { icon: HouseIcon, text: `${plan.maxHouses} Unidades de Produção` },
                      { icon: ShieldCheck, text: "Comando Biosseguridade Elite" },
                      { icon: Landmark, text: "Financeiro Multi-Cooperativa" }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-5 text-slate-600 font-bold italic text-xs uppercase tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shrink-0">
                          <item.icon size={18} />
                        </div>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href="/sign-up"
                  className={`w-full py-7 text-[12px] font-black text-center uppercase tracking-[0.4em] transition-all rounded-[24px] italic shadow-lg ${
                    plan.name === 'Elite' || plan.name === 'Ouro'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                  }`}
                >
                  Ativar {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final: High Stakes ROI */}
      <section className="py-64 relative overflow-hidden group">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/roi-bg.png" 
            alt="Elite ROI" 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3000ms] brightness-[0.25]"
          />
<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter italic mb-8">
              {designConfig.roiTitle || "ROI Avícola"} Hoje.
            </h2>
            <p className="text-2xl text-indigo-200/80 font-bold italic mb-12 max-w-2xl mx-auto">
              {designConfig.roiDesc || "Junte-se a mais de 500 granjas de elite que já digitalizaram sua lucratividade."}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {!userId ? (
              <Link 
                href="/sign-up" 
                className="px-20 py-8 bg-indigo-600 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 transition-all italic flex items-center gap-4 group/btn"
              >
                Começar Agora
                <ChevronRight size={22} className="group-hover/btn:translate-x-3 transition-transform" />
              </Link>
            ) : (
              <Link 
                href="/dashboard" 
                className="px-20 py-8 bg-slate-900 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all italic flex items-center gap-4 group/btn"
              >
                Retornar ao Painel
                <ChevronRight size={22} className="group-hover/btn:translate-x-3 transition-transform" />
              </Link>
            )}
            <Link 
              href="/demo" 
              className="px-20 py-8 bg-white/5 backdrop-blur-xl text-white border border-white/20 rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white/10 transition-all italic"
            >
              Agendar Demo Elite
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-20 flex flex-wrap justify-center gap-16 opacity-30 group-hover:opacity-60 transition-all grayscale hover:grayscale-0 duration-1000">
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest italic"><ShieldCheck size={20} /> Segurança Bancária</div>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest italic"><Zap size={20} /> Dados em Real-Time</div>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest italic"><Target size={20} /> Precisão Genética</div>
          </div>
        </div>
      </section>

      {/* Footer Luxury Signature */}
      <footer className="py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <Bird size={20} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                AGROTECH <span className="text-indigo-600">365</span>
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Engineering the Future of Agribusiness</p>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            <a href="#" className="hover:text-indigo-600">Privacidade</a>
            <a href="#" className="hover:text-indigo-600">Termos</a>
            <a href="#" className="hover:text-indigo-600">LinkedIn</a>
          </div>

          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic text-center md:text-right">
            © 2026 AGROVANTAGEM 365 • TECNOLOGIA BRASILEIRA DE ELITE
          </p>
        </div>
      </footer>
    </main>
  );
}
