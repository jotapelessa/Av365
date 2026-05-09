import { getDashboardStats } from "@/app/dashboard/actions";
import { getActiveFlocks } from "@/app/dashboard/actions";
import { getTenantDb, getProducerId } from "@/lib/tenant";
import HealthClient from "@/app/health/HealthClient";

export default async function HealthPage() {
  const stats = await getDashboardStats();
  const flocks = await getActiveFlocks();
  const db = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) return null;

  const vaccinations = await db.vaccinationRecord.findMany({
    where: { producerId },
    include: { flock: true },
    orderBy: { date: 'desc' }
  });

  const vaccines = await db.inventoryItem.findMany({
    where: { 
      category: {
        name: {
          contains: 'Vacina',
          mode: 'insensitive'
        }
      },
      producerId 
    }
  });

  const [tasks, dailyRecords] = await Promise.all([
    db.task.findMany({
      where: { 
        producerId,
        title: { contains: 'Vacinação' },
        status: 'PENDING'
      },
      include: { flock: true },
      orderBy: { dueDate: 'asc' }
    }),
    db.dailyRecord.findMany({
      where: { 
        producerId,
        flockId: { in: flocks.map((f: any) => f.id) }
      },
      orderBy: { date: 'asc' }
    })
  ]);

  return (
    <main className="p-8 pb-24">
      <HealthClient 
        flocks={flocks} 
        vaccinations={vaccinations}
        vaccines={vaccines}
        tasks={tasks}
        dailyRecords={dailyRecords}
        producerId={producerId}
      />
    </main>
  );
}
