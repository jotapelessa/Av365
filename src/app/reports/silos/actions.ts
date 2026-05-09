'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getSilosReportData() {
  const db = await getTenantDb();

  const silos = await db.silo.findMany({
    include: {
      movements: {
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  });

  const totalCapacity = silos.reduce((acc, s) => acc + s.capacity, 0);
  const currentStock = silos.reduce((acc, s) => acc + s.currentStock, 0);
  const occupancy = totalCapacity > 0 ? (currentStock / totalCapacity) * 100 : 0;
  const criticalSilos = silos.filter(s => s.currentStock < (s.capacity * 0.15)).length;

  const tableData = silos.map(s => ({
    id: s.id,
    name: s.name,
    feedType: s.feedType || "Não Definido",
    capacity: s.capacity,
    currentStock: s.currentStock,
    occupancy: (s.currentStock / s.capacity) * 100,
    status: s.currentStock < (s.capacity * 0.15) ? 'CRÍTICO' : 'NORMAL'
  }));

  return {
    kpis: [
      { title: "Capacidade Total", value: `${totalCapacity.toLocaleString('pt-BR')} t`, icon: "package" },
      { title: "Estoque em Silos", value: `${currentStock.toLocaleString('pt-BR')} t`, icon: "trending-up" },
      { title: "Ocupação Média", value: `${occupancy.toFixed(1)}%`, icon: "trending-up" },
      { title: "Silos em Alerta", value: criticalSilos.toString(), icon: "alert-triangle", trend: criticalSilos > 0 ? "Nível Baixo" : "Ideal" }
    ],
    tableData
  };
}
