const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function testFeedback() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Testing UIFeedback creation...");
    const feedback = await prisma.uIFeedback.create({
      data: {
        elementId: "test-script",
        pageUrl: "/test",
        viewport: "Desktop",
        issueType: "Test",
        description: "Testing via script",
        adminId: "user_test_123"
      }
    });
    console.log("Success! Created feedback with ID:", feedback.id);
  } catch (error) {
    console.error("Error creating feedback:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFeedback();
