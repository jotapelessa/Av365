import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { subDays, startOfDay } from 'date-fns';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedProduction() {
  console.log('🚀 Semeando histórico de produção de elite...');

  const flocks = await prisma.flock.findMany({
    where: { status: 'ACTIVE' },
    include: { houses: true }
  });

  if (!flocks.length) {
    console.error('❌ Nenhum lote ativo encontrado. Rode o seed de galpões primeiro.');
    return;
  }

  const today = startOfDay(new Date());

  for (const flock of flocks) {
    console.log(`🐣 Gerando histórico para o lote: ${flock.name}`);
    
    // Limpar registros da última semana para este lote
    await prisma.dailyRecord.deleteMany({
      where: {
        flockId: flock.id,
        date: { gte: subDays(today, 15) }
      }
    });

    for (let i = 14; i >= 0; i--) {
      const date = subDays(today, i);
      const quantity = flock.currentQuantity;
      
      // Simular variação de postura (88% a 94%)
      const rate = 0.88 + Math.random() * 0.06;
      const eggsTotal = Math.floor(quantity * rate);
      
      // Simular mortalidade baixa (0 a 3 aves por dia)
      const mortality = Math.floor(Math.random() * 4);
      
      // Simular consumo (110g a 120g por ave)
      const feedConsumed = (quantity * (110 + Math.random() * 10)) / 1000;
      const waterConsumed = quantity * (0.2 + Math.random() * 0.05);

      await prisma.dailyRecord.create({
        data: {
          date,
          flockId: flock.id,
          houseId: flock.houses?.[0]?.id,
          eggsTotal,
          eggsBroken: Math.floor(eggsTotal * 0.01),
          eggsDirty: Math.floor(eggsTotal * 0.005),
          mortality,
          feedConsumed,
          waterConsumed,
          temperature: 24 + Math.random() * 4,
          humidity: 60 + Math.random() * 10,
          notes: i === 0 ? "Produção estável seguindo a curva da linhagem." : undefined,
          producerId: flock.producerId,
        }
      });
    }
  }

  console.log('✅ Histórico de produção semeado com sucesso!');
}

seedProduction()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
