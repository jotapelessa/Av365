'use server';

import { getTenantDb, getProducerId } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { STANDARD_VACCINATION_SCHEDULE } from "@/lib/poultry-health";
import { addDays } from "date-fns";

export async function generateVaccinationSchedule(flockId: string) {
  const db = await getTenantDb();
  const producerId = await getProducerId();

  if (!producerId) throw new Error("Não autorizado");

  const flock = await db.flock.findUnique({
    where: { id: flockId }
  });

  if (!flock) throw new Error("Lote não encontrado");

  const arrivalDate = new Date(flock.acquisitionDate);

  // Criar tarefas para cada vacina
  const tasks = STANDARD_VACCINATION_SCHEDULE.map(v => ({
    title: `Vacinação: ${v.name}`,
    description: v.description,
    priority: v.priority as any,
    dueDate: addDays(arrivalDate, v.day),
    status: 'PENDING' as any,
    flockId: flock.id,
    producerId: producerId
  }));

  // Inserção em massa (simulada por loop se createMany não estiver disponível ou precisar de cuidado)
  for (const task of tasks) {
    await db.task.create({ data: task });
  }

  revalidatePath('/health');
  revalidatePath('/tasks');
  
  return { success: true };
}
