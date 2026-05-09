'use server';

import { db as globalPrisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export async function getLayoutConfigs(pageUrl: string) {
  let prisma: any = globalPrisma;
  
  if (!(prisma.uILayoutConfig || prisma.uiLayoutConfig || prisma.UILayoutConfig)) {
    const pool = new Pool({ connectionString: process.env.DIRECT_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  const model = prisma.uILayoutConfig || prisma.uiLayoutConfig || prisma.UILayoutConfig;
  
  try {
    if (model) {
      return await model.findMany({
        where: { pageUrl }
      });
    } else {
      return await prisma.$queryRaw`SELECT * FROM "UILayoutConfig" WHERE "pageUrl" = ${pageUrl}`;
    }
  } catch (error) {
    console.error("LAYOUT_ACTION: Error fetching configs:", error);
    return [];
  }
}

export async function saveLayoutConfig(data: {
  pageUrl: string;
  elementId: string;
  viewport: string;
  span: number;
  order?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let prisma: any = globalPrisma;
  if (!(prisma.uILayoutConfig || prisma.uiLayoutConfig || prisma.UILayoutConfig)) {
    const pool = new Pool({ connectionString: process.env.DIRECT_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  const model = prisma.uILayoutConfig || prisma.uiLayoutConfig || prisma.UILayoutConfig;

  try {
    if (model) {
      await model.upsert({
        where: {
          pageUrl_elementId_viewport: {
            pageUrl: data.pageUrl,
            elementId: data.elementId,
            viewport: data.viewport
          }
        },
        update: {
          span: data.span,
          order: data.order ?? 0
        },
        create: {
          pageUrl: data.pageUrl,
          elementId: data.elementId,
          viewport: data.viewport,
          span: data.span,
          order: data.order ?? 0
        }
      });
    } else {
      // PROCEDIMENTO DE REPARAÇÃO ELITE
      // 1. Garante que a tabela existe
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "UILayoutConfig" (
          "id" TEXT PRIMARY KEY,
          "pageUrl" TEXT NOT NULL,
          "elementId" TEXT NOT NULL,
          "viewport" TEXT NOT NULL DEFAULT 'Desktop',
          "span" INTEGER NOT NULL DEFAULT 12,
          "order" INTEGER NOT NULL DEFAULT 0,
          "producerId" TEXT,
          "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
      `);

      // 2. Tenta adicionar a constraint UNIQUE (se falhar, é porque já existe ou há duplicatas)
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "UILayoutConfig" ADD CONSTRAINT "UILayoutConfig_target_idx" UNIQUE ("pageUrl", "elementId", "viewport");
        `);
      } catch (e) {
        // Se falhou por duplicatas, limpamos a tabela para recomeçar (mais seguro no estágio de dev)
        // console.log("LAYOUT_REPAIR: Constraint already exists or duplicates found.");
      }

      // 3. Executa o INSERT com ON CONFLICT referenciando as colunas exatas
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UILayoutConfig" ("id", "pageUrl", "elementId", "viewport", "span", "order", "updatedAt", "createdAt")
        VALUES (
          'lay_${Math.random().toString(36).substring(2, 11)}', 
          '${data.pageUrl}', 
          '${data.elementId}', 
          '${data.viewport}',
          ${data.span}, 
          ${data.order ?? 0}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT ("pageUrl", "elementId", "viewport") 
        DO UPDATE SET "span" = ${data.span}, "order" = ${data.order ?? 0}, "updatedAt" = NOW();
      `);
    }

    revalidatePath(data.pageUrl);
    return { success: true };
  } catch (error: any) {
    console.error("LAYOUT_ACTION: Error saving config:", error.message);
    // Tenta um último fallback: DELETE e INSERT
    try {
      await prisma.$executeRawUnsafe(`
        DELETE FROM "UILayoutConfig" WHERE "pageUrl" = '${data.pageUrl}' AND "elementId" = '${data.elementId}' AND "viewport" = '${data.viewport}';
        INSERT INTO "UILayoutConfig" ("id", "pageUrl", "elementId", "viewport", "span", "order", "updatedAt", "createdAt")
        VALUES ('lay_${Math.random().toString(36).substring(2, 11)}', '${data.pageUrl}', '${data.elementId}', '${data.viewport}', ${data.span}, ${data.order ?? 0}, NOW(), NOW());
      `);
      return { success: true };
    } catch (finalError: any) {
      return { success: false, error: finalError.message };
    }
  }
}
