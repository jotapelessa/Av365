'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getFlocksReportData() {
  const db = await getTenantDb();

  const flocks = await db.flock.findMany({
    where: { status: 'ACTIVE' },
    include: {
      houses: true
    }
  });

  const totalBirds = flocks.reduce((acc, f) => acc + f.currentQuantity, 0);
  const totalHouses = new Set(flocks.flatMap(f => f.houses.map(h => h.id))).size;
  const averageAge = flocks.length > 0 ? flocks.reduce((acc, f) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(f.acquisitionDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays;
  }, 0) / flocks.length : 0;

  const tableData = flocks.map(f => ({
    id: f.id,
    name: f.name,
    breed: f.breed,
    quantity: f.currentQuantity,
    acquisitionDate: f.acquisitionDate,
    houses: f.houses.map(h => h.name).join(', ') || "Nenhum"
  }));

  return {
    kpis: [
      { title: "Lotes em Produção", value: flocks.length.toString(), icon: "package" },
      { title: "Total de Aves", value: totalBirds.toLocaleString('pt-BR'), icon: "trending-up" },
      { title: "Galpões Ocupados", value: totalHouses.toString(), icon: "trending-up" },
      { title: "Idade Média (Dias)", value: Math.round(averageAge).toString(), icon: "calendar" }
    ],
    tableData
  };
}
