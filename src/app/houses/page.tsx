import { getHouses } from "./actions";
import { Home, Plus, Info, Zap } from "lucide-react";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import UserNav from "@/components/layout/UserNav";
import HouseCardExpert from "@/components/houses/HouseCardExpert";
import HouseStatsSummary from "@/components/houses/HouseStatsSummary";
import HousePageClient from "@/components/houses/HousePageClient";
import HouseEmptyState from "@/components/houses/HouseEmptyState";

export default async function HousesPage() {
  const houses = await getHouses();

  return (
    <DashboardContainer>
      
      {/* HEADER & ACTIONS (CLIENT) */}
      <HousePageClient />

      {/* STATS SUMMARY */}
      <DashboardItem data-audit="houses__section__summary">
        <HouseStatsSummary houses={houses} />
      </DashboardItem>

      {/* HOUSES GRID: 4-3-1 Responsive Pattern */}
      <DashboardItem data-audit="houses__section__grid">
        {houses.length === 0 ? (
          <div data-audit="houses__state__empty">
            <HouseEmptyState />
          </div>
        ) : (
          <DashboardGrid cols={4} auditId="houses__grid__list">
            {houses.map((house: any) => (
              <HouseCardExpert 
                key={house.id} 
                house={house} 
              />
            ))}
          </DashboardGrid>
        )}
      </DashboardItem>

      {/* INFRASTRUCTURE TIP */}
      <DashboardItem className="mt-8" data-audit="houses__section__tip">
        <div className="p-6 rounded-[6px] bg-primary-bg border border-primary/10 flex gap-4 items-start">
          <div className="p-2 rounded-[6px] bg-white text-primary shadow-sm" data-audit="houses__tip__icon">
            <Info size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1" data-audit="houses__tip__title">Dica de Infraestrutura</h4>
            <p className="text-sm text-primary/60 leading-relaxed font-medium" data-audit="houses__tip__content">
              A manutenção preventiva dos galpões pode reduzir em até <span className="text-primary font-bold underline decoration-primary/20 underline-offset-4">12%</span> os custos operacionais de energia e ambiência.
            </p>
          </div>
        </div>
      </DashboardItem>

    </DashboardContainer>
  );
}
