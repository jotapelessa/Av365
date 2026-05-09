export {};
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Carregar variáveis do .env manualmente
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Pegar o produtor 'jotape' ou o primeiro disponível
  const producer = await prisma.producer.findFirst({
    where: { name: { contains: 'jotape', mode: 'insensitive' } }
  }) || await prisma.producer.findFirst();

  if (!producer) {
    console.error("Nenhum produtor encontrado no banco de dados.");
    return;
  }

  const producerId = producer.id;

  console.log(`🌱 Semeando 10 galpões para o produtor: ${producer.name} (${producerId})`);

  // Opcional: Limpar galpões existentes para começar do zero (descomente se quiser)
  // await prisma.house.deleteMany({ where: { producerId } });

  const systems = ["DARK_HOUSE", "AUTOMATED", "CONVENTIONAL"];
  
  for (let i = 1; i <= 10; i++) {
    const system = systems[Math.floor(Math.random() * systems.length)];
    const width = 10 + Math.random() * 4; // 10 a 14m
    const length = 80 + Math.random() * 70; // 80 a 150m
    const capacity = Math.floor((width * length) * (system === "DARK_HOUSE" ? 14 : 10)); // Densidade estimada

    await prisma.house.create({
      data: {
        name: `Galpão ${String(i).padStart(2, '0')} - Setor ${i <= 5 ? 'Norte' : 'Sul'}`,
        capacity: capacity,
        width: parseFloat(width.toFixed(2)),
        length: parseFloat(length.toFixed(2)),
        housingSystem: system,
        hasClimate: system === "DARK_HOUSE" || Math.random() > 0.5,
        hasAutoFeeding: system !== "CONVENTIONAL" || Math.random() > 0.7,
        description: `Infraestrutura de alta performance - Sistema ${system}.`,
        status: "ACTIVE",
        producerId
      }
    });
    console.log(`✅ Criado: Galpão ${i} (${system})`);
  }

  console.log("✨ Missão cumprida: 10 Galpões de Elite semeados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
