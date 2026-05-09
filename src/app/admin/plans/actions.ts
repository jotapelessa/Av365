'use server';

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Alterna o status de ativação de um plano
 */
export async function togglePlanStatus(id: string, currentStatus: boolean) {
  try {
    await db.subscriptionPlan.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error) {
    console.error("Erro ao alternar status do plano:", error);
    return { success: false, error: "Falha ao atualizar status." };
  }
}

/**
 * Atualiza os limites técnicos de um plano
 */
export async function updatePlanLimits(id: string, data: { maxFlocks: number, maxHouses: number, maxUsers: number }) {
  try {
    await db.subscriptionPlan.update({
      where: { id },
      data: {
        maxFlocks: data.maxFlocks,
        maxHouses: data.maxHouses,
        maxUsers: data.maxUsers
      }
    });
    
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar limites do plano:", error);
    return { success: false, error: "Falha ao atualizar limites técnicos." };
  }
}

/**
 * Atualiza os dados gerais e técnicos de um plano
 */
export async function updatePlanData(id: string, data: any) {
  try {
    await db.subscriptionPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        maxFlocks: Number(data.maxFlocks),
        maxHouses: Number(data.maxHouses),
        maxUsers: Number(data.maxUsers),
        isActive: data.isActive
      }
    });
    
    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar dados do plano:", error);
    return { success: false, error: "Falha ao atualizar dados do plano." };
  }
}
