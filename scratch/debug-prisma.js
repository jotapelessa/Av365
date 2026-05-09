
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("TaskStatus keys:", Object.keys(require('@prisma/client').TaskStatus || {}));
  console.log("TaskPriority keys:", Object.keys(require('@prisma/client').TaskPriority || {}));
  console.log("Prisma exports:", Object.keys(require('@prisma/client')));
}

main().catch(console.error);
