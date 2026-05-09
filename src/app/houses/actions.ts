'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { HousingSystem } from "@prisma/client";

export async function getHouses() {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) return [];

  const houses = await tenantPrisma.house.findMany({
    where: { producerId },
    include: {
      flock: {
        select: {
          name: true,
          currentQuantity: true,
          breed: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  return JSON.parse(JSON.stringify(houses));
}

export async function createHouse(formData: FormData) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado.");

  const name = formData.get("name") as string;
  const capacity = parseInt(formData.get("capacity") as string || "0");
  const width = parseFloat(formData.get("width") as string || "12");
  const length = parseFloat(formData.get("length") as string || "100");
  const housingSystem = formData.get("housingSystem") as HousingSystem;
  const hasClimate = formData.get("hasClimate") === "on";
  const hasAutoFeeding = formData.get("hasAutoFeeding") === "on";
  const description = formData.get("description") as string;

  await tenantPrisma.house.create({
    data: {
      name,
      capacity,
      width,
      length,
      housingSystem,
      hasClimate,
      hasAutoFeeding,
      description,
      status: "ACTIVE",
      producerId
    } as any
  });

  revalidatePath("/houses");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateHouse(houseId: string, formData: FormData) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado.");

  const name = formData.get("name") as string;
  const capacity = parseInt(formData.get("capacity") as string || "0");
  const width = parseFloat(formData.get("width") as string || "12");
  const length = parseFloat(formData.get("length") as string || "100");
  const housingSystem = formData.get("housingSystem") as HousingSystem;
  const hasClimate = formData.get("hasClimate") === "on";
  const hasAutoFeeding = formData.get("hasAutoFeeding") === "on";
  const description = formData.get("description") as string;
  const lastSanitizedStr = formData.get("lastSanitized") as string;

  await tenantPrisma.house.update({
    where: { id: houseId, producerId },
    data: {
      name,
      capacity,
      width,
      length,
      housingSystem,
      hasClimate,
      hasAutoFeeding,
      description,
      lastSanitized: lastSanitizedStr ? new Date(lastSanitizedStr) : undefined
    } as any
  });

  revalidatePath("/houses");
  return { success: true };
}

export async function deleteHouse(houseId: string) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado.");

  try {
    const house = await tenantPrisma.house.findUnique({
      where: { id: houseId, producerId },
      select: { flockId: true, name: true }
    });

    if (!house) throw new Error("Galpão não encontrado.");
    if (house.flockId) {
      throw new Error(`Não é possível excluir o galpão "${house.name}" pois ele possui um lote ativo alojado.`);
    }

    await tenantPrisma.house.delete({
      where: { id: houseId }
    });

    revalidatePath("/houses");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getHouseById(id: string) {
  try {
    const producerId = await getProducerId();
    const tenantPrisma = await getTenantDb();
    
    if (!producerId) return null;

    const house = await tenantPrisma.house.findUnique({
      where: { 
        id,
        producerId
      },
      include: {
        flock: {
          include: {
            lineageStandard: true
          }
        }
      }
    });

    return house;
  } catch (error) {
    console.error('Erro ao buscar galpão:', error);
    return null;
  }
}

export async function getTasksByHouseId(houseId: string) {
  const producerId = await getProducerId();
  const tenantPrisma = await getTenantDb();

  return await tenantPrisma.task.findMany({
    where: {
      houseId,
      producerId: producerId || undefined
    },
    orderBy: {
      dueDate: 'asc'
    },
    include: {
      assignedTo: true
    }
  });
}

export async function getAmbianceRecordsByHouseId(houseId: string) {
  const producerId = await getProducerId();
  const tenantPrisma = await getTenantDb();

  const records = await tenantPrisma.dailyRecord.findMany({
    where: {
      houseId,
      producerId: producerId || undefined
    },
    orderBy: {
      date: 'desc'
    },
    take: 14, // Últimos 14 dias
    select: {
      date: true,
      temperature: true,
      humidity: true
    }
  });

  return records.reverse(); // Ordenar cronologicamente para o gráfico
}
