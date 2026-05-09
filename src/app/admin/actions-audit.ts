'use server';

import { db as globalPrisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export async function reportUIIssue(data: {
  elementId?: string;
  pageUrl: string;
  viewport: string;
  issueType: string;
  description?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Tenta usar o global, se não tiver o modelo, cria uma instância nova temporária
  let prisma: any = globalPrisma;
  
  if (!(prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback)) {
    console.log("AUDIT_ACTION: Global Prisma is stale. Creating fresh instance with Direct URL...");
    const pool = new Pool({ connectionString: process.env.DIRECT_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  try {
    console.log("AUDIT_ACTION: Attempting to save feedback...", { data, adminId: userId });
    
    // Tenta encontrar o modelo no prisma (uIFeedback ou uiFeedback ou UIFeedback)
    const model = prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback;
    
    let feedback;
    if (model) {
      feedback = await model.create({
        data: {
          ...data,
          adminId: userId,
          status: "OPEN"
        }
      });
    } else {
      console.log("AUDIT_ACTION: Model not found in client. Falling back to Raw SQL...");
      // Fallback: Inserção manual via SQL se o Prisma Client estiver desatualizado
      const id = `ui_${Math.random().toString(36).substring(2, 11)}`;
      await prisma.$executeRaw`
        INSERT INTO "UIFeedback" ("id", "elementId", "pageUrl", "viewport", "issueType", "description", "status", "adminId", "updatedAt")
        VALUES (${id}, ${data.elementId || null}, ${data.pageUrl}, ${data.viewport}, ${data.issueType}, ${data.description || null}, 'OPEN', ${userId}, NOW())
      `;
      feedback = { id };
    }

    console.log("AUDIT_ACTION: Success!", feedback.id);
    // revalidatePath("/admin/security");
    return { success: true, feedback };
  } catch (error: any) {
    console.error("AUDIT_ACTION: Error saving report:", error.message || error);
    console.log("AUDIT_ACTION: Prisma Keys:", Object.keys(prisma).filter(k => !k.startsWith('_')));
    return { success: false, error: error.message || "Falha ao salvar reporte" };
  }
}

export async function getUIFeedbacks() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let prisma: any = globalPrisma;
  if (!(prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback)) {
    const pool = new Pool({ connectionString: process.env.DIRECT_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  const model = prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback;
  
  if (model) {
    return await model.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } else {
    return await prisma.$queryRaw`SELECT * FROM "UIFeedback" ORDER BY "createdAt" DESC`;
  }
}

export async function updateUIFeedbackStatus(id: string, status: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let prisma: any = globalPrisma;
  if (!(prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback)) {
    const pool = new Pool({ connectionString: process.env.DIRECT_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }

  const model = prisma.uIFeedback || prisma.uiFeedback || prisma.UIFeedback;

  if (model) {
    await model.update({
      where: { id },
      data: { status }
    });
  } else {
    await prisma.$executeRaw`UPDATE "UIFeedback" SET "status" = ${status}, "updatedAt" = NOW() WHERE "id" = ${id}`;
  }

  revalidatePath("/admin/audit");
  return { success: true };
}
