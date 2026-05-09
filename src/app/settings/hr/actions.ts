'use server';

import { db, getProducerId, checkAdminRole } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function upsertEmployee(data: any) {
  try {
    await checkAdminRole();
    const producerId = await getProducerId();
    if (!producerId) return { success: false, error: "Não autorizado" };

    const { 
      id, 
      name, 
      cpf, 
      phone, 
      position, 
      baseSalary, 
      veterinaryLicense, 
      contractUrl, 
      bankDetails, 
      taxInfo 
    } = data;

    const employee = await db.employee.upsert({
      where: { id: id || "new_id" },
      create: {
        name,
        cpf,
        phone,
        position,
        baseSalary,
        hireDate: new Date(),
        status: "ACTIVE",
        producerId,
        veterinaryLicense,
        contractUrl,
        bankDetails: bankDetails || {},
        taxInfo: taxInfo || {}
      },
      update: {
        name,
        cpf,
        phone,
        position,
        baseSalary,
        veterinaryLicense,
        contractUrl,
        bankDetails: bankDetails || {},
        taxInfo: taxInfo || {}
      }
    });

    revalidatePath("/settings/hr");
    return { success: true, data: JSON.parse(JSON.stringify(employee)) };
  } catch (error: any) {
    console.error("ERRO_EMPLOYEE_UPSERT:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await checkAdminRole();
    await db.employee.delete({
      where: { id }
    });
    revalidatePath("/settings/hr");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
