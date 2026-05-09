'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export async function createFlock(formData: FormData) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) {
    throw new Error("Não autorizado: Produtor não identificado.");
  }

  const name = formData.get("name") as string;
  const breed = formData.get("breed") as string;
  const purpose = formData.get("purpose") as any;
  const initialQuantity = parseInt(formData.get("initialQuantity") as string || "0");
  const acquisitionDate = new Date(formData.get("acquisitionDate") as string);
  const birthDate = formData.get("birthDate") ? new Date(formData.get("birthDate") as string) : null;
  const ageAtArrival = formData.get("ageAtArrival") ? parseInt(formData.get("ageAtArrival") as string) : null;
  const supplier = formData.get("supplier") as string;
  const initialWeight = formData.get("initialWeight") ? parseFloat(formData.get("initialWeight") as string) : null;
  const unitPrice = formData.get("unitPrice") ? parseFloat(formData.get("unitPrice") as string) : null;
  const houseId = formData.get("houseId") as string;
  
  // Cálculo do custo total para o financeiro
  const totalCost = unitPrice ? unitPrice * initialQuantity : null;

  try {
    const result = await tenantPrisma.$transaction(async (tx: any) => {
      // 1. Validar capacidade do galpão se fornecido
      if (houseId) {
        const house = await tx.house.findFirst({
          where: { id: houseId, producerId },
          select: { name: true, capacity: true, flockId: true }
        });

        if (!house) throw new Error("Galpão não encontrado.");
        if (house.flockId) throw new Error(`O galpão ${house.name} já está ocupado por outro lote.`);
        if (initialQuantity > house.capacity) {
          throw new Error(`A quantidade de aves (${initialQuantity}) excede a capacidade do galpão ${house.name} (${house.capacity}).`);
        }
      }

      // 2. Criar o Lote
      const flock = await tx.flock.create({
        data: {
          name,
          breed,
          purpose,
          initialQuantity,
          currentQuantity: initialQuantity,
          acquisitionDate,
          birthDate,
          ageAtArrival,
          supplier,
          initialWeight,
          unitPrice,
          totalCost,
          status: "ACTIVE",
          producerId,
        } as any,
      });

      // 3. Automação Financeira: Criar despesa se houver custo
      if (totalCost && totalCost > 0) {
        await tx.expense.create({
          data: {
            category: "OTHER", // Idealmente mapear para "AQUISIÇÃO DE AVES" se existir
            amount: totalCost,
            date: acquisitionDate,
            description: `Aquisição de Lote: ${name} (${initialQuantity} aves)`,
            flockId: flock.id,
            producerId,
          } as any
        });
      }

      // 4. Vincular o Lote ao Galpão
      if (houseId) {
        await tx.house.update({
          where: { id: houseId },
          data: {
            flockId: flock.id,
            status: "BUSY"
          }
        });
      }

      return flock;
    });

    revalidatePath("/flocks");
    revalidatePath("/houses");
    revalidatePath("/finance");
    
    // Sucesso - Redirecionar
    // Nota: Como é uma Server Action chamada em um form, o redirect funciona
    // Mas se fosse via useTransition/Action, precisaríamos de uma resposta JSON.
    // Vamos manter o redirect para compatibilidade com o form action.
  } catch (error: any) {
    console.error("Erro ao criar lote elite:", error);
    // Para form actions, o ideal é retornar o erro para o cliente ou lançar se for fatal
    throw new Error(error.message || "Erro interno ao processar o lote.");
  }
  
  redirect("/flocks");
}

export async function createDailyRecord(flockId: string, formData: FormData) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado.");

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  
  const eggsTotal = parseInt(formData.get("eggsTotal") as string || "0");
  const eggsBroken = parseInt(formData.get("eggsBroken") as string || "0");
  const eggsDirty = parseInt(formData.get("eggsDirty") as string || "0");
  const feedConsumed = parseFloat(formData.get("feedConsumed") as string || "0");
  const waterConsumed = formData.get("waterConsumed") ? parseFloat(formData.get("waterConsumed") as string) : null;
  const temperature = formData.get("temperature") ? parseFloat(formData.get("temperature") as string) : null;
  const humidity = formData.get("humidity") ? parseFloat(formData.get("humidity") as string) : null;
  const mortality = parseInt(formData.get("mortality") as string || "0");
  const notes = formData.get("notes") as string;

  try {
    await tenantPrisma.$transaction(async (tx: any) => {
      // 1. Validar Saldo de Aves (Guarda de Mortalidade)
      const flock = await tx.flock.findFirst({
        where: { id: flockId, producerId },
        select: { currentQuantity: true, name: true }
      });

      if (!flock) throw new Error("Lote não encontrado.");
      if (mortality > flock.currentQuantity) {
        throw new Error(`Mortalidade (${mortality}) não pode ser maior que o saldo atual (${flock.currentQuantity}) do lote ${flock.name}.`);
      }

      // 2. Criar Registro Diário
      await tx.dailyRecord.create({
        data: {
          flockId,
          date,
          eggsTotal,
          eggsBroken,
          eggsDirty,
          feedConsumed,
          waterConsumed,
          mortality,
          temperature,
          humidity,
          notes,
          producerId,
        } as any
      });

      // 3. Atualizar Saldo do Lote
      if (mortality > 0) {
        await tx.flock.update({
          where: { id: flockId },
          data: { currentQuantity: { decrement: mortality } }
        });
      }

      // 4. Integração com Inventário (Baixa de Ração)
      if (feedConsumed > 0) {
        // Tenta encontrar o primeiro item de ração (FEED)
        const feedItem = await tx.inventoryItem.findFirst({
          where: { 
            producerId,
            category: { name: { contains: "Ração", mode: "insensitive" } }
          }
        });

        if (feedItem) {
          await tx.inventoryMovement.create({
            data: {
              type: "OUT",
              quantity: feedConsumed,
              date,
              reason: `Consumo Diário: Lote ${flock.name}`,
              itemId: feedItem.id,
              flockId,
              producerId
            } as any
          });

          await tx.inventoryItem.update({
            where: { id: feedItem.id },
            data: { currentStock: { decrement: feedConsumed } }
          });
        }
      }

      // 5. Auditoria Operacional
      await tx.auditLog.create({
        data: {
          category: "OPERATIONAL",
          action: "CREATE_DAILY_RECORD",
          entityType: "DailyRecord",
          producerId,
          userId: producerId, // In this context, producerId is the user id for simplicity or we should get current userId
          dataAfter: { eggsTotal, mortality, feedConsumed }
        } as any
      });
    });

    revalidatePath("/flocks");
    revalidatePath(`/flocks/${flockId}`);
    revalidatePath("/dashboard");
    revalidatePath("/inventory");
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar registro diário:", error);
    return { success: false, error: error.message || "Falha ao salvar o registro." };
  }
}

export async function deleteFlock(flockId: string) {
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado.");

  try {
    await tenantPrisma.$transaction(async (tx: any) => {
      // 1. Validar propriedade e status
      const flock = await tx.flock.findFirst({
        where: { id: flockId, producerId }
      });

      if (!flock) throw new Error("Lote não encontrado ou acesso negado.");

      // 2. Limpar Galpão vinculado
      await tx.house.updateMany({
        where: { flockId, producerId },
        data: { flockId: null, status: "EMPTY" }
      });

      // 3. Deletar Lote (Cascade delete deve cuidar dos records dependendo do schema, 
      // mas vamos garantir a limpeza manual se necessário)
      await tx.flock.delete({
        where: { id: flockId }
      });

      // 4. Auditoria Operacional
      await tx.auditLog.create({
        data: {
          category: "OPERATIONAL",
          action: "DELETE_FLOCK",
          entityType: "Flock",
          entityId: flockId,
          producerId,
          userId: producerId,
          dataBefore: { name: flock.name }
        } as any
      });
    });

    revalidatePath("/flocks");
    revalidatePath("/houses");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao deletar lote:", error);
    return { success: false, error: error.message };
  }
}
