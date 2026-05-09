'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getProductionData() {
  const db = await getTenantDb();

  const flocks = await db.flock.findMany({
    where: { status: 'ACTIVE' },
    include: {
      records: {
        orderBy: { date: 'desc' },
        take: 30 // Últimos 30 dias
      }
    }
  });

  // KPIs Globais
  const totalEggs = flocks.reduce((acc, f) => acc + f.records.reduce((rAcc, r) => rAcc + r.eggsTotal, 0), 0);
  const totalBirds = flocks.reduce((acc, f) => acc + f.currentQuantity, 0);
  const averageLayRate = flocks.length > 0 ? (totalEggs / (totalBirds * 30)) * 100 : 0;
  const totalMortality = flocks.reduce((acc, f) => acc + f.records.reduce((rAcc, r) => rAcc + r.mortality, 0), 0);

  const tableData = flocks.map(flock => {
    const last30Days = flock.records;
    const eggs = last30Days.reduce((acc, r) => acc + r.eggsTotal, 0);
    const feed = last30Days.reduce((acc, r) => acc + r.feedConsumed, 0);
    const mortality = last30Days.reduce((acc, r) => acc + r.mortality, 0);
    
    // Taxa de postura (ovos / aves / dias)
    const layRate = (eggs / (flock.currentQuantity * 30)) * 100;
    
    // Conversão Alimentar (kg ração / dúzia ovos)
    const fcr = eggs > 0 ? (feed / (eggs / 12)) : 0;

    return {
      id: flock.id,
      name: flock.name,
      breed: flock.breed,
      quantity: flock.currentQuantity,
      layRate,
      fcr,
      mortality
    };
  });

  return {
    kpis: [
      { title: "Produção Total (Ovos)", value: totalEggs.toLocaleString('pt-BR'), icon: "package" },
      { title: "Plantel Ativo", value: totalBirds.toLocaleString('pt-BR'), icon: "trending-up" },
      { title: "Taxa de Postura Média", value: `${averageLayRate.toFixed(1)}%`, icon: "trending-up" },
      { title: "Mortalidade (30d)", value: totalMortality.toString(), icon: "alert-triangle", trend: "-2.4%" }
    ],
    tableData
  };
}
