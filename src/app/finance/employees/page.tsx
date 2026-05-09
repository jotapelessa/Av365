import { 
  Plus, 
  Users, 
  Briefcase,
  DollarSign,
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { getTenantDb } from "@/lib/tenant";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import UserNav from "@/components/layout/UserNav";
import FinanceEmployeesListClient from "./FinanceEmployeesListClient";

export default async function EmployeesPage() {
  const dbClient = await getTenantDb();
  
  const employees = await dbClient.employee.findMany({
    orderBy: { name: 'asc' },
    include: {
      expenses: {
        take: 1,
        orderBy: { date: 'desc' }
      }
    }
  });

  const sanitizedEmployees = JSON.parse(JSON.stringify(employees));
  const activeEmployees = sanitizedEmployees.filter((e: any) => e.status === 'ACTIVE');
  const totalSalaries = activeEmployees.reduce((acc: number, curr: any) => acc + Number(curr.baseSalary || 0), 0);

  return (
    <DashboardContainer>
      
      {/* HEADER */}
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Recursos Humanos</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
            <span className="text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-1">
              <Users size={10} /> Time de Elite
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Gestão de <span className="text-primary italic">Colaboradores</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Gerencie sua equipe, cargos e folha de pagamento simplificada.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <LuxuryButton 
            variant="primary"
            icon="user-plus"
          >
            Novo Funcionário
          </LuxuryButton>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          <UserNav />
        </div>
      </DashboardItem>

      {/* KPI GRID */}
      <DashboardItem className="mb-12">
        <DashboardGrid cols={3}>
          <div className="ui-card">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-[6px]">
                <Briefcase size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipe Ativa</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{activeEmployees.length} <span className="text-sm text-slate-400">pessoas</span></h3>
            <p className="text-[10px] font-bold text-success mt-2 italic uppercase tracking-widest leading-none">Operação em plena carga</p>
          </div>

          <div className="ui-card bg-slate-900 text-white border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-white/10 rounded-[6px]">
                <DollarSign size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Folha Base</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-success-text">R$ {totalSalaries.toLocaleString('pt-BR')}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase tracking-widest leading-none">Custo salarial mensal estimado</p>
          </div>

          <div className="ui-card">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-[6px]">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retenção</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">98%</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase tracking-widest leading-none">Índice de estabilidade</p>
          </div>
        </DashboardGrid>
      </DashboardItem>

      {/* FILTERS & SEARCH */}
      <DashboardItem className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, CPF ou cargo..." 
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-[6px] text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
          <button className="h-12 px-6 bg-white border border-slate-100 rounded-[6px] text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> Filtros
          </button>
        </div>
      </DashboardItem>

      {/* EMPLOYEES TABLE */}
      <DashboardItem>
        <div className="ui-card !p-0 overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/10">
          <FinanceEmployeesListClient employees={sanitizedEmployees} />
        </div>
      </DashboardItem>

    </DashboardContainer>
  );
}
