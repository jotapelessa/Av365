import { getTenantDb } from "@/lib/tenant";
import { Bird, Plus } from "lucide-react";
import Link from "next/link";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import UserNav from "@/components/layout/UserNav";
import FlockCardExpert from "@/components/flocks/FlockCardExpert";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export default async function FlocksPage() {
  const tenantPrisma = await getTenantDb();

  // Serialização profunda para evitar erro de Decimal em Client Components
  const flocks = JSON.parse(JSON.stringify(await tenantPrisma.flock.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      records: {
        orderBy: { date: 'desc' },
        take: 7
      }
    }
  })));

  return (
    <DashboardContainer>
      
      {/* HEADER: Executive Style */}
      <DashboardItem className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Produção Animal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight italic">
            Gestão de <span className="text-primary">Lotes</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Gerencie o ciclo de vida, linhagens e a performance de postura.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <LuxuryButton 
            href="/flocks/new"
            variant="primary"
            icon="plus"
          >
            Novo Lote
          </LuxuryButton>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
          
          <div className="flex items-center gap-3 bg-white p-1 pr-1 rounded-[6px] border border-slate-100 shadow-sm">
            <UserNav />
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-900 leading-none">Produtor Master</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Gestor</p>
            </div>
          </div>
        </div>
      </DashboardItem>

      {flocks.length === 0 ? (
        <DashboardItem>
          <div className="flex flex-col items-center justify-center p-20 bento-card-elite border-dashed bg-slate-50/50">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-indigo-500 mb-6">
              <Bird size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum lote ativo</h3>
            <p className="text-slate-400 text-center max-w-sm mb-8 font-medium">
              Inicie sua jornada cadastrando o primeiro lote de aves para monitorar a produção.
            </p>
            <LuxuryButton 
              href="/flocks/new"
              variant="outline"
              icon="plus"
            >
              Começar Agora
            </LuxuryButton>
          </div>
        </DashboardItem>
      ) : (
        <DashboardItem>
          <DashboardGrid cols={4} className="gap-8">
            {flocks.map((flock: any) => (
              <FlockCardExpert 
                key={flock.id} 
                flock={flock} 
              />
            ))}
          </DashboardGrid>
        </DashboardItem>
      )}
    </DashboardContainer>
  );
}
