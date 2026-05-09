'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateGlobalConfig(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const systemName = formData.get("systemName") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const faviconUrl = formData.get("faviconUrl") as string;
  const sessionTimeoutMin = parseInt(formData.get("sessionTimeoutMin") as string);
  const maintenanceMode = formData.get("maintenanceMode") === "on";

  // Busca dados antigos para o log
  const oldConfig = await db.globalConfig.findUnique({ where: { id: "default" } });

  const config = await db.globalConfig.update({
    where: { id: "default" },
    data: {
      systemName,
      primaryColor,
      secondaryColor,
      logoUrl,
      faviconUrl,
      sessionTimeoutMin,
      maintenanceMode
    }
  });

  // Registra no Log de Segurança
  await db.adminActionLog.create({
    data: {
      adminId: userId,
      action: "UPDATE_GLOBAL_SETTINGS",
      details: {
        before: oldConfig,
        after: config
      }
    }
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return config;
}
