"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Helper para verificar se é Super Admin
async function checkAdmin() {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as any;
  if (metadata?.role !== "super_admin") {
    throw new Error("Acesso não autorizado.");
  }
}

export async function pauseSubscription(producerId: string) {
  await checkAdmin();
  const { userId } = await auth();

  try {
    await db.$transaction(async (tx) => {
      // 1. Atualiza o status
      await tx.subscription.update({
        where: { producerId },
        data: { status: "PAUSED" }
      });

      // 2. Registra Log
      await tx.adminActionLog.create({
        data: {
          adminId: userId!,
          action: "PAUSE_SUBSCRIPTION",
          details: { producerId }
        }
      });
    });

    revalidatePath("/admin/producers");
    return { success: true };
  } catch (error) {
    console.error("Erro ao pausar assinatura:", error);
    return { success: false };
  }
}

export async function resumeSubscription(producerId: string) {
  await checkAdmin();
  const { userId } = await auth();

  try {
    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { producerId },
        data: { status: "ACTIVE" }
      });

      await tx.adminActionLog.create({
        data: {
          adminId: userId!,
          action: "RESUME_SUBSCRIPTION",
          details: { producerId }
        }
      });
    });

    revalidatePath("/admin/producers");
    return { success: true };
  } catch (error) {
    console.error("Erro ao reativar assinatura:", error);
    return { success: false };
  }
}

export async function cancelSubscription(producerId: string) {
  await checkAdmin();
  const { userId } = await auth();

  try {
    await db.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { producerId },
        data: { 
          status: "CANCELED",
          cancelAtPeriodEnd: true
        }
      });

      await tx.adminActionLog.create({
        data: {
          adminId: userId!,
          action: "CANCEL_SUBSCRIPTION",
          details: { producerId }
        }
      });
    });

    revalidatePath("/admin/producers");
    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return { success: false };
  }
}
