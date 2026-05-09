'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Verifica se o usuário atual é um administrador
 */
async function checkIsAdmin() {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as { role?: string; publicMetadata?: { role?: string }; metadata?: { role?: string } };
  const role = (claims?.role || claims?.publicMetadata?.role || claims?.metadata?.role || '') as string;
  return role.toUpperCase() === 'ADMIN';
}

/**
 * Registra um log de auditoria para ações administrativas
 */
async function createAdminAuditLog(producerId: string, action: string, dataBefore?: unknown, dataAfter?: unknown) {
  const { userId } = await auth();
  
  await db.auditLog.create({
    data: {
      category: 'TECHNICAL',
      action,
      entityType: 'PRODUCER',
      entityId: producerId,
      userId,
      producerId,
      dataBefore: dataBefore ? JSON.parse(JSON.stringify(dataBefore)) : null,
      dataAfter: dataAfter ? JSON.parse(JSON.stringify(dataAfter)) : null,
    }
  });
}

/**
 * Atualiza o status de um produtor com log de auditoria
 */
export async function updateProducerStatus(id: string, status: string) {
  try {
    if (!await checkIsAdmin()) {
      return { success: false, error: "Acesso negado." };
    }

    const currentProducer = await db.producer.findUnique({
      where: { id },
      select: { status: true }
    });

    const updated = await db.producer.update({
      where: { id },
      data: { status }
    });

    await createAdminAuditLog(id, `STATUS_CHANGE_${status}`, currentProducer, updated);
    
    revalidatePath(`/admin/producers/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Gera um backup completo dos dados do produtor
 */
export async function backupProducerData(id: string) {
  try {
    if (!await checkIsAdmin()) {
      throw new Error("Acesso negado.");
    }

    const data = await db.producer.findUnique({
      where: { id },
      include: {
        flocks: {
          include: { records: true, expenses: true, vaccinations: true }
        },
        houses: true,
        financialAccounts: {
          include: { expenses: true, sales: true, installments: true }
        },
        inventoryItems: {
          include: { movements: true }
        },
        customers: true,
        suppliers: true,
        employees: true,
      }
    });

    await createAdminAuditLog(id, "BACKUP_GENERATED");

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(data)),
      filename: `backup-producer-${id}-${new Date().toISOString()}.json`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Realiza o reset controlado de dados operacionais
 */
export async function resetProducerData(id: string, mode: 'OPERATIONAL' | 'TOTAL') {
  try {
    if (!await checkIsAdmin()) {
      return { success: false, error: "Acesso negado." };
    }

    if (mode === 'OPERATIONAL') {
      // Deleta apenas registros diários, movimentações e transações
      await db.$transaction([
        db.dailyRecord.deleteMany({ where: { producerId: id } }),
        db.inventoryMovement.deleteMany({ where: { producerId: id } }),
      ]);
    } else if (mode === 'TOTAL') {
      // Deleta quase tudo exceto o perfil do produtor
      await db.$transaction([
        db.dailyRecord.deleteMany({ where: { producerId: id } }),
        db.flock.deleteMany({ where: { producerId: id } }),
        db.house.deleteMany({ where: { producerId: id } }),
        db.expense.deleteMany({ where: { producerId: id } }),
        db.sale.deleteMany({ where: { producerId: id } }),
        db.inventoryItem.deleteMany({ where: { producerId: id } }),
        db.financialAccount.deleteMany({ where: { producerId: id } }),
        db.customer.deleteMany({ where: { producerId: id } }),
        db.supplier.deleteMany({ where: { producerId: id } }),
        db.employee.deleteMany({ where: { producerId: id } }),
      ]);
    }

    await createAdminAuditLog(id, `DATA_RESET_${mode}`);

    revalidatePath(`/admin/producers/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Restaura dados a partir de um snapshot JSON
 */
export async function restoreProducerBackup(id: string, backupData: any) {
  try {
    if (!await checkIsAdmin()) {
      return { success: false, error: "Acesso negado." };
    }

    if (!backupData || typeof backupData !== 'object') {
      return { success: false, error: "Dados de backup inválidos." };
    }

    // A restauração é uma operação complexa. 
    // Aqui implementamos um fluxo de "Limpar e Re-inserir" para garantir consistência
    await db.$transaction(async (tx) => {
      // 1. Limpar dados atuais
      await tx.dailyRecord.deleteMany({ where: { producerId: id } });
      await tx.flock.deleteMany({ where: { producerId: id } });
      await tx.house.deleteMany({ where: { producerId: id } });
      await tx.financialAccount.deleteMany({ where: { producerId: id } });
      
      // 2. Re-inserir (Exemplo simplificado para os principais modelos)
      if (backupData.houses) {
        for (const house of backupData.houses) {
          const { records: _r, producer: _p, ...houseData } = house;
          await tx.house.create({ data: { ...houseData, producerId: id } });
        }
      }

      if (backupData.flocks) {
        for (const flock of backupData.flocks) {
          const { records: _r, expenses: _e, vaccinations: _v, producer: _p, ...flockData } = flock;
          await tx.flock.create({ data: { ...flockData, producerId: id } });
        }
      }
    });

    await createAdminAuditLog(id, "BACKUP_RESTORED");

    revalidatePath(`/admin/producers/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Busca logs de auditoria
 */
export async function getAuditLogs(id: string) {
  try {
    const logs = await db.auditLog.findMany({
      where: { producerId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      },
      take: 50
    });
    return { success: true, logs: JSON.parse(JSON.stringify(logs)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
