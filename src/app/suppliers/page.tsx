import { 
  Plus, 
  Briefcase, 
  Phone, 
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Package,
  Truck,
  DollarSign
} from "lucide-react";
import { getTenantDb } from "@/lib/tenant";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid, DashboardCard } from "@/components/dashboard/DashboardGrid";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import Link from "next/link";
import UserNav from "@/components/layout/UserNav";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function SuppliersPage() {
  const tenantPrisma = await getTenantDb();

  const suppliers = await tenantPrisma.supplier.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { expenses: true }
      }
    }
  });

  return (
    <DashboardContainer>
      
      {/* HEADER: Supply Chain Cockpit */}
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Cadeia de Suprimentos</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Gestão de <span className="text-primary italic">Fornecedores</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-xl">
            Centralize seus parceiros de insumos, ração e serviços para uma rastreabilidade contábil impecável.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <LuxuryButton 
            variant="primary"
            icon="building"
            href="/suppliers/new"
          >
            Novo Fornecedor
          </LuxuryButton>
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          <UserNav />
        </div>
      </DashboardItem>

      {/* STATS OVERVIEW */}
      <DashboardItem className="mb-10">
        <DashboardGrid cols={3} className="gap-6">
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-[12px]">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Parceiros Ativos</p>
              <h3 className="text-xl font-black text-slate-900">{suppliers.length} Empresas</h3>
            </div>
          </div>
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-primary rounded-[12px]">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Categorias</p>
              <h3 className="text-xl font-black text-slate-900">{new Set(suppliers.map((s: any) => s.category)).size} Segmentos</h3>
            </div>
          </div>
          <div className="bento-card-elite flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[12px]">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Volume de Compras (30d)</p>
              <h3 className="text-xl font-black text-slate-900">R$ ---</h3>
            </div>
          </div>
        </DashboardGrid>
      </DashboardItem>

      {/* SUPPLIERS GRID */}
      <DashboardItem>
        <DashboardGrid cols={3} className="gap-6">
          {suppliers.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[6px]">
              <p className="text-xs text-slate-400 italic font-medium">Nenhum fornecedor cadastrado.</p>
            </div>
          ) : (
            (suppliers as any[]).map((supplier: any) => (
              <DashboardCard key={supplier.id} className="group !p-8 rounded-[18px] bg-white border border-slate-100 hover:border-amber-200 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/5">
                <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-200 group-hover:rotate-3 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-1">{supplier.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{supplier.category || 'Fornecedor Geral'}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Phone size={10} />
                    </div>
                    <span className="text-[11px] font-medium">{supplier.phone || '---'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Briefcase size={10} />
                    </div>
                    <span className="text-[11px] font-medium">CNPJ: {supplier.cnpj || '---'}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pedidos</p>
                    <p className="text-sm font-black text-slate-900">{supplier._count.expenses} Docs</p>
                  </div>
                  <LuxuryButton 
                    href={`/finance/suppliers/${supplier.id}`}
                    variant="outline"
                    className="h-9 px-4 text-[10px]"
                  >
                    Histórico
                  </LuxuryButton>
                </div>
              </DashboardCard>
            ))
          )}
        </DashboardGrid>
      </DashboardItem>

    </DashboardContainer>
  );
}
