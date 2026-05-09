import { db } from "../lib/prisma";

async function main() {
  const users = await db.user.findMany();
  console.log("Usuários encontrados:", users.length);
  
  for (const user of users) {
    if (user.role !== 'SUPER_ADMIN') {
      console.log(`Promovendo ${user.email} para PRODUCER...`);
      await db.user.update({
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
    // db.disconnect no lib/prisma pode não estar exposto da mesma forma
    // mas o processo vai encerrar.
  });
