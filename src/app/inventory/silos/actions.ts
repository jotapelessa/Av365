'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function createSilo(data: {
  name: string;
  capacity: number;
  feedType?: string;
}) {
  const db = await getTenantDb();
  const pid = await getProducerId();

  try {
    const silo = await db.silo.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        feedType: data.feedType || undefined,
        producerId: pid as string,
        currentStock: 0,
      }
    });
    revalidatePath('/inventory/silos');
    return { success: true, silo };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao criar silo" };
  }
}

export async function addSiloMovement(data: {
  siloId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'LOSS';
  quantity: number;
  reason?: string;
}) {
  const db = await getTenantDb();
  const pid = await getProducerId();

  try {
    const movement = await db.$transaction(async (tx) => {
      const mov = await tx.siloMovement.create({
        data: {
          type: data.type,
          quantity: data.quantity,
          reason: data.reason || undefined,
          siloId: data.siloId,
          producerId: pid as string,
          date: new Date(),
        }
      });

      // Atualiza o estoque do silo
      const adjustment = data.type === 'IN' ? Number(data.quantity) : -Number(data.quantity);
      
      await tx.silo.update({
        where: { id: data.siloId },
        data: {
          currentStock: {
            increment: adjustment
          }
        }
      });

      return mov;
    });

    revalidatePath('/inventory/silos');
    return { success: true, movement };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao registrar movimento no silo" };
  }
}

export async function getSilos() {
  const db = await getTenantDb();
  
  return db.silo.findMany({
    orderBy: { name: 'asc' },
    include: {
      movements: {
        take: 5,
        orderBy: { date: 'desc' }
      }
    }
  });
}
