const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: "postgresql://postgres.wxzrlkdslyfuofnrgpws:av365pro07539931477@aws-1-sa-east-1.pooler.supabase.com:5432/postgres" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log("Usuários encontrados:", users.length);
  
  for (const user of users) {
    if (user.role !== 'SUPER_ADMIN') {
      console.log(`Promovendo ${user.email} (${user.id}) para PRODUCER...`);
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'PRODUCER' }
      });
    }
  }
  
  console.log("Promoção concluída.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
