import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const logs: any = await prisma.$queryRaw`SELECT * FROM "UIFeedback" ORDER BY "createdAt" DESC LIMIT 5;`;
    console.log(JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error("Error reading logs:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
