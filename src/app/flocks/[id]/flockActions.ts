import { getTenantDb } from "@/lib/tenant";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays, addDays } from "date-fns";

export async function getFlockStats(flockId: string) {
  const prisma = await getTenantDb();
  const now = new Date();
  
  const flock = await prisma.flock.findUnique({
    where: { id: flockId },
    select: { currentQuantity: true }
  });

  if (!flock) {
    return { daily: 0, weekly: 0, monthly: 0, effectiveness: 0, flockQuantity: 0 };
  }

  // Diário
  const todayRecord = await prisma.dailyRecord.findFirst({
    where: { flockId, date: { gte: startOfDay(now), lte: endOfDay(now) } }
  });

  // Semanal
  const weekStart = startOfWeek(now);
  const weekRecords = await prisma.dailyRecord.findMany({
    where: { flockId, date: { gte: weekStart, lte: now } }
  });

  // Mensal
  const monthStart = startOfMonth(now);
  const monthRecords = await prisma.dailyRecord.findMany({
    where: { flockId, date: { gte: monthStart, lte: now } }
  });

  const sumEggs = (records: any[]): number => records.reduce((acc: number, r: any) => acc + (r.eggsTotal || 0), 0);
  
  const dailyProd = todayRecord?.eggsTotal || 0;
  const weeklyProd = sumEggs(weekRecords);
  const monthlyProd = sumEggs(monthRecords);
  
  // Eficácia simples (exemplo: taxa de postura hoje)
  const todayRate = flock.currentQuantity > 0 ? (dailyProd / flock.currentQuantity) * 100 : 0;

  return {
    daily: dailyProd,
    weekly: weeklyProd,
    monthly: monthlyProd,
    effectiveness: todayRate,
    flockQuantity: flock.currentQuantity
  };
}

export async function getFlockPredictions(flockId: string) {
  const prisma = await getTenantDb();
  const flock = await prisma.flock.findUnique({
    where: { id: flockId },
    include: { records: { orderBy: { date: 'desc' }, take: 14 } }
  });

  const defaultPrediction = {
    daysUntilReplacement: 0,
    replacementDate: new Date().toISOString(),
    productionDrop: false,
    dropValue: "0.0"
  };

  if (!flock) return defaultPrediction;

  // 1. Predição de Reposição (90 semanas / 630 dias de vida)
  const birthDate = flock.birthDate || flock.acquisitionDate;
  const replacementDate = addDays(birthDate, 630);
  const daysUntilReplacement = differenceInDays(replacementDate, new Date());

  // 2. Detecção de Queda de Produção (Últimos 3 dias vs 7 dias anteriores)
  const last3Days = flock.records.slice(0, 3);
  const previous7Days = flock.records.slice(3, 10);

  const avgLast3 = last3Days.reduce((acc: number, r: any) => acc + (r.eggsTotal / flock.currentQuantity), 0) / (last3Days.length || 1);
  const avgPrev7 = previous7Days.reduce((acc: number, r: any) => acc + (r.eggsTotal / flock.currentQuantity), 0) / (previous7Days.length || 1);

  const productionDrop = avgPrev7 > 0 && (avgPrev7 - avgLast3) / avgPrev7 > 0.10; // Queda > 10%

  return {
    daysUntilReplacement: Math.max(0, daysUntilReplacement),
    replacementDate: replacementDate.toISOString(),
    productionDrop,
    dropValue: ((avgPrev7 - avgLast3) * 100).toFixed(1)
  };
}
