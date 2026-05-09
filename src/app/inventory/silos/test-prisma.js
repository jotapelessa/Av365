const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Modelos disponíveis no Prisma Client:");
  console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')));
  
  try {
    const silos = await prisma.silo.findMany();
    console.log("Silos encontrados:", silos.length);
  } catch (e) {
    console.error("Erro ao acessar silos:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
