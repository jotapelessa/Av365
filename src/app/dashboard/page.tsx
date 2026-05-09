import { 
  Bird, 
  Egg, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Zap,
  DollarSign,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import ProductionChart from "@/components/flocks/ProductionChart";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardCard } from "@/components/dashboard/DashboardGrid";
import { DashboardGrid } from "@/components/dashboard/DashboardGridContainer";
import { 
  getDashboardStats, 
  getDashboardTasks, 
  getInfrastructureSummary,
  getActiveFlocks,
  getTopPerformers,
  getAmbianceData
} from "./actions";
import { KPICardExpert } from "@/components/dashboard/KPICardExpert";
import { InfrastructureHub } from "@/components/dashboard/InfrastructureHub";
import { ActiveTasksHub } from "@/components/dashboard/ActiveTasksHub";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { FlockCarousel } from "@/components/dashboard/FlockCarousel";
import { TopPerformersHub } from "@/components/dashboard/TopPerformersHub";
import { AmbianceMonitor } from "@/components/dashboard/AmbianceMonitor";
import { FinancialPerformanceHub } from "@/components/dashboard/FinancialPerformanceHub";
import { ResourceIntelligenceHub } from "@/components/dashboard/ResourceIntelligenceHub";
import UserNav from "@/components/layout/UserNav";

export default async function DashboardPage() {
  const [stats, tasks, infra, flocks, topPerformers, ambiance] = await Promise.all([
    getDashboardStats(),
    getDashboardTasks(),
    getInfrastructureSummary(),
    getActiveFlocks(),
    getTopPerformers(),
    getAmbianceData()
  ]);

  if (!stats) return null;

  // Lógica de Alerta Bio-Técnico
  const hasLowProduction = parseFloat(stats.layingRate) < 85;
  const hasHighMortality = parseFloat(stats.mortalityRate) > 0.1;

  return (
    <DashboardContainer>
      
      {/* HEADER: Analytical Cockpit */}
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5" data-audit="dashboard__header__live-indicator">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Monitoramento em Tempo Real</span>
          </div>
          <h1 
            data-audit="dashboard__header__title"
            className="text-h1 text-slate-900 tracking-tight leading-none"
          >
            Cockpit <span className="text-primary italic">Bio-Operacional</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Bio-Security Status */}
          <div data-audit="dashboard__header__biosecurity-badge" className="hidden md:flex items-center gap-3 px-4 py-2 rounded-[12px] bg-emerald-50 border border-emerald-100 text-emerald-600">
            <ShieldCheck size={18} />
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest leading-none">Bio-Seguridade</p>
              <p className="text-[10px] font-bold leading-none mt-1">Status: Protegido</p>
            </div>
          </div>

          <div data-audit="dashboard__header__user-nav" className="flex items-center gap-3 bg-white p-1 pr-4 rounded-[12px] border border-slate-100 shadow-sm">
            <UserNav />
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 leading-none">Produtor Master</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Gestor AgroVantagem</p>
            </div>
          </div>
        </div>
      </DashboardItem>

      {/* QUICK ACTIONS BAR */}
      <DashboardItem className="mb-8" data-audit="dashboard__section__quick-actions">
        <DashboardQuickActions />
      </DashboardItem>

      {/* ALERTS (Conditional) */}
      {(hasLowProduction || hasHighMortality) && (
        <DashboardItem className="mb-8" data-audit="dashboard__section__alerts">
          <div className="p-4 rounded-[18px] bg-rose-50 border border-rose-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-[12px]">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-rose-900 uppercase tracking-tight">Alerta Bio-Técnico Ativo</p>
              <p className="text-xs text-rose-600 font-medium italic">
                {hasLowProduction && "Baixa taxa de postura detectada. "}
                {hasHighMortality && "Mortalidade acima do limite técnico."}
              </p>
            </div>
          </div>
        </DashboardItem>
      )}

      {/* LEVEL 4: Vital KPIs (4 Cards) */}
      <DashboardItem className="mb-6">
        <DashboardGrid className="gap-5" auditId="dashboard__grid__kpis">
          <KPICardExpert 
            auditId="dashboard__kpi__ovos-coletados"
            label="Ovos Coletados" 
            value={stats.eggsToday.toLocaleString('pt-BR')} 
            icon="egg" 
            trend={stats.eggTrend} 
            trendType={stats.eggTrendType as any}
            color="text-emerald-600"
            bg="bg-emerald-50"
            span={3}
            data={stats.sparklines.eggs}
          />
          <KPICardExpert 
            auditId="dashboard__kpi__taxa-postura"
            label="Taxa de Postura" 
            value={`${stats.layingRate}%`} 
            icon="trending" 
            trend="Ideal" 
            trendType="positive"
            color="text-primary"
            bg="bg-indigo-50"
            span={3}
            data={stats.sparklines.posture}
          />
          <KPICardExpert 
            auditId="dashboard__kpi__receita-mensal"
            label="Receita Mensal" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.finance.monthlyRevenue)} 
            icon="dollar" 
            trend="Faturamento" 
            trendType="positive"
            color="text-emerald-600"
            bg="bg-emerald-50"
            span={3}
          />
          <KPICardExpert 
            auditId="dashboard__kpi__plantel-ativo"
            label="Plantel Ativo" 
            value={stats.birdsCount.toLocaleString('pt-BR')} 
            icon="bird" 
            trend="Aves Vivas" 
            trendType="neutral"
            color="text-amber-600"
            bg="bg-amber-50"
            span={3}
          />
        </DashboardGrid>
      </DashboardItem>

      {/* FINANCE CENTER: Strategic Insight */}
      <DashboardItem className="mb-6" data-audit="dashboard__section__finance">
        <FinancialPerformanceHub stats={stats.finance} />
      </DashboardItem>

      {/* LEVEL 2: Analytical Hubs */}
      <DashboardItem className="mb-6">
        <DashboardGrid className="gap-5" auditId="dashboard__grid__analytical-hubs">
          {/* Produção vs Metas */}
          <DashboardCard span={6} auditId="dashboard__hub__production-chart" className="bg-white border border-slate-50 shadow-sm min-h-[420px] !p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-50 text-primary">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none">Produção vs Metas</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Desempenho biológico (7 dias)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-tighter">Status: Acima da Meta</span>
              </div>
            </div>
            <div className="h-[320px]">
              <ProductionChart data={stats.lastWeekRecords} birdQuantity={stats.birdsCount} />
            </div>
          </DashboardCard>

          {/* Ambiência Monitor */}
          <DashboardCard span={6} auditId="dashboard__hub__ambiance-monitor" className="bg-white border border-slate-50 shadow-sm p-0 overflow-hidden">
            <AmbianceMonitor data={ambiance} />
          </DashboardCard>

          {/* Insumos Intelligence */}
          <DashboardCard span={4} auditId="dashboard__hub__resource-intelligence" className="bg-white border border-slate-50 shadow-sm p-0">
            <ResourceIntelligenceHub resources={stats.resources} sparkline={stats.sparklines.resources} />
          </DashboardCard>

          {/* Próximas Tarefas */}
          <DashboardCard span={4} auditId="dashboard__hub__tasks" className="bg-white border border-slate-50 shadow-sm p-0">
            <ActiveTasksHub tasks={tasks} />
          </DashboardCard>

          {/* Infraestrutura */}
          <DashboardCard span={4} auditId="dashboard__hub__infrastructure" className="bg-white border border-slate-50 shadow-sm p-0">
            <InfrastructureHub summary={infra || { total: 0, busy: 0, empty: 0, maintenance: 0, occupancyRate: 0 }} />
          </DashboardCard>

          {/* Top Performance Ranking */}
          <DashboardCard span={12} auditId="dashboard__hub__top-performers" className="bg-white border border-slate-50 shadow-sm p-0">
            <TopPerformersHub flocks={topPerformers} />
          </DashboardCard>
        </DashboardGrid>
      </DashboardItem>

      {/* LEVEL 1: Featured Section (Flock Monitoring) */}
      <DashboardItem className="pb-10" data-audit="dashboard__section__flocks">
        <FlockCarousel flocks={flocks} />
      </DashboardItem>

    </DashboardContainer>
  );
}
