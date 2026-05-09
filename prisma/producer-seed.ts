
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PRODUCER_ID = 'cmopyy03n000053e82p6s08q7';

async function main() {
  console.log("🐣 EggTrack Elite: Semeando Dados Operacionais do Produtor...");

  // 1. Funcionários (Expert Poultry Staff)
  const employees = [
    { name: "Dr. Roberto Silveira", position: "Veterinário RT", baseSalary: 8500, veterinaryLicense: "CRMV-SP 12345" },
    { name: "João do Prado", position: "Supervisor de Galpão", baseSalary: 3200 },
    { name: "Maria das Dores", position: "Coletora de Ovos", baseSalary: 1800 },
    { name: "Ricardo Santos", position: "Vacinador", baseSalary: 2200 }
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { cpf: emp.name.replace(/ /g, "").toLowerCase() }, // Mock CPF for seed
      update: { ...emp, producerId: PRODUCER_ID },
      create: { ...emp, producerId: PRODUCER_ID, cpf: Math.random().toString().slice(2, 13) }
    });
  }
  console.log("✅ Funcionários integrados.");

  // 2. Fornecedores (Elite Insumos)
  const suppliers = [
    { name: "AgroCeres Multimix", category: "Nutrição", contact: "Vendas Ração", phone: "(11) 98888-7777" },
    { name: "Cobb-Vantress Brasil", category: "Genética", contact: "Pintinhos", phone: "(11) 97777-6666" },
    { name: "Zoetis Saúde Animal", category: "Medicamentos", contact: "Vacinas", phone: "(11) 96666-5555" }
  ];

  for (const sup of suppliers) {
    await prisma.supplier.upsert({
      where: { cnpj: sup.name.replace(/ /g, "").toLowerCase() },
      update: { ...sup, producerId: PRODUCER_ID },
      create: { ...sup, producerId: PRODUCER_ID, cnpj: Math.random().toString().slice(2, 16) }
    });
  }
  console.log("✅ Fornecedores integrados.");

  // 3. Clientes (Escoamento de Produção)
  const customers = [
    { name: "Supermercados Pão de Açúcar", email: "compras@paodeacucar.com.br", phone: "(11) 3000-0000" },
    { name: "Distribuidora de Ovos Mantiqueira", email: "logistica@mantiqueira.com.br", phone: "(11) 4000-0000" }
  ];

  for (const cus of customers) {
    await prisma.customer.upsert({
      where: { taxId: cus.name.replace(/ /g, "").toLowerCase() },
      update: { ...cus, producerId: PRODUCER_ID },
      create: { ...cus, producerId: PRODUCER_ID, taxId: Math.random().toString().slice(2, 16) }
    });
  }
  console.log("✅ Clientes integrados.");

  // 4. Estoque (Inventory & Categories)
  const categories = ["Rações", "Medicamentos", "Equipamentos", "Embalagens"];
  for (const catName of categories) {
    const category = await prisma.inventoryCategory.upsert({
      where: { id: `cat-${catName.toLowerCase()}` },
      update: { name: catName },
      create: { id: `cat-${catName.toLowerCase()}`, name: catName, producerId: PRODUCER_ID }
    });

    if (catName === "Rações") {
      await prisma.inventoryItem.create({
        data: {
          name: "Ração Inicial (Postura)",
          unit: "KG",
          currentStock: 5000,
          minStock: 1000,
          categoryId: category.id,
          producerId: PRODUCER_ID
        }
      });
    } else if (catName === "Medicamentos") {
      await prisma.inventoryItem.create({
        data: {
          name: "Vacina Gumboro (Lote 2024)",
          unit: "UNIT",
          currentStock: 50,
          minStock: 10,
          categoryId: category.id,
          producerId: PRODUCER_ID
        }
      });
    }
  }
  console.log("✅ Estoque e Categorias integrados.");

  // 5. Contas Bancárias (Financial Accounts)
  const accounts = [
    { name: "Banco do Brasil - Operacional", type: "BANK", balance: 125000.50 },
    { name: "Sicredi - Cooperativa", type: "BANK", balance: 45000.00 }
  ];

  for (const acc of accounts) {
    await prisma.financialAccount.create({
      data: { 
        name: acc.name,
        type: acc.type as any,
        balance: acc.balance,
        producerId: PRODUCER_ID 
      }
    });
  }
  console.log("✅ Contas Bancárias integradas.");

  // 6. Agenda (Operational Tasks)
  const today = new Date();
  const tasks = [
    { title: "Vacinação Marek - Galpão 01", description: "Aplicação obrigatória via spray.", priority: "CRITICAL", dueDate: new Date(today.getTime() + 86400000) },
    { title: "Limpeza de Bebedouros", description: "Rotina de biosseguridade.", priority: "MEDIUM", dueDate: today, recurrenceRule: "DAILY" },
    { title: "Coleta de Amostras de Sangue", description: "Envio para laboratório RT.", priority: "HIGH", dueDate: new Date(today.getTime() + 172800000) }
  ];

  for (const taskItem of tasks) {
    await prisma.task.create({
      data: { 
        title: taskItem.title,
        description: taskItem.description,
        priority: taskItem.priority as any,
        dueDate: taskItem.dueDate,
        producerId: PRODUCER_ID, 
        status: 'PENDING' 
      }
    });
  }
  console.log("✅ Agenda Operacional integrada.");

  console.log("🚀 Seed do Produtor finalizado com sucesso!");
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
