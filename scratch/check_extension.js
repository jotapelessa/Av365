
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

async function check() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  const db = new PrismaClient({ adapter });
  
  console.log("DB keys:", Object.keys(db).filter(k => !k.startsWith('$') && !k.startsWith('_')));
  
  const extended = db.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          return query(args);
        }
      }
    }
  });

  console.log("Extended keys:", Object.keys(extended).filter(k => !k.startsWith('$') && !k.startsWith('_')));
  console.log("extended.installment:", typeof extended.installment);
  
  await db.$disconnect();
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
