"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateHomepageConfig(formData: FormData) {
  const { sessionClaims, userId } = await auth();
  const metadata = sessionClaims?.metadata as any;

  // 1. Proteção de Elite: Apenas Super Admin pode editar (Liberado em DEV para testes)
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && metadata?.role !== "super_admin") {
    return { success: false, error: "Acesso não autorizado. Apenas Super Admins podem realizar esta ação." };
  }

  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;
  const heroCtaText = (formData.get("heroCtaText") as string) || "Começar Agora";
  const heroVideoUrl = formData.get("heroVideoUrl") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const maintenanceMode = formData.get("maintenanceMode") === "on";

  // Reconstruir o JSON de Features (suportando até 6 features agora)
  const features: any[] = [];
  for (let i = 0; i < 6; i++) {
    const fTitle = formData.get(`featureTitle_${i}`);
    if (fTitle && fTitle.toString().trim() !== "") {
      features.push({
        icon: formData.get(`featureIcon_${i}`) as string || "Activity",
        title: fTitle as string,
        desc: formData.get(`featureDesc_${i}`) as string || "",
      });
    }
  }

  const designConfigRaw = formData.get("designConfig") as string;
  const designConfig = designConfigRaw ? JSON.parse(designConfigRaw) : {};

  try {
    await db.$transaction(async (tx) => {
      // 2. Atualiza a Configuração
      await tx.globalConfig.update({
        where: { id: "default" },
        data: {
          heroTitle,
          heroSubtitle,
          heroCtaText,
          heroVideoUrl,
          contactEmail,
          contactPhone,
          seoTitle,
          seoDescription,
          maintenanceMode,
          featuresJson: features,
          designConfig: designConfig
        }
      });

      // 3. Registra o Log de Auditoria
      await tx.adminActionLog.create({
        data: {
          adminId: userId!,
          action: "UPDATE_HOMEPAGE_CMS",
          details: {
            title: heroTitle,
            featureCount: features.length,
            updatedAt: new Date().toISOString()
          }
        }
      });
    });

    // 4. Limpa o Cache
    revalidatePath("/");
    revalidatePath("/admin/site");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar CMS:", error);
    return { success: false, error: "Falha ao salvar as alterações." };
  }
}
