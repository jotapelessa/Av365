"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// 🛡️ Tipos Defensivos para neutralizar dessincronização do IDE
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'PAUSED' | 'DELAYED' | 'TRANSFERRED' | 'COMPLETED' | 'OVERDUE' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  houseId?: string;
  flockId?: string;
  assignedUserId?: string;
  clientId?: string;
  supplierId?: string;
  inventoryItemId?: string;
  category?: any;
  recurrenceRule?: string;
}) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const producerId = orgId || userId;

  // 🐣 AUTO-ONBOARDING: Garantir que o Produtor e o Usuário existam no banco
  await prisma.$transaction(async (tx) => {
    // 1. Garantir Produtor
    await tx.producer.upsert({
      where: { id: producerId },
      update: {},
      create: { 
        id: producerId, 
        name: orgId ? "Organização Operacional" : "Produtor Independente",
        status: 'ACTIVE'
      }
    });

    // 2. Garantir Usuário vinculado
    await tx.user.upsert({
      where: { id: userId },
      update: { producerId },
      create: { 
        id: userId, 
        email: "onboarding@av365.com.br", // Clerk preencherá via webhook depois, mas precisamos do registro para FK
        name: "Usuário Operacional",
        role: 'PRODUCER',
        producerId
      }
    });
  });

  // 🛡️ Higienização de IDs para evitar P2003 (Foreign Key Constraint)
  const cleanData = {
    ...data,
    assignedUserId: data.assignedUserId || null,
    houseId: data.houseId || null,
    flockId: data.flockId || null,
    clientId: data.clientId || null,
    supplierId: data.supplierId || null,
    inventoryItemId: data.inventoryItemId || null,
    category: data.category || 'OTHER',
    producerId,
    status: 'PENDING'
  };

  const task = await (prisma.task as any).create({
    data: cleanData
  });

  // 📝 Log de Auditoria: Criação
  await prisma.auditLog.create({
    data: {
      action: "TASK_CREATE",
      entityType: "TASK",
      entityId: task.id,
      userId,
      producerId,
      dataAfter: task as any,
      category: 'OPERATIONAL'
    }
  });

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(task)) };
}

export async function transferTask(taskId: string, userId?: string, houseId?: string) {
  const { userId: currentUserId, orgId } = await auth();
  if (!currentUserId) throw new Error("Não autorizado");

  const producerId = orgId || currentUserId;

  const task = await (prisma.task as any).update({
    where: { id: taskId, producerId },
    data: {
      assignedUserId: userId || null,
      houseId: houseId || null,
      status: 'TRANSFERRED',
      updatedAt: new Date()
    }
  });

  // 📝 Log de Auditoria: Transferência
  await prisma.auditLog.create({
    data: {
      action: "TASK_TRANSFER",
      entityType: "TASK",
      entityId: taskId,
      userId: currentUserId,
      producerId,
      dataAfter: { assignedUserId: userId, houseId },
      category: 'OPERATIONAL'
    }
  });

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(task)) };
}

export async function pauseTask(taskId: string, isPausing: boolean) {
  const { userId: currentUserId, orgId } = await auth();
  if (!currentUserId) throw new Error("Não autorizado");

  const producerId = orgId || currentUserId;

  const task = await (prisma.task as any).update({
    where: { id: taskId, producerId },
    data: {
      status: isPausing ? 'PAUSED' : 'IN_PROGRESS',
      pausedAt: isPausing ? new Date() : null,
      updatedAt: new Date()
    }
  });

  // 📝 Log de Auditoria: Pausa/Retomada
  await prisma.auditLog.create({
    data: {
      action: isPausing ? "TASK_PAUSE" : "TASK_RESUME",
      entityType: "TASK",
      entityId: taskId,
      userId: currentUserId,
      producerId,
      category: 'OPERATIONAL'
    }
  });

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(task)) };
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const producerId = orgId || userId;

  const data: any = { status };
  if (status === 'COMPLETED') {
    data.completedAt = new Date();
  }
  if (status !== 'PAUSED') {
    data.pausedAt = null;
  }

  const task = await prisma.task.update({
    where: { id: taskId, producerId },
    data,
    include: { house: true, flock: true }
  });

  // 📝 Log de Auditoria: Mudança de Status
  await prisma.auditLog.create({
    data: {
      action: "TASK_STATUS_CHANGE",
      entityType: "TASK",
      entityId: taskId,
      userId,
      producerId,
      dataAfter: { status },
      category: 'OPERATIONAL'
    }
  });

  // Lógica de Recorrência Inteligente (Geração Automática)
  const taskAny = task as any;
  if (status === 'COMPLETED' && taskAny.recurrenceRule) {
    let nextDate = new Date(taskAny.dueDate);
    
    switch (taskAny.recurrenceRule) {
      case 'DAILY': nextDate.setDate(nextDate.getDate() + 1); break;
      case 'WEEKLY': nextDate.setDate(nextDate.getDate() + 7); break;
      case 'MONTHLY': nextDate.setMonth(nextDate.getMonth() + 1); break;
      case 'BIMONTHLY': nextDate.setMonth(nextDate.getMonth() + 2); break;
      case 'SEMIANNUAL': nextDate.setMonth(nextDate.getMonth() + 6); break;
      case 'YEARLY': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
    }

    await (prisma.task as any).create({
      data: {
        title: taskAny.title,
        description: taskAny.description,
        priority: taskAny.priority,
        dueDate: nextDate,
        houseId: taskAny.houseId || null,
        flockId: taskAny.flockId || null,
        assignedUserId: taskAny.assignedUserId || null,
        recurrenceRule: taskAny.recurrenceRule,
        producerId,
        status: 'PENDING'
      }
    });
  }

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(task)) };
}

export async function updateTask(taskId: string, data: any) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  const producerId = orgId || userId;

  // 🛡️ Lógica de metadados baseada no status
  if (data.status === 'COMPLETED') {
    data.completedAt = new Date();
  }
  if (data.status && data.status !== 'PAUSED') {
    data.pausedAt = null;
  }

  const cleanData = {
    ...data,
    assignedUserId: data.assignedUserId === "" ? null : data.assignedUserId,
    houseId: data.houseId === "" ? null : data.houseId,
    flockId: data.flockId === "" ? null : data.flockId,
    clientId: data.clientId === "" ? null : data.clientId,
    supplierId: data.supplierId === "" ? null : data.supplierId,
    inventoryItemId: data.inventoryItemId === "" ? null : data.inventoryItemId,
    category: data.category || 'OTHER',
  };

  const task = await prisma.task.update({
    where: { id: taskId, producerId },
    data: cleanData
  });

  // 📝 Log de Auditoria: Edição Geral/Status
  await prisma.auditLog.create({
    data: {
      action: "TASK_STATUS_CHANGE",
      entityType: "TASK",
      entityId: taskId,
      userId,
      producerId,
      dataAfter: { status: data.status, title: data.title },
      category: 'OPERATIONAL'
    }
  });

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(task)) };
}
export async function postponeTask(taskId: string, newDate: Date, reason: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autorizado");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Tarefa não encontrada");

  const updatedDescription = `${task.description || ''}\n[Adiado para ${newDate.toLocaleDateString('pt-BR')}]: ${reason}`.trim();

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { 
      dueDate: newDate,
      description: updatedDescription,
      status: 'DELAYED' as any
    }
  });

  revalidatePath("/tasks");
  return { success: true, task: JSON.parse(JSON.stringify(updatedTask)) };
}

export async function getTaskLogs(taskId: string) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  const producerId = orgId || userId;

  return await prisma.auditLog.findMany({
    where: { 
      entityId: taskId, 
      entityType: "TASK",
      producerId 
    },
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });
}

export async function createTaskCycle(flockId: string, cycleType: 'HYGIENE' | 'SANITARY') {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error("Não autorizado");
  const producerId = orgId || userId;

  const steps = cycleType === 'HYGIENE' ? [
    { title: 'Limpeza Grossa', offset: 0, priority: 'HIGH' },
    { title: 'Lavagem com Detergente', offset: 1, priority: 'HIGH' },
    { title: 'Desinfecção 1', offset: 3, priority: 'CRITICAL' },
    { title: 'Vazio Sanitário (Início)', offset: 4, priority: 'MEDIUM' },
    { title: 'Desinfecção 2 (Final)', offset: 10, priority: 'CRITICAL' },
  ] : [
    { title: 'Manejo de Cama', offset: 0, priority: 'MEDIUM' },
    { title: 'Tratamento de Água', offset: 0, priority: 'HIGH' },
    { title: 'Controle de Pragas', offset: 2, priority: 'MEDIUM' },
  ];

  const now = new Date();
  
  for (const step of steps) {
    await prisma.task.create({
      data: {
        title: `${step.title} - Ciclo ${cycleType}`,
        dueDate: new Date(now.getTime() + step.offset * 24 * 60 * 60 * 1000),
        priority: step.priority,
        flockId,
        producerId,
        status: 'PENDING'
      } as any
    });
  }

  revalidatePath("/tasks");
  return { success: true };
}
