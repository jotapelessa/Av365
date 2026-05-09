import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { subDays, addDays } from 'date-fns';

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🐣 AV365: Iniciando MEGA SEED Operacional de Elite...");

  // 1. Linhagens (Padrões de Desempenho)
  const standards = [
    {
      breedName: "Lohmann Brown Classic",
      species: "Galinha Poedeira",
      description: "Padrão mundial de eficiência e qualidade de casca.",
      expectedProductionPeak: 96.5,
      expectedFCR: 2.1,
      standardsJson: [{ week: 18, rate: 15.0 }, { week: 23, rate: 96.5 }, { week: 80, rate: 75.0 }]
    },
    {
      breedName: "Hy-Line W-36",
      species: "Galinha Poedeira",
      description: "Eficiência imbatível em produção de ovos brancos.",
      expectedProductionPeak: 97.0,
      expectedFCR: 2.05,
      standardsJson: [{ week: 18, rate: 12.0 }, { week: 23, rate: 97.0 }, { week: 80, rate: 78.0 }]
    }
  ];

  for (const s of standards) {
    await prisma.lineageStandard.upsert({
      where: { breedName: s.breedName },
      update: s as any,
      create: s as any
    });
  }

  // 2. Garantir Produtor e Usuário Matriz
  const producerId = "user_2lAnF3Qp6X8H9J1L4M7N0P3R6S9"; // ID de teste tático
  const userId = producerId;

  await prisma.producer.upsert({
    where: { id: producerId },
    update: { name: "Granja Elite Matriz" },
    create: { id: producerId, name: "Granja Elite Matriz", status: 'ACTIVE' }
  });

  await prisma.user.upsert({
    where: { id: userId },
    update: { producerId, role: 'PRODUCER' },
    create: { id: userId, email: "gestor@av365.com.br", role: 'PRODUCER', producerId }
  });

  // 3. Contas Financeiras (Fluxo de Caixa Tático)
  const financialAccounts = [
    { id: 'acc_main', name: "Itaú Agro Corporate", type: 'BANK', balance: 850000.50, producerId },
    { id: 'acc_cash', name: "Fundo de Caixa", type: 'CASH', balance: 12500.00, producerId },
    { id: 'acc_reserve', name: "Reserva Lote L122", type: 'BANK', balance: 45000.00, producerId },
  ];

  for (const acc of financialAccounts) {
    await prisma.financialAccount.upsert({
      where: { id: acc.id },
      update: { balance: acc.balance },
      create: acc as any
    });
  }

  // 4. Funcionários (Operacional de Campo)
  const employees = [
    { id: 'emp_1', name: "Dr. Marcelo Aguiar", position: "VETERINARIO", baseSalary: 15500, status: "ACTIVE", producerId, veterinaryLicense: "CRMV-SP 99882" },
    { id: 'emp_2', name: "Fabiana Medeiros", position: "GERENTE_PRODUCAO", baseSalary: 7800, status: "ACTIVE", producerId },
    { id: 'emp_3', name: "Tiago Silva", position: "OPERADOR", baseSalary: 4200, status: "ACTIVE", producerId },
    { id: 'emp_4', name: "Lúcia Santos", position: "OPERADOR", baseSalary: 2800, status: "ACTIVE", producerId },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({ where: { id: emp.id }, update: emp as any, create: emp as any });
  }

  // 5. Cadeia de Suprimentos (Fornecedores e Clientes)
  const suppliers = [
    { id: 'sup_1', name: "NutriAgro S.A.", category: "FEED", contact: "Ricardo", phone: "(11) 98888-7777", producerId },
    { id: 'sup_2', name: "VetHealth (Vacinas)", category: "HEALTH", contact: "Dra. Ana", phone: "(19) 97777-6666", producerId },
  ];

  for (const sup of suppliers) {
    await prisma.supplier.upsert({ where: { id: sup.id }, update: sup as any, create: sup as any });
  }

  const customers = [
    { id: 'cust_1', name: "Rede Pão de Açúcar", taxId: "12.345.678/0001-01", producerId },
    { id: 'cust_2', name: "Distribuidora Ovos de Ouro", taxId: "98.765.432/0001-99", producerId },
  ];

  for (const cus of customers) {
    await prisma.customer.upsert({ where: { id: cus.id }, update: cus as any, create: cus as any });
  }

  // 6. Estoque de Insumos
  const catNutrition = await prisma.inventoryCategory.upsert({
    where: { id: 'cat_nutrition' },
    update: {},
    create: { id: 'cat_nutrition', name: "Nutrição e Rações", producerId }
  });

  const items = [
    { id: 'item_1', name: "Ração Postura Premium (Fase 1)", categoryId: catNutrition.id, unit: "KG", currentStock: 45000, minStock: 10000, producerId },
    { id: 'item_2', name: "Vacina Coriza G2", categoryId: catNutrition.id, unit: "DOSE", currentStock: 120000, minStock: 25000, producerId },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { id: item.id },
      update: { currentStock: item.currentStock },
      create: item as any
    });
  }

  // 7. Galpões e Lotes
  const house = await prisma.house.upsert({
    where: { id: 'house_1' },
    update: { capacity: 45000 },
    create: { id: 'house_1', name: "Galpão Matriz 01", capacity: 45000, housingSystem: 'DARK_HOUSE', hasClimate: true, producerId }
  });

  const flock = await prisma.flock.upsert({
    where: { id: 'flock_1' },
    update: { currentQuantity: 44850 },
    create: { id: 'flock_1', name: "Lote E-01 (Lohmann)", breed: "Lohmann Brown-SL", initialQuantity: 45000, currentQuantity: 44850, acquisitionDate: subDays(new Date(), 60), producerId }
  });

  // 8. TAREFAS TÁTICAS (CENTRO DE COMANDO)
  await prisma.task.deleteMany({ where: { producerId } });
  const tasks = [
    { id: 't_1', title: "Monitoramento de Amônia e CO2", description: "Verificar exaustores e ventilação mínima no Galpão 01", priority: "CRITICAL", status: "PENDING", dueDate: addDays(new Date(), 0.5), houseId: house.id, flockId: flock.id, producerId },
    { id: 't_2', title: "Coleta Automatizada Ciclo Matutino", description: "Monitorar esteiras e classificação automática", priority: "MEDIUM", status: "COMPLETED", dueDate: subDays(new Date(), 0.2), completedAt: subDays(new Date(), 0.1), houseId: house.id, producerId },
    { id: 't_3', title: "Vacinação Coriza (Lote E-01)", description: "Aplicação via aspersão fina", priority: "CRITICAL", status: "IN_PROGRESS", dueDate: new Date(), flockId: flock.id, producerId },
    { id: 't_4', title: "Conferência de Silos", description: "Conferência física vs digital de ração", priority: "HIGH", status: "PENDING", dueDate: addDays(new Date(), 1), producerId },
    { id: 't_5', title: "Ajuste de Curva de Luz", description: "Ajustar fotoperíodo conforme linhagem Lohmann", priority: "MEDIUM", status: "PENDING", dueDate: addDays(new Date(), 2), houseId: house.id, producerId },
  ];

  for (const t of tasks) {
    await (prisma.task as any).create({ data: t });
  }

  console.log("✅ MEGA SEED Operacional concluído com sucesso!");
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
