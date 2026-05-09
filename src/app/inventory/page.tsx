import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import InventoryClient from "./InventoryClient";
import { getInventoryMetrics } from "./actions";

export default async function InventoryPage() {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const producerId = orgId || userId;

  const [items, categories, metrics] = await Promise.all([
    prisma.inventoryItem.findMany({
      where: { producerId },
      include: { category: true, aliases: true },
      orderBy: { name: 'asc' }
    }),
    prisma.inventoryCategory.findMany({
      where: { producerId },
      orderBy: { name: 'asc' }
    }),
    getInventoryMetrics()
  ]);

  // Serialização segura para o Client Component (lidando com Decimais do Prisma)
  const serializedItems = JSON.parse(JSON.stringify(items));
  const serializedCategories = JSON.parse(JSON.stringify(categories));
  const serializedMetrics = JSON.parse(JSON.stringify(metrics));

  return (
    <div className="p-10">
      <InventoryClient 
        initialItems={serializedItems} 
        categories={serializedCategories}
        metrics={serializedMetrics}
        producerId={producerId}
      />
    </div>
  );
}
