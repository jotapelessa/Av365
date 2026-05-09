import { PrismaClient } from "@prisma/client";
import { subDays, addDays, format } from 'date-fns';

const prisma = new PrismaClient();

async function megaSeed() {
  console.log("🚀 Iniciando MEGA SEED de Elite (5 Anos de Histórico)...");

  const producerId = "user_2lAnF3Qp6X8H9J1L4M7N0P3R6S9"; // ID do Produtor Matriz

  // 1. Limpeza Seletiva (Opcional, mas recomendado para stress test limpo)
  // await prisma.dailyRecord.deleteMany({ where: { producerId } });
  // await prisma.expense.deleteMany({ where: { producerId } });
  // await prisma.sale.deleteMany({ where: { producerId } });

  const bank = await prisma.financialAccount.findFirst({
    where: { producerId, type: 'BANK' }
  });

  const houses = await prisma.house.findMany({ where: { producerId } });
  if (houses.length === 0) {
    console.error("❌ Erro: Nenhum galpão encontrado para o produtor.");
    return;
  }

  const today = new Date();
  const fiveYearsAgo = subDays(today, 365 * 5);

  console.log(`📅 Período: ${format(fiveYearsAgo, 'dd/MM/yyyy')} até ${format(today, 'dd/MM/yyyy')}`);

  // 2. Geração de Lotes Históricos
  // Simular ciclos de 80 semanas (~1.5 anos)
  const cycleWeeks = 80;
  const cycles = 4; // Aproximadamente 5-6 anos

  for (const house of houses) {
    console.log(`🏠 Processando Galpão: ${house.name}`);
    
    for (let c = 0; c < cycles; c++) {
      const acquisitionDate = addDays(fiveYearsAgo, c * cycleWeeks * 7);
      if (acquisitionDate > today) break;

      const flock = await prisma.flock.create({
        data: {
          name: `Lote ${house.name} - Ciclo ${c + 1}`,
          breed: "Lohmann Brown",
          initialQuantity: house.capacity,
          currentQuantity: Math.floor(house.capacity * 0.98),
          acquisitionDate,
          status: addDays(acquisitionDate, cycleWeeks * 7) < today ? 'COMPLETED' : 'ACTIVE',
          producerId,
          houses: { connect: { id: house.id } }
        }
      });

      // 3. Registros Diários do Lote
      const dailyRecords = [];
      const durationDays = Math.min(cycleWeeks * 7, Math.floor((today.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24)));

      for (let d = 0; d < durationDays; d++) {
        const recordDate = addDays(acquisitionDate, d);
        
        // Curva de postura simplificada
        let prodRate = 0;
        if (d > 140) { // 20 semanas
          prodRate = Math.min(0.96, 0.4 + (d - 140) * 0.01);
          if (d > 300) prodRate -= (d - 300) * 0.0004;
        }

        const eggs = Math.floor(flock.initialQuantity * (prodRate + (Math.random() * 0.04 - 0.02)));

        dailyRecords.push({
          date: recordDate,
          eggsTotal: Math.max(0, eggs),
          feedConsumed: flock.initialQuantity * 0.115,
          mortality: Math.random() > 0.97 ? 1 : 0,
          waterConsumed: flock.initialQuantity * 0.26,
          temperature: 24 + (Math.random() * 4 - 2),
          humidity: 65 + (Math.random() * 15 - 7),
          flockId: flock.id,
          producerId,
          houseId: house.id
        });

        // Inserir em lotes de 500 para não estourar a memória
        if (dailyRecords.length >= 500) {
          await prisma.dailyRecord.createMany({ data: dailyRecords });
          dailyRecords.length = 0;
        }
      }
      if (dailyRecords.length > 0) {
        await prisma.dailyRecord.createMany({ data: dailyRecords });
      }

      console.log(`   ✅ Ciclo ${c + 1} finalizado.`);
    }
  }

  // 4. Finanças Retroativas (Vendas de Ovos e Despesas)
  console.log("💰 Gerando Fluxo Financeiro Retroativo...");
  
  const sales = [];
  const expenses = [];

  for (let d = 0; d < 365 * 5; d += 7) { // Semanalmente
    const date = addDays(fiveYearsAgo, d);
    if (date > today) break;

    sales.push({
      product: 'EGGS' as any,
      quantity: 50000 + (Math.random() * 10000),
      unit: "DZ",
      amount: 15000 + (Math.random() * 5000),
      date,
      status: 'PAID' as any,
      producerId,
      accountId: bank?.id
    });

    expenses.push({
      category: 'FEED' as any,
      amount: 8000 + (Math.random() * 2000),
      date: addDays(date, 2),
      status: 'PAID' as any,
      producerId,
      accountId: bank?.id,
      description: "Compra de Ração Semanal"
    });

    if (sales.length >= 100) {
      await prisma.sale.createMany({ data: sales });
      await prisma.expense.createMany({ data: expenses });
      sales.length = 0;
      expenses.length = 0;
    }
  }

  if (sales.length > 0) {
    await prisma.sale.createMany({ data: sales });
    await prisma.expense.createMany({ data: expenses });
  }

  console.log("✨ MEGA SEED FINALIZADO! Sistema agora possui 5 anos de inteligência.");
}

megaSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
