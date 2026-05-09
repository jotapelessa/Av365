// 🐣 Prisma Client Singleton - Sincronizado em 2026-05-08 v2 - Contextual Tasks Active
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  console.log("PRISMA_DB: Creating new singleton instance using DIRECT_URL...");
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db: PrismaClient = globalForPrisma.prisma ?? prismaClientSingleton();
export const prisma = db;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
