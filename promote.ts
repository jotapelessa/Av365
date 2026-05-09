import { PrismaClient } from '@prisma/client';
import { createClerkClient } from "@clerk/nextjs/server";
import * as dotenv from 'dotenv';

dotenv.config();

const db = new PrismaClient();
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function promote() {
  try {
    const user = await db.user.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!user) {
      console.log("Nenhum usuário encontrado.");
      return;
    }

    console.log(`Promovendo usuário: ${user.email}`);

    // 1. Banco
    await db.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' }
    });

    // 2. Clerk
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'super_admin'
      }
    });

    console.log("!!! VOCÊ AGORA É SUPER_ADMIN !!!");
  } catch (e) {
    console.error(e);
  } finally {
    await db.$disconnect();
  }
}

promote();
