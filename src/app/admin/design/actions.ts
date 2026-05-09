'use server';

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDesignConfig(formData: FormData) {
  const designConfigRaw = formData.get("designConfig") as string;
  
  try {
    const designConfig = JSON.parse(designConfigRaw);
    
    await db.globalConfig.upsert({
      where: { id: "default" },
      update: { designConfig },
      create: {
        id: "default",
        designConfig
      }
    });

    revalidatePath("/admin/design");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating design config:", error);
    return { success: false, error: "Falha ao atualizar a configuração de design." };
  }
}
