'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function createCustomer(data: {
  name: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
}) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) return { success: false, error: "Não autorizado" };
  
  try {
    const customer = await tenantPrisma.customer.create({
      data: {
        name: data.name,
        taxId: data.taxId,
        phone: data.phone,
        email: data.email,
        address: data.address,
        producerId,
      }
    });

    revalidatePath('/customers');
    return { success: true, customer };
  } catch (error) {
    console.error("[CREATE_CUSTOMER]", error);
    return { success: false, error: "Erro ao cadastrar cliente" };
  }
}
