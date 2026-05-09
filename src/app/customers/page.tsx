import { 
  Handshake, 
  Search,
  Filter,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import { getTenantDb } from "@/lib/tenant";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid, DashboardCard } from "@/components/dashboard/DashboardGrid";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import UserNav from "@/components/layout/UserNav";
import CustomersListClient from "./CustomersListClient";

export default async function CustomersPage() {
  const tenantPrisma = await getTenantDb();

  const customers = await tenantPrisma.customer.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { sales: true }
      }
    }
  });

  const sanitizedCustomers = JSON.parse(JSON.stringify(customers));

  return (
    <DashboardContainer>
      
      {/* HEADER: Market & Clients Cockpit */}
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Gestão de Mercado</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Carteira de <span className="text-primary italic">Clientes</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl">
            Acompanhe seus compradores, frequência de pedidos e garanta a fidelidade da sua base.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <LuxuryButton 
            variant="primary"
            icon="plus"
            href="/customers/new"
          >
            Novo Cliente
          </LuxuryButton>
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          <UserNav />
        </div>
      </DashboardItem>

      {/* STATS OVERVIEW */}
      <DashboardItem className="mb-10">
        <DashboardGrid cols={3} className="gap-6">
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-[12px]">
              <Handshake size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Clientes Totais</p>
              <h3 className="text-xl font-black text-slate-900">{sanitizedCustomers.length} Registrados</h3>
            </div>
          </div>
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[12px]">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recorrência</p>
              <h3 className="text-xl font-black text-slate-900">84% Ativos</h3>
            </div>
          </div>
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-[12px]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Volume de Vendas (30d)</p>
              <h3 className="text-xl font-black text-slate-900">R$ ---</h3>
            </div>
          </div>
        </DashboardGrid>
      </DashboardItem>

      {/* CUSTOMERS LIST (Dense Table) */}
      <DashboardItem>
        <DashboardCard className="!p-0 overflow-hidden border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-[18px]">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Filtrar por nome ou CNPJ..." 
                className="pl-11 pr-4 h-12 bg-white border border-slate-100 rounded-[12px] text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all w-full shadow-inner-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-lg transition-all">
              <Filter size={14} /> Filtros Avançados
            </button>
          </div>

          <CustomersListClient customers={sanitizedCustomers} />
        </DashboardCard>
      </DashboardItem>

    </DashboardContainer>
  );
}

function UserPlus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  );
}
