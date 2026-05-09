const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
async function test() {
  console.log("Checking webhookLog...");
  try {
    const count = await db.webhookLog.count();
    console.log("Count:", count);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await db.$disconnect();
  }
}
test();
