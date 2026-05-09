'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function createSupplier(data: {
  name: string;
  cnpj?: string;
  phone?: string;
  category?: string;
  address?: string;
}) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) return { success: false, error: "Não autorizado" };
  
  try {
    const supplier = await tenantPrisma.supplier.create({
      data: {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone,
        category: data.category,
        address: data.address,
        producerId,
      }
    });

    revalidatePath('/suppliers');
    return { success: true, supplier };
  } catch (error) {
    console.error("[CREATE_SUPPLIER]", error);
    return { success: false, error: "Erro ao cadastrar fornecedor" };
  }
}
