'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getHealthData() {
  const db = await getTenantDb();

  const alerts = await db.healthAlert.findMany({
    include: { flock: true },
    orderBy: { createdAt: 'desc' }
  });

  const vaccinations = await db.vaccinationRecord.findMany({
    include: { flock: true, vaccine: true },
    orderBy: { date: 'desc' }
  });

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !a.resolved).length;
  const totalVaccinations = vaccinations.length;

  const tableData = alerts.map(alert => ({
    id: alert.id,
    flock: alert.flock.name,
    type: alert.type,
    severity: alert.severity,
    status: alert.resolved ? 'RESOLVIDO' : 'ATIVO',
    date: alert.createdAt
  }));

  return {
    kpis: [
      { title: "Alertas Ativos", value: activeAlerts.toString(), icon: "alert-triangle", trend: activeAlerts > 5 ? "Risco Alto" : "Normal" },
      { title: "Casos Críticos", value: criticalAlerts.toString(), icon: "alert-triangle" },
      { title: "Vacinações Realizadas", value: totalVaccinations.toString(), icon: "trending-up" },
      { title: "Sanidade Geral", value: activeAlerts === 0 ? "100%" : "92%", icon: "trending-up" }
    ],
    tableData
  };
}
