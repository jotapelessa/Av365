import { db } from "@/lib/prisma";
import AdminWebhooksClient from "@/app/admin/webhooks/AdminWebhooksClient";

export default async function AdminWebhooksPage() {
  const logs = await (db as any).webhookLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const stats = {
    successRate: "99.8%", // Mock por enquanto, pode ser calculado
    count24h: await (db as any).webhookLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    avgLatency: "128ms" // Mock por enquanto
  };

  return <AdminWebhooksClient initialLogs={logs} stats={stats} />;
}

