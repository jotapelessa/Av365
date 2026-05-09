'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { startOfDay, endOfDay, subDays, startOfMonth } from "date-fns";

export async function getDashboardStats() {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) return null;

  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const [
    totalBirds, 
    todayRecords, 
    lastWeekRecords, 
    totalSales, 
    totalExpenses, 
    totalBalance, 
    activeHealthAlertsCount, 
    lowStockItemsRaw
  ] = await Promise.all([
    tenantPrisma.flock.aggregate({
      where: { status: "ACTIVE" },
      _sum: { currentQuantity: true }
    }),
    tenantPrisma.dailyRecord.findMany({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    }),
    tenantPrisma.dailyRecord.findMany({
      where: {
        date: {
          gte: subDays(startOfToday, 7),
          lte: endOfToday
        }
      },
      orderBy: { date: 'asc' }
    }),
    tenantPrisma.sale.aggregate({
      where: { date: { gte: startOfMonth(today) } },
      _sum: { amount: true }
    }),
    tenantPrisma.expense.aggregate({
      where: { date: { gte: startOfMonth(today) } },
      _sum: { amount: true }
    }),
    tenantPrisma.financialAccount.aggregate({
      _sum: { balance: true }
    }),
    tenantPrisma.healthAlert.count({ where: { resolved: false } }),
    tenantPrisma.inventoryItem.findMany({
      where: { 
        currentStock: { lte: 0 } // Ajustar para usar lógica de minStock real se possível via raw ou outro meio
      },
      select: { name: true }
    })
  ]);

  const birdsCount = totalBirds._sum.currentQuantity || 0;
  const eggsToday = todayRecords.reduce((acc: number, curr: any) => acc + curr.eggsTotal, 0);
  const mortalityToday = todayRecords.reduce((acc: number, curr: any) => acc + curr.mortality, 0);
  const feedToday = todayRecords.reduce((acc: number, curr: any) => acc + (curr.feedConsumed || 0), 0);
  const waterToday = todayRecords.reduce((acc: number, curr: any) => acc + (curr.waterConsumed || 0), 0);

  const layingRateValue = birdsCount > 0 ? (eggsToday / birdsCount) * 100 : 0;
  const mortalityRateValue = birdsCount > 0 ? (mortalityToday / birdsCount) * 100 : 0;

  // Cálculo de Health Score Médio
  const baseHealthScore = 100;
  const penaltyMortality = mortalityToday > 0 ? (mortalityToday / (birdsCount || 1)) * 500 : 0;
  const penaltyPostura = (layingRateValue < 90) ? (90 - layingRateValue) * 0.5 : 0;
  const healthScore = Math.max(0, Math.round(baseHealthScore - penaltyMortality - penaltyPostura - ((activeHealthAlertsCount as number) * 10)));

  // Média de ovos da última semana para tendência
  const recordsWithEggs = lastWeekRecords.filter((r: any) => r.eggsTotal > 0);
  const avgEggsLastWeek = recordsWithEggs.length > 0 
    ? recordsWithEggs.reduce((acc: number, curr: any) => acc + curr.eggsTotal, 0) / recordsWithEggs.length 
    : eggsToday;

  let eggTrendRawValue = avgEggsLastWeek > 0 
    ? ((eggsToday - avgEggsLastWeek) / avgEggsLastWeek) * 100 
    : 0;
  
  if (eggTrendRawValue > 500) eggTrendRawValue = 500; 

  const eggTrendFinal = eggTrendRawValue.toFixed(1);

  const activeHousesCount = await tenantPrisma.house.count({ where: { flockId: { not: null } } });
  const energyToday = activeHousesCount * 45.5;

  const eggSeries = lastWeekRecords.map((r: any) => ({ value: r.eggsTotal }));
  const postureSeries = lastWeekRecords.map((r: any) => ({ 
    value: birdsCount > 0 ? (r.eggsTotal / birdsCount) * 100 : 0 
  }));
  const resourceSeries = lastWeekRecords.map((r: any) => ({ 
    feed: r.feedConsumed || 0,
    water: r.waterConsumed || 0,
    energy: activeHousesCount * 45.5
  }));

  return {
    birdsCount,
    eggsToday,
    layingRate: layingRateValue.toFixed(1),
    mortalityRate: mortalityRateValue.toFixed(2),
    eggTrend: (parseFloat(eggTrendFinal) >= 0 ? "+" : "") + eggTrendFinal + "%",
    eggTrendType: parseFloat(eggTrendFinal) >= 0 ? "positive" : "negative",
    healthScore,
    activeHealthAlerts: activeHealthAlertsCount,
    lowStockItems: JSON.parse(JSON.stringify(lowStockItemsRaw)),
    resources: {
      feed: feedToday,
      water: waterToday,
      energy: energyToday
    },
    todayRecords: JSON.parse(JSON.stringify(todayRecords)),
    lastWeekRecords: JSON.parse(JSON.stringify(lastWeekRecords)),
    sparklines: {
      eggs: eggSeries,
      posture: postureSeries,
      resources: resourceSeries
    },
    finance: {
      monthlyRevenue: Number(totalSales?._sum?.amount || 0),
      monthlyExpenses: Number(totalExpenses?._sum?.amount || 0),
      currentBalance: Number(totalBalance?._sum?.balance || 0)
    }
  };
}

export async function getActiveFlocks() {
  const tenantPrisma = await getTenantDb();
  const flocks = await tenantPrisma.flock.findMany({
    where: { status: "ACTIVE" },
    include: { 
      records: { take: 15, orderBy: { date: "desc" } },
      houses: true
    }
  });
  return JSON.parse(JSON.stringify(flocks));
}

export async function getTopPerformers() {
  const tenantPrisma = await getTenantDb();
  const flocks = await tenantPrisma.flock.findMany({
    where: { status: "ACTIVE" },
    include: { 
      records: { take: 1, orderBy: { date: "desc" } }
    }
  });

  const rankedFlocks = flocks.map(f => {
    const lastRecord = f.records[0];
    const rate = lastRecord && f.currentQuantity > 0 
      ? (lastRecord.eggsTotal / f.currentQuantity) * 100 
      : 0;
    return { ...f, performanceRate: rate };
  })
  .sort((a, b) => b.performanceRate - a.performanceRate)
  .slice(0, 3);

  return JSON.parse(JSON.stringify(rankedFlocks));
}

export async function getDashboardTasks() {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return [];

  const tasks = await tenantPrisma.task.findMany({
    where: {
      status: { in: ['PENDING', 'IN_PROGRESS'] }
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
    include: {
      house: { select: { name: true } }
    }
  });
  return JSON.parse(JSON.stringify(tasks));
}

export async function getInfrastructureSummary() {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return null;

  const houses = await tenantPrisma.house.findMany({
    select: { status: true, flockId: true }
  });

  const total = houses.length;
  const busy = houses.filter(h => h.flockId).length;
  const maintenance = houses.filter(h => h.status === 'MAINTENANCE').length;
  const empty = total - busy - maintenance;

  return {
    total,
    busy,
    empty,
    maintenance,
    occupancyRate: total > 0 ? ((busy / total) * 100).toFixed(0) : 0
  };
}

export async function getAmbianceData() {
  const db = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return [];

  const latestRecords = await db.dailyRecord.findMany({
    where: {
      producerId: producerId,
      OR: [
        { temperature: { not: null } },
        { humidity: { not: null } }
      ]
    },
    take: 5,
    orderBy: { date: 'desc' },
    include: { house: true }
  });

  return JSON.parse(JSON.stringify(latestRecords.map((record: any) => ({
    id: record.id,
    houseName: record.house?.name || 'Galpão Geral',
    temperature: record.temperature,
    humidity: record.humidity,
    date: record.date
  }))));
}
