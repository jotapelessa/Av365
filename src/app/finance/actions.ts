'use server';

import { db } from "@/lib/tenant";
import { getTenantDb, getProducerId, checkAdminRole } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { subDays, addDays } from "date-fns";
import { PaymentStatus, SaleProduct, ExpenseCategory } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

/**
 * Cria uma Venda de Elite com suporte a parcelamento e vínculos contábeis.
 */
export async function createEliteSale(data: {
  product: SaleProduct;
  quantity: number;
  unit: string;
  amount: number;
  date: Date;
  description?: string;
  customerId?: string;
  accountId?: string;
  status: PaymentStatus;
  installments?: { dueDate: Date; amount: number }[];
  invoiceUrl?: string;
}) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  // 1. Criar a Venda
  const sale = await tenantPrisma.sale.create({
    data: {
      product: data.product,
      quantity: data.quantity,
      unit: data.unit,
      amount: data.amount,
      date: data.date,
      description: data.description,
      status: data.status,
      customerId: data.customerId,
      accountId: data.accountId,
      invoiceUrl: data.invoiceUrl,
      producerId: producerId as string,
    }
  });

  // 2. Criar Parcelas (se houver)
  if (data.installments && data.installments.length > 0) {
    await tenantPrisma.installment.createMany({
      data: data.installments.map(inst => ({
        amount: inst.amount,
        dueDate: inst.dueDate,
        status: data.status === 'PAID' ? 'PAID' : 'PENDING',
        saleId: sale.id,
        accountId: data.accountId,
        paidAt: data.status === 'PAID' ? data.date : null,
        producerId: producerId as string,
      }))
    });
  }

  // 3. Atualizar Saldo da Conta (se pago à vista)
  if (data.status === 'PAID' && data.accountId) {
    await tenantPrisma.financialAccount.update({
      where: { id: data.accountId },
      data: { balance: { increment: data.amount } }
    });
  }

  revalidatePath("/finance");
  return sale;
}

/**
 * Cria uma Despesa de Elite com suporte a parcelamento e vínculos contábeis.
 */
export async function createEliteExpense(data: {
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description?: string;
  flockId?: string;
  supplierId?: string;
  employeeId?: string;
  accountId?: string;
  status: PaymentStatus;
  installments?: { dueDate: Date; amount: number }[];
  invoiceUrl?: string;
}) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  // 1. Criar a Despesa
  const expense = await tenantPrisma.expense.create({
    data: {
      category: data.category,
      amount: data.amount,
      date: data.date,
      description: data.description,
      status: data.status,
      flockId: data.flockId || null,
      supplierId: data.supplierId || null,
      employeeId: data.employeeId || null,
      accountId: data.accountId || null,
      invoiceUrl: data.invoiceUrl,
      producerId: producerId as string,
    }
  });

  // 2. Criar Parcelas
  if (data.installments && data.installments.length > 0) {
    await tenantPrisma.installment.createMany({
      data: data.installments.map(inst => ({
        amount: inst.amount,
        dueDate: inst.dueDate,
        status: data.status === 'PAID' ? 'PAID' : 'PENDING',
        expenseId: expense.id,
        accountId: data.accountId,
        paidAt: data.status === 'PAID' ? data.date : null,
        producerId: producerId as string,
      }))
    });
  }

  // 3. Atualizar Saldo da Conta (se pago à vista)
  if (data.status === 'PAID' && data.accountId) {
    await tenantPrisma.financialAccount.update({
      where: { id: data.accountId },
      data: { balance: { decrement: data.amount } }
    });
  }

  revalidatePath("/finance");
  return expense;
}

/**
 * Exclui uma Venda (TransactionGuard: Bloqueia se houver parcelas pagas)
 */
export async function deleteEliteSale(saleId: string) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  
  const sale = await tenantPrisma.sale.findUnique({
    where: { id: saleId },
    include: { installments: true }
  });

  if (!sale) throw new Error("Venda não encontrada.");

  // TransactionGuard
  const hasPaidInstallments = sale.installments.some(inst => inst.status === 'PAID');
  if (sale.status === 'PAID' || hasPaidInstallments) {
    throw new Error("GOVERNANÇA: Não é possível excluir uma venda com recebimentos já efetivados no caixa. Realize um ajuste manual de estorno se necessário.");
  }

  await tenantPrisma.sale.delete({ where: { id: saleId } });
  
  revalidatePath("/finance");
}

/**
 * Exclui uma Despesa (TransactionGuard: Bloqueia se houver parcelas pagas)
 */
export async function deleteEliteExpense(expenseId: string) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  
  const expense = await tenantPrisma.expense.findUnique({
    where: { id: expenseId },
    include: { installments: true }
  });

  if (!expense) throw new Error("Despesa não encontrada.");

  // TransactionGuard
  const hasPaidInstallments = expense.installments.some(inst => inst.status === 'PAID');
  if (expense.status === 'PAID' || hasPaidInstallments) {
    throw new Error("GOVERNANÇA: Não é possível excluir uma despesa já liquidada ou com parcelas pagas. Utilize estornos manuais para correções.");
  }

  await tenantPrisma.expense.delete({ where: { id: expenseId } });
  
  revalidatePath("/finance");
}

/**
 * Liquida uma parcela e atualiza o saldo da conta.
 */
export async function payInstallment(installmentId: string, accountId: string) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();

  const installment = await tenantPrisma.installment.findUnique({
    where: { id: installmentId },
    include: { expense: true, sale: true }
  });

  if (!installment || installment.status === 'PAID') return;

  await tenantPrisma.$transaction([
    // Marcar como paga
    tenantPrisma.installment.update({
      where: { id: installmentId },
      data: { status: 'PAID', paidAt: new Date(), accountId }
    }),
    // Atualizar saldo
    tenantPrisma.financialAccount.update({
      where: { id: accountId },
      data: { 
        balance: installment.saleId 
          ? { increment: installment.amount } 
          : { decrement: installment.amount } 
      }
    })
  ]);

  revalidatePath("/finance");
}

/**
 * Realiza uma transferência entre contas internas.
 */
export async function createInternalTransfer(data: {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
  description?: string;
  date: Date;
}) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  await tenantPrisma.$transaction([
    // Registrar a transferência
    tenantPrisma.internalTransfer.create({
      data: {
        amount: data.amount,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        description: data.description,
        date: data.date,
        producerId: producerId as string,
      }
    }),
    // Debitar origem
    tenantPrisma.financialAccount.update({
      where: { id: data.fromAccountId },
      data: { balance: { decrement: data.amount } }
    }),
    // Creditar destino
    tenantPrisma.financialAccount.update({
      where: { id: data.toAccountId },
      data: { balance: { increment: data.amount } }
    })
  ]);

  revalidatePath("/finance");
}

/**
 * Gestão de Funcionários
 */
export async function upsertEmployee(data: any) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  const employee = await tenantPrisma.employee.upsert({
    where: { id: data.id || 'new' },
    update: data,
    create: { ...data, producerId: producerId as string }
  });

  revalidatePath("/finance");
  return employee;
}

/**
 * Gestão de Clientes
 */
export async function upsertCustomer(data: any) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  const customer = await tenantPrisma.customer.upsert({
    where: { id: data.id || 'new' },
    update: data,
    create: { ...data, producerId: producerId as string }
  });

  revalidatePath("/finance");
  return customer;
}

/**
 * Gestão de Fornecedores
 */
export async function upsertSupplier(data: any) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  const supplier = await tenantPrisma.supplier.upsert({
    where: { id: data.id || 'new' },
    update: data,
    create: { ...data, producerId: producerId as string }
  });

  revalidatePath("/finance");
  return supplier;
}

/**
 * Gestão de Contas Bancárias/Caixa
 */
export async function upsertFinancialAccount(data: any) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) throw new Error("Acesso negado: ID do produtor não identificado.");

  const account = await tenantPrisma.financialAccount.upsert({
    where: { id: data.id || 'new' },
    update: data,
    create: { ...data, producerId: producerId as string }
  });

  revalidatePath("/finance");
  return account;
}

/**
 * LIMPA TODOS OS DADOS FINANCEIROS (Apenas para Testes/Dev)
 */
export async function clearFinancialData() {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return;

  await tenantPrisma.$transaction([
    tenantPrisma.internalTransfer.deleteMany({ where: { producerId: producerId as string } }),
    tenantPrisma.installment.deleteMany({ where: { producerId: producerId as string } }),
    tenantPrisma.sale.deleteMany({ where: { producerId: producerId as string } }),
    tenantPrisma.expense.deleteMany({ where: { producerId: producerId as string } }),
    tenantPrisma.financialAccount.updateMany({ 
      where: { producerId: producerId as string }, 
      data: { balance: 0 } 
    })
  ]);

  revalidatePath("/finance");
}

/**
 * POVOA O SISTEMA COM DADOS MASSIVOS (5 ANOS / ~1000+ REGISTROS)
 */
export async function seedTestData() {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return;

  // 🐣 AUTO-ONBOARDING SEED: Garantir que o Produtor e o Usuário existam
  await db.producer.upsert({
    where: { id: producerId as string },
    update: {},
    create: { 
      id: producerId as string, 
      name: "Granja Elite (Seed)",
      status: 'ACTIVE'
    }
  });

  const { userId } = await auth();
  if (userId) {
    await db.user.upsert({
      where: { id: userId },
      update: { producerId: producerId as string },
      create: { 
        id: userId, 
        email: "seed@av365.com.br",
        role: 'PRODUCER',
        producerId: producerId as string
      }
    });
  }

  // 1. Garantir Contas
  const bank = await tenantPrisma.financialAccount.upsert({
    where: { id: 'bank-seed' },
    update: {},
    create: { 
      id: 'bank-seed',
      name: "Banco do Brasil (Elite)", 
      type: 'BANK', 
      balance: 150000, 
      producerId 
    }
  });

  const cash = await tenantPrisma.financialAccount.upsert({
    where: { id: 'cash-seed' },
    update: {},
    create: { 
      id: 'cash-seed',
      name: "Caixa Sede", 
      type: 'CASH', 
      balance: 5000, 
      producerId 
    }
  });

  const reserve = await tenantPrisma.financialAccount.upsert({
    where: { id: 'reserve-seed' },
    update: {},
    create: { 
      id: 'reserve-seed',
      name: "Reserva de Emergência", 
      type: 'BANK', 
      balance: 85000, 
      producerId 
    }
  });

  // 1.1 Criar Funcionários
  const employees = await Promise.all([
    tenantPrisma.employee.upsert({
      where: { id: 'emp-1' }, update: {}, create: { id: 'emp-1', name: "Ricardo Almeida", position: "GERENTE_GERAL", baseSalary: 5500, status: "ACTIVE", producerId }
    }),
    tenantPrisma.employee.upsert({
      where: { id: 'emp-2' }, update: {}, create: { id: 'emp-2', name: "Maria Silva", position: "OPERADOR", baseSalary: 2800, status: "ACTIVE", producerId }
    }),
    tenantPrisma.employee.upsert({
      where: { id: 'emp-3' }, update: {}, create: { id: 'emp-3', name: "João Pedro", position: "VETERINARIO", baseSalary: 7200, status: "ACTIVE", producerId }
    }),
    tenantPrisma.employee.upsert({
      where: { id: 'emp-4' }, update: {}, create: { id: 'emp-4', name: "Ana Beatriz", position: "ADMINISTRATIVO", baseSalary: 3500, status: "ACTIVE", producerId }
    })
  ]);

  // 1.2 Criar Fornecedores
  const suppliers = await Promise.all([
    tenantPrisma.supplier.upsert({
      where: { id: 'sup-1' }, update: {}, create: { id: 'sup-1', name: "NutriAgro Insumos", category: "FEED", producerId }
    }),
    tenantPrisma.supplier.upsert({
      where: { id: 'sup-2' }, update: {}, create: { id: 'sup-2', name: "Genética Elite Aves", category: "FLOCKS", producerId }
    }),
    tenantPrisma.supplier.upsert({
      where: { id: 'sup-3' }, update: {}, create: { id: 'sup-3', name: "BioVet Saúde Animal", category: "MEDICINE", producerId }
    })
  ]);

  // 1.3 Criar Clientes
  const customers = await Promise.all([
    tenantPrisma.customer.upsert({
      where: { id: 'cust-1' }, update: {}, create: { id: 'cust-1', name: "Supermercado Central", taxId: "11.222.333/0001-44", producerId }
    }),
    tenantPrisma.customer.upsert({
      where: { id: 'cust-2' }, update: {}, create: { id: 'cust-2', name: "Distribuidora Ovo de Ouro", taxId: "55.666.777/0001-88", producerId }
    })
  ]);

  // 1.4 Criar Categorias e Itens de Estoque
  const feedCat = await tenantPrisma.inventoryCategory.upsert({
    where: { id: 'cat-feed' }, update: {}, create: { id: 'cat-feed', name: "Rações", producerId }
  });
  const medCat = await tenantPrisma.inventoryCategory.upsert({
    where: { id: 'cat-med' }, update: {}, create: { id: 'cat-med', name: "Medicamentos", producerId }
  });
  const packCat = await tenantPrisma.inventoryCategory.upsert({
    where: { id: 'cat-pack' }, update: {}, create: { id: 'cat-pack', name: "Embalagens", producerId }
  });

  await tenantPrisma.inventoryItem.deleteMany({ where: { producerId } });
  await tenantPrisma.inventoryItem.createMany({
    data: [
      { name: "Milho Moído", categoryId: feedCat.id, currentStock: 5000, unit: "KG", minStock: 1000, producerId },
      { name: "Farelo de Soja", categoryId: feedCat.id, currentStock: 3000, unit: "KG", minStock: 500, producerId },
      { name: "Bandejas 30 Ovos", categoryId: packCat.id, currentStock: 15000, unit: "UNIT", minStock: 2000, producerId },
      { name: "Vacina Newcastle", categoryId: medCat.id, currentStock: 50, unit: "UNIT", minStock: 10, producerId }
    ]
  });

  // 1.5 Criar Tarefas Operacionais Especialistas
  await tenantPrisma.task.deleteMany({ where: { producerId } });
  await (tenantPrisma.task as any).createMany({
    data: [
      { title: "Coleta de Ovos (Manhã)", description: "Coleta manual em todos os galpões", priority: "HIGH", status: "PENDING", dueDate: new Date(), producerId },
      { title: "Check de Ambiência G1", description: "Verificar exaustores, sensores e cortinas", priority: "CRITICAL", status: "PENDING", dueDate: new Date(), producerId },
      { title: "Limpeza de Bebedouros", description: "Higienização completa galpão 02", priority: "MEDIUM", status: "PENDING", dueDate: new Date(), producerId },
      { title: "Vacinação Lote 04", description: "Aplicação via água (Newcastle)", priority: "CRITICAL", status: "PENDING", dueDate: addDays(new Date(), 1), producerId },
      { title: "Pesagem de Aves (Amostra)", description: "Pesar 100 aves por galpão", priority: "MEDIUM", status: "PENDING", dueDate: addDays(new Date(), 2), producerId },
      { title: "Revisão Financeira", description: "Fechamento do fluxo de caixa mensal", priority: "LOW", status: "COMPLETED", dueDate: subDays(new Date(), 1), producerId }
    ]
  });

  // 2. Criar Galpões (Houses)
  const houses = [];
  for (let i = 1; i <= 5; i++) {
    const house = await tenantPrisma.house.create({
      data: {
        name: `Galpão ${i.toString().padStart(2, '0')}`,
        capacity: 15000,
        housingSystem: 'AUTOMATED',
        hasClimate: true,
        producerId
      }
    });
    houses.push(house);
  }

  // 3. Gerar Dados Retroativos (5 Anos)
  const today = new Date();
  const salesToCreate = [];
  const expensesToCreate = [];
  const flocksToCreate = [];

  for (let yearOffset = 0; yearOffset < 5; yearOffset++) {
    const currentYear = today.getFullYear() - yearOffset;
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 15);
      if (date > today) continue;

      // Vendas Semanais (Ovos)
      for (let week = 1; week <= 4; week++) {
        const saleDate = new Date(currentYear, month, week * 7);
        if (saleDate > today) continue;

        salesToCreate.push({
          product: 'EGGS' as any,
          quantity: 450 + Math.floor(Math.random() * 100),
          unit: 'CAIXA',
          amount: 12000 + (Math.random() * 5000),
          date: saleDate,
          status: 'PAID' as any,
          accountId: bank.id,
          description: `Venda Semanal Eggs - W${week}`,
          producerId
        });
      }

      // Despesas Mensais (Ração, Energia, etc)
      expensesToCreate.push({
        category: 'FEED' as any,
        amount: 8000 + (Math.random() * 3000),
        date: new Date(currentYear, month, 5),
        status: 'PAID' as any,
        accountId: bank.id,
        description: "Compra Mensal de Ração - Ref",
        producerId
      });

      expensesToCreate.push({
        category: 'ENERGY' as any,
        amount: 1500 + (Math.random() * 500),
        date: new Date(currentYear, month, 10),
        status: 'PAID' as any,
        accountId: bank.id,
        description: "Fatura de Energia Elétrica",
        producerId
      });

      expensesToCreate.push({
        category: 'LABOR' as any,
        amount: 4000,
        date: new Date(currentYear, month, 30),
        status: 'PAID' as any,
        accountId: bank.id,
        description: "Folha de Pagamento Equipe",
        producerId
      });
    }

    // 4. Lotes por Galpão (Alojamento a cada ~80 semanas)
    for (const house of houses) {
      const acquisitionDate = new Date(currentYear, 0, 1);
      flocksToCreate.push({
        name: `Lote ${house.name} - ${currentYear}`,
        breed: 'Lohmann Brown',
        initialQuantity: 12000,
        currentQuantity: 11850,
        acquisitionDate,
        status: yearOffset === 0 ? 'ACTIVE' : 'COMPLETED',
        producerId
      });
    }
  }

  // Persistência em Lote de Finanças
  await tenantPrisma.sale.createMany({ data: salesToCreate });
  await tenantPrisma.expense.createMany({ data: expensesToCreate });
  await tenantPrisma.flock.createMany({ data: flocksToCreate });

  // 5. NOVO: Gerar Histórico de 1 Ano para TODOS os Lotes (DailyRecord)
  const allFlocks = await tenantPrisma.flock.findMany({
    where: { producerId: producerId as string }
  });

  const dailyRecordsToCreate = [];
  
  for (const flock of allFlocks) {
    // Se o lote for antigo, geramos 365 dias. Se for novo, geramos desde a data de aquisição.
    const startDate = subDays(today, 365);
    
    for (let i = 0; i < 365; i++) {
      const recordDate = addDays(startDate, i);
      if (recordDate > today) break;

      // Lógica de produção realista (curva de postura)
      // Simulação: Aves comem ~110g/dia, produzem ~0.85 ovos/dia no pico
      const daysSinceStart = i;
      let productionRate = 0;
      
      if (daysSinceStart > 140) { // Começa a produzir após ~20 semanas
        // Pico de 95%, caindo levemente
        productionRate = Math.min(0.95, 0.5 + (daysSinceStart - 140) * 0.01);
        if (daysSinceStart > 250) productionRate -= (daysSinceStart - 250) * 0.0005;
      }

      const eggsTotal = Math.floor(flock.currentQuantity * (productionRate + (Math.random() * 0.05 - 0.025)));
      
      dailyRecordsToCreate.push({
        date: recordDate,
        eggsTotal: Math.max(0, eggsTotal),
        eggsBroken: Math.floor(eggsTotal * 0.01),
        eggsDirty: Math.floor(eggsTotal * 0.02),
        feedConsumed: (flock.currentQuantity * 0.11), // 110g per bird
        mortality: Math.random() > 0.95 ? 1 : 0,
        waterConsumed: (flock.currentQuantity * 0.25), // 250ml per bird
        temperature: 22 + (Math.random() * 6 - 3),
        humidity: 60 + (Math.random() * 20 - 10),
        flockId: flock.id,
        producerId: producerId as string,
        notes: "Seed Automático - Stress Test"
      });
    }
  }

  // Inserir registros em blocos de 1000 para evitar limites do Prisma/DB
  for (let i = 0; i < dailyRecordsToCreate.length; i += 1000) {
    const chunk = dailyRecordsToCreate.slice(i, i + 1000);
    await tenantPrisma.dailyRecord.createMany({ data: chunk });
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard");
  revalidatePath("/flocks");
}

/**
 * POVOA UM LOTE ESPECÍFICO COM 1 ANO DE DADOS
 */
export async function seedSingleFlockHistory(flockId: string) {
  await checkAdminRole();
  const tenantPrisma = await getTenantDb();
  const producerId = await getProducerId();
  if (!producerId) return;

  const flock = await tenantPrisma.flock.findUnique({
    where: { id: flockId }
  });

  if (!flock) throw new Error("Lote não encontrado.");

  const today = new Date();
  const startDate = subDays(today, 365);
  const dailyRecordsToCreate = [];

  for (let i = 0; i < 365; i++) {
    const recordDate = addDays(startDate, i);
    if (recordDate > today) break;

    const daysSinceStart = i;
    let productionRate = 0;
    
    if (daysSinceStart > 140) {
      productionRate = Math.min(0.95, 0.5 + (daysSinceStart - 140) * 0.01);
      if (daysSinceStart > 250) productionRate -= (daysSinceStart - 250) * 0.0005;
    }

    const eggsTotal = Math.floor(flock.currentQuantity * (productionRate + (Math.random() * 0.05 - 0.025)));
    
    dailyRecordsToCreate.push({
      date: recordDate,
      eggsTotal: Math.max(0, eggsTotal),
      eggsBroken: Math.floor(eggsTotal * 0.01),
      eggsDirty: Math.floor(eggsTotal * 0.02),
      feedConsumed: (flock.currentQuantity * 0.11),
      mortality: Math.random() > 0.98 ? 1 : 0,
      waterConsumed: (flock.currentQuantity * 0.25),
      temperature: 22 + (Math.random() * 6 - 3),
      humidity: 60 + (Math.random() * 20 - 10),
      flockId: flock.id,
      producerId: producerId as string,
      notes: "Seed Individual - Stress Test"
    });
  }

  // Inserir registros
  await tenantPrisma.dailyRecord.createMany({ data: dailyRecordsToCreate });

  revalidatePath(`/flocks/${flockId}`);
  revalidatePath("/dashboard");
}
