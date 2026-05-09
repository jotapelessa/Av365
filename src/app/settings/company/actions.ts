'use server';

import { db, getProducerId, checkAdminRole } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function updateCompanySettings(formData: FormData) {
  try {
    await checkAdminRole();
    const producerId = await getProducerId();
    console.log("DEBUG_SETTINGS: Iniciando update para Producer:", producerId);

    if (!producerId) return { success: false, error: "Não autorizado: ID do Produtor não encontrado." };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const location = formData.get("location") as string;
    const rawDocument = (formData.get("cnpj") as string || "").replace(/\D/g, "");
    
    await db.producer.update({
      where: { id: producerId },
      data: {
        name,
        cnpj: rawDocument.length > 11 ? rawDocument : null,
        cpf: rawDocument.length === 11 ? rawDocument : null,
        email: email || null,
        phone: phone || null,
        logoUrl: logoUrl || null,
        location: location || null
      }
    });

    revalidatePath("/settings/company");
    return { success: true };
  } catch (error: any) {
    console.error("ERRO_SETTINGS_UPDATE:", error);
    
    if (error.code === 'P2002') {
      const target = error.meta?.target || [];
      const field = target.includes('cnpj') ? 'CNPJ' : target.includes('cpf') ? 'CPF' : 'documento';
      return { success: false, error: `Este ${field} já está sendo utilizado por outra granja.` };
    }

    return { success: false, error: error.message || "Erro interno no servidor ao salvar configurações." };
  }
}
