import { getTenantDb } from "@/lib/tenant";
import * as dateFns from "date-fns";
import Link from "next/link";
import { getFlockStats, getFlockPredictions } from "./flockActions";
import FlockDetailsClient from "@/components/flocks/FlockDetailsClient";

export default async function FlockDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prisma = await getTenantDb();
  
  const flock = await prisma.flock.findUnique({
    where: { id },
    include: {
      lineageStandard: true,
      records: {
        orderBy: { date: "desc" },
        take: 30,
      },
      houses: true
    },
  });

  if (!flock) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Lote não encontrado</h2>
        <Link href="/flocks" className="text-primary font-bold hover:underline">Voltar para lista</Link>
      </div>
    </div>
  );

  const stats = await getFlockStats(flock.id);
  const prediction = await getFlockPredictions(flock.id);
  const latestRecord = flock.records[0];

  // Cálculo de idade e padrão ideal
  const ageDays = dateFns.differenceInDays(new Date(), flock.birthDate || flock.acquisitionDate);
  const ageWeeks = Math.floor(ageDays / 7);
  const standards = flock.lineageStandard?.standardsJson as any[];
  const currentStandard = standards?.find(s => s.week === ageWeeks);
  const idealRate = currentStandard?.prodRate || 0;
  const realRate = latestRecord ? (latestRecord.eggsTotal / flock.currentQuantity) * 100 : 0;

  // Serialização profunda para evitar erro de Decimal/Date em Client Components
  const serializedFlock = JSON.parse(JSON.stringify(flock));
  const serializedStats = JSON.parse(JSON.stringify(stats));
  const serializedPrediction = JSON.parse(JSON.stringify(prediction));

  return (
    <FlockDetailsClient 
      flock={serializedFlock}
      stats={serializedStats}
      prediction={serializedPrediction}
      ageWeeks={ageWeeks}
      realRate={realRate}
      idealRate={idealRate}
    />
  );
}
