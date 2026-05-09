import { PrismaClient, ExpenseCategory, SaleProduct } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { subDays, addDays, format, startOfDay } from 'date-fns';

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Iniciando Geração de Dados Massivos (3 Anos)...');

  // 1. Forçar o ID do usuário logado (descoberto via auditoria de banco)
  const targetId = 'user_3D8vftklnuNjeuHEZ7Naca1Wsaw';
  
  let producer = await prisma.producer.findUnique({
    where: { id: targetId }
  });

  if (!producer) {
    console.log(`ℹ️ Produtor ${targetId} não existe. Criando...`);
    producer = await prisma.producer.create({
      data: {
        id: targetId,
        name: 'Granja Jota Pê (Massiva)',
        cnpj: '00.000.000/0001-99',
        plan: 'ELITE',
        status: 'ACTIVE',
        slug: 'granja-jotape'
      }
    });
  }

  console.log(`🎯 Alvo: Produtor ID [${producer.id}] - Nome: [${producer.name}]`);
  const producerId = producer.id;

  // 2. Limpar dados antigos do produtor de teste para evitar duplicidade
  await prisma.dailyRecord.deleteMany({ where: { producerId } });
  await prisma.expense.deleteMany({ where: { producerId } });
  await prisma.sale.deleteMany({ where: { producerId } });
  await prisma.flock.deleteMany({ where: { producerId } });
  console.log('🧹 Dados antigos limpos.');

  // 3. Criar Lotes Sequenciais (Cada lote dura ~80 semanas)
  const totalDays = 1095; // 3 anos
  const startDate = subDays(new Date(), totalDays);

  // Criaremos 3 lotes que se sobrepõem ou são sequenciais
  const flockConfigs = [
    { name: 'Lote ALFA-2023', breed: 'Isa Brown', offset: 0 },
    { name: 'Lote BETA-2024', breed: 'Dekalb White', offset: 400 },
    { name: 'Lote GAMA-2025', breed: 'Hisex White', offset: 800 },
  ];

  for (const config of flockConfigs) {
    const arrivalDate = addDays(startDate, config.offset);
    
    const flock = await prisma.flock.create({
      data: {
        name: config.name,
        breed: config.breed,
        purpose: 'POSTURA',
        initialQuantity: 10000,
        currentQuantity: 10000,
        acquisitionDate: arrivalDate,
        status: addDays(arrivalDate, 560) < new Date() ? 'INACTIVE' : 'ACTIVE',
        producerId
      }
    });

    console.log(`🐣 Lote ${flock.name} criado. Gerando registros...`);

    // Gerar registros diários para este lote (máximo 560 dias ou até hoje)
    const recordsToGenerate = Math.min(560, totalDays - config.offset);
    
    const dailyRecords = [];
    const expenses = [];
    const sales = [];

    for (let i = 0; i < recordsToGenerate; i++) {
      const currentDate = addDays(arrivalDate, i);
      if (currentDate > new Date()) break;

      // Curva de Produção (Simulada)
      // Pico entre dia 150 e 250
      let prodRate = 0;
      if (i > 140) {
        const ageInWeeks = i / 7;
        if (ageInWeeks < 25) prodRate = 0.85;
        else if (ageInWeeks < 40) prodRate = 0.94;
        else if (ageInWeeks < 60) prodRate = 0.88;
        else prodRate = 0.78;
      }

      const eggsTotal = Math.floor(10000 * prodRate * (1 - (Math.random() * 0.05)));
      
      dailyRecords.push({
        date: currentDate,
        eggsTotal,
        eggsBroken: Math.floor(eggsTotal * 0.01),
        eggsDirty: Math.floor(eggsTotal * 0.02),
        feedConsumed: 1100, // 110g por ave
        mortality: Math.random() > 0.8 ? 1 : 0,
        flockId: flock.id,
        producerId
      });

      // Gerar Despesa de Ração (Semanal)
      if (i % 7 === 0) {
        expenses.push({
          category: ExpenseCategory.FEED,
          amount: 15400, // Estimado
          date: currentDate,
          description: `Compra de Ração - Semana ${Math.floor(i/7)}`,
          producerId
        });
      }

      // Gerar Venda de Ovos (A cada 3 dias)
      if (i % 3 === 0 && eggsTotal > 0) {
        sales.push({
          product: SaleProduct.EGGS,
          quantity: eggsTotal * 3,
          unit: 'UN',
          amount: (eggsTotal * 3) * 0.50, // 0.50 por ovo
          date: currentDate,
          producerId
        });
      }
    }

    // Inserções em lote (Batch)
    await prisma.dailyRecord.createMany({ data: dailyRecords });
    await prisma.expense.createMany({ data: expenses });
    await prisma.sale.createMany({ data: sales });
    
    console.log(`✅ ${dailyRecords.length} dias de dados gerados para ${flock.name}`);
  }

  console.log('✨ Simulação Concluída com Sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
