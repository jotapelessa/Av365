import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { db, prisma } from './prisma';
export { db, prisma };
import { PrismaClient } from "@prisma/client";

export async function getProducerId() {
  const headerList = await headers();
  let producerId = headerList.get('x-producer-id');

  if (!producerId) {
    const session = await auth();
    producerId = (session?.sessionClaims?.metadata as any)?.producerId;
  }

  if (!producerId) {
    const { userId } = await auth();
    if (userId) {
      const dbUser = await db.user.findUnique({
        where: { id: userId },
        select: { producerId: true }
      });
      producerId = dbUser?.producerId || null;
    }
  }

  // Fallback para orgId || userId se autenticado
  if (!producerId) {
    const { userId, orgId } = await auth();
    if (userId) {
      producerId = orgId || userId;
      
      // 🐣 AUTO-ONBOARDING SILENCIOSO: Garantir que o Produtor e o Usuário existam
      // Usamos db diretamente (não tenantDb para evitar recursão)
      await db.producer.upsert({
        where: { id: producerId as string },
        update: {},
        create: { 
          id: producerId as string, 
          name: orgId ? "Organização Operacional" : "Produtor Independente",
          status: 'ACTIVE'
        }
      });

      await db.user.upsert({
        where: { id: userId },
        update: { producerId: producerId as string },
        create: { 
          id: userId, 
          email: "operacional@av365.com.br",
          role: 'PRODUCER',
          producerId: producerId as string
        }
      });
    }
  }

  return producerId;
}

export async function getTenantDb() {
  const producerId = await getProducerId();

  if (!producerId) return db;

  const tenantModels = [
    'User', 'Flock', 'DailyRecord', 'ProducerSettings', 'House',
    'Sale', 'Expense', 'Subscription', 'Invoice', 'InventoryCategory',
    'InventoryItem', 'InventoryMovement', 'Task', 'VaccinationRecord',
    'HealthAlert', 'AuditLog', 'FinancialAccount', 'InternalTransfer',
    'Employee', 'Customer', 'Supplier', 'FinancialPartner', 'Installment',
    'ProductAlias', 'Silo', 'SiloMovement'
  ];

  return new Proxy(db, {
    get(target: any, prop: string) {
      const model = target[prop];
      if (!model) {
        if (typeof prop === 'string' && !['toJSON', 'then', 'constructor'].includes(prop)) {
          console.error(`[TENANT_DB_ERROR] Model "${prop}" not found on Prisma Client instance. Available models:`, Object.keys(target).filter(k => !k.startsWith('$')));
        }
        return undefined;
      }

      if (typeof prop === 'string' && tenantModels.map(m => m.toLowerCase()).includes(prop.toLowerCase())) {
        return new Proxy(model, {
          get(modelTarget: any, operation: string) {
            const originalMethod = modelTarget[operation];
            if (typeof originalMethod !== 'function') return originalMethod;

            return (...args: any[]) => {
              const arg = args[0] || {};
              
              if (['findMany', 'findFirst', 'findUnique', 'count', 'updateMany', 'deleteMany', 'update', 'delete', 'aggregate', 'groupBy', 'upsert'].includes(operation)) {
                arg.where = { ...arg.where, producerId };
              }
              
              if (operation === 'create') {
                arg.data = { ...arg.data, producerId };
              }
              
              if (operation === 'createMany') {
                if (Array.isArray(arg.data)) {
                  arg.data = arg.data.map((item: any) => ({ ...item, producerId }));
                } else if (arg.data) {
                  arg.data = { ...arg.data, producerId };
                }
              }

              if (operation === 'upsert') {
                arg.create = { ...arg.create, producerId };
                arg.update = { ...arg.update, producerId };
              }

              return originalMethod.apply(modelTarget, [arg, ...args.slice(1)]);
            };
          }
        });
      }
      return model;
    }
  }) as unknown as PrismaClient;
}

export async function checkAdminRole() {
  const { userId } = await auth();
  if (!userId) throw new Error("Não autenticado");
  
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  
  if (user?.role !== 'PRODUCER' && user?.role !== 'SUPER_ADMIN') {
    throw new Error("Acesso negado: Somente o administrador da fazenda ou super-admin pode realizar esta operação.");
  }
  
  return true;
}
