"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { parseNFeXML, NFeData } from "@/lib/xml-parser";
import { revalidatePath } from "next/cache";

export async function processNFeUpload(xmlContent: string) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const producerId = orgId || userId; // Simplified for now, adjust based on your role logic
  const nfeData = await parseNFeXML(xmlContent);

  // 1. Find or Create Supplier
  let supplier = await prisma.supplier.findFirst({
    where: {
      cnpj: nfeData.issuer.cnpj,
      producerId,
    },
  });

  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: {
        name: nfeData.issuer.name,
        cnpj: nfeData.issuer.cnpj,
        producerId,
      },
    });
  }

  // 2. Map Products (Alias Check)
  const mappingResults = await Promise.all(
    nfeData.products.map(async (nfeProd) => {
      const alias = await prisma.productAlias.findUnique({
        where: {
          aliasName_producerId: {
            aliasName: nfeProd.name,
            producerId,
          },
        },
        include: { item: true },
      });

      return {
        nfeProduct: nfeProd,
        mappedItem: alias?.item || null,
        needsConciliation: !alias,
      };
    })
  );

  return {
    success: true,
    nfeData,
    mappingResults,
    supplierId: supplier.id,
  };
}

export async function conciliateAndFinalize(
  producerId: string,
  supplierId: string,
  mappings: { 
    nfeProdName: string; 
    internalItemId: string; 
    quantity: number; 
    unitCost: number;
    batchNumber?: string;
    expiryDate?: string;
  }[]
) {
  // Use a transaction to create aliases and movements
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const mapping of mappings) {
      // Create alias if it doesn't exist
      await tx.productAlias.upsert({
        where: {
          aliasName_producerId: {
            aliasName: mapping.nfeProdName,
            producerId,
          },
        },
        update: {},
        create: {
          aliasName: mapping.nfeProdName,
          itemId: mapping.internalItemId,
          producerId,
        },
      });

      // Create Movement
      await tx.inventoryMovement.create({
        data: {
          type: "IN",
          quantity: mapping.quantity,
          unitCost: mapping.unitCost,
          totalCost: mapping.quantity * mapping.unitCost,
          itemId: mapping.internalItemId,
          producerId,
          batchNumber: mapping.batchNumber,
          expiryDate: mapping.expiryDate ? new Date(mapping.expiryDate) : null,
          reason: `Compra - NF-e`,
        },
      });

      // Update Stock and Average Cost
      const item = await tx.inventoryItem.findUnique({ where: { id: mapping.internalItemId } });
      if (item) {
        const newTotalStock = item.currentStock + mapping.quantity;
        const totalOldValue = Number(item.currentStock) * Number(item.averageCost);
        const totalNewValue = totalOldValue + (mapping.quantity * mapping.unitCost);
        const newAverageCost = totalNewValue / newTotalStock;

        await tx.inventoryItem.update({
          where: { id: mapping.internalItemId },
          data: {
            currentStock: newTotalStock,
            averageCost: newAverageCost,
          },
        });
      }
    }
  });

  revalidatePath("/inventory");
  return { success: true };
}

export async function getInventoryMetrics() {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  const producerId = orgId || userId;

  const [items, flocks, recentRecords] = await Promise.all([
    prisma.inventoryItem.findMany({ 
      where: { producerId },
      include: { category: true }
    }),
    prisma.flock.findMany({ where: { producerId, status: 'ACTIVE' } }),
    prisma.dailyRecord.findMany({
      where: { 
        producerId,
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { date: 'desc' }
    })
  ]);

  const totalValue = items.reduce((acc, item) => acc + (Number(item.currentStock) * Number(item.averageCost)), 0);
  const totalBirds = flocks.reduce((acc, f) => acc + f.currentQuantity, 0);
  
  // Encontrar o custo médio da ração (FEED)
  const feedItems = items.filter(i => i.category?.name.toUpperCase().includes('RAÇÃO') || i.category?.name.toUpperCase() === 'FEED');
  const avgFeedCost = feedItems.length > 0 
    ? feedItems.reduce((acc, i) => acc + Number(i.averageCost), 0) / feedItems.length 
    : 0;

  // Custo por ave nos últimos 7 dias
  const totalFeedConsumed = recentRecords.reduce((acc, r) => acc + r.feedConsumed, 0);
  const dailyAvgConsumption = recentRecords.length > 0 ? totalFeedConsumed / recentRecords.length : 0;
  const costPerBird = totalBirds > 0 ? (dailyAvgConsumption * avgFeedCost) / totalBirds : 0;

  return {
    totalValue,
    totalBirds,
    costPerBird,
    criticalItems: items.filter(i => i.currentStock <= i.minStock).length,
    totalItems: items.length
  };
}

export async function upsertInventoryItem(data: any) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  const producerId = orgId || userId;

  const { id, ...rest } = data;

  if (id) {
    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...rest,
        producerId,
        averageCost: new Prisma.Decimal(rest.averageCost),
        currentStock: Number(rest.currentStock),
        minStock: Number(rest.minStock),
      }
    });
    revalidatePath("/inventory");
    return { success: true, data: updated };
  }

  const created = await prisma.inventoryItem.create({
    data: {
      ...rest,
      producerId,
      averageCost: new Prisma.Decimal(rest.averageCost),
      currentStock: Number(rest.currentStock),
      minStock: Number(rest.minStock),
    }
  });

  revalidatePath("/inventory");
  return { success: true, data: created };
}
