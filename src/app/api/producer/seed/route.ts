import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import { subDays, addDays } from 'date-fns';

export async function POST() {
  try {
    const headerList = await headers();
    const seederSecret = headerList.get('x-seeder-secret');
    let producerIdInput = headerList.get('x-producer-id-override');

    if (!seederSecret && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    let producerId: string;
    if (producerIdInput) {
      producerId = producerIdInput;
    } else {
      const firstProducer = await db.producer.findFirst();
      producerId = firstProducer?.id || "seed-producer-default";
    }

    // Garantir Produtor
    await db.producer.upsert({
      where: { id: producerId },
      update: {},
      create: { id: producerId, name: "Granja Elite Operacional", status: 'ACTIVE' }
    });
    
    console.log("🐣 Iniciando MEGA SEED Operacional Elite...");

    // 1. Contas Bancárias (Elite Density)
    const accounts = [
      { id: 'seed-bank-1', name: "Itaú Agro Corporate", type: 'BANK', balance: 850000.50, producerId },
      { id: 'seed-bank-2', name: "Sicoob Operacional", type: 'BANK', balance: 142300.25, producerId },
      { id: 'seed-bank-3', name: "Reserva Lote L122", type: 'BANK', balance: 45000.00, producerId },
      { id: 'seed-bank-4', name: "Fundo de Caixa", type: 'CASH', balance: 8500.00, producerId },
    ];

    for (const acc of accounts) {
      await db.financialAccount.upsert({ where: { id: acc.id }, update: acc as any, create: acc as any });
    }

    // 2. Funcionários (Avicultura Especialista)
    const employees = [
      { id: 'seed-emp-1', name: "Dr. Marcelo Aguiar", position: "Veterinário Responsável", baseSalary: 15500, status: "ACTIVE", producerId, veterinaryLicense: "CRMV-SP 99882" },
      { id: 'seed-emp-2', name: "Fabiana Medeiros", position: "Gerente de Produção", baseSalary: 7800, status: "ACTIVE", producerId },
      { id: 'seed-emp-3', name: "Tiago Silva", position: "Técnico de Manejo e Clima", baseSalary: 4200, status: "ACTIVE", producerId },
      { id: 'seed-emp-4', name: "Lúcia Santos", position: "Operadora de Classificação", baseSalary: 2800, status: "ACTIVE", producerId },
      { id: 'seed-emp-5', name: "Marcos Pires", position: "Vacinador Especialista", baseSalary: 3500, status: "ACTIVE", producerId },
    ];

    for (const emp of employees) {
      await db.employee.upsert({ where: { id: emp.id }, update: emp as any, create: emp as any });
    }

    // 3. Fornecedores (Cadeia de Suprimentos)
    const suppliers = [
      { id: 'seed-sup-1', name: "NutriAgro S.A. (Rações)", category: "Nutrição", contact: "Ricardo", phone: "(11) 98888-7777", producerId, address: "Av. Industrial, 442 - Descalvado/SP" },
      { id: 'seed-sup-2', name: "VetHealth (Vacinas)", category: "Saúde Animal", contact: "Dra. Ana", phone: "(19) 97777-6666", producerId },
      { id: 'seed-sup-3', name: "Grandes Equipamentos Agro", category: "Manutenção", contact: "Carlos", phone: "(14) 96666-5555", producerId },
      { id: 'seed-sup-4', name: "Genética Elite (Linhagens)", category: "Aves", contact: "Fernanda", phone: "(11) 95555-4444", producerId },
    ];

    for (const sup of suppliers) {
      await db.supplier.upsert({ where: { id: sup.id }, update: sup as any, create: sup as any });
    }

    // 4. Clientes (Escoamento de Produção)
    const customers = [
      { id: 'seed-cus-1', name: "Rede Pão de Açúcar", taxId: "12.345.678/0001-01", phone: "(11) 3333-4444", producerId, address: "São Paulo/SP" },
      { id: 'seed-cus-2', name: "Distribuidora Ovos de Ouro", taxId: "98.765.432/0001-99", phone: "(11) 5555-6666", producerId },
      { id: 'seed-cus-3', name: "Exportação Matriz Portuária", taxId: "11.222.333/0001-44", phone: "(13) 2222-1111", producerId },
    ];

    for (const cus of customers) {
      await db.customer.upsert({ where: { id: cus.id }, update: cus as any, create: cus as any });
    }

    // 5. Estoque (Nutrição e Sanitário)
    const catNutrition = await db.inventoryCategory.upsert({ where: { id: 'seed-cat-1' }, update: { producerId }, create: { id: 'seed-cat-1', name: "Nutrição (Insumos)", producerId } });
    const catHealth = await db.inventoryCategory.upsert({ where: { id: 'seed-cat-2' }, update: { producerId }, create: { id: 'seed-cat-2', name: "Medicamentos e Vacinas", producerId } });
    const catPacking = await db.inventoryCategory.upsert({ where: { id: 'seed-cat-3' }, update: { producerId }, create: { id: 'seed-cat-3', name: "Embalagens e Expedição", producerId } });

    const items = [
      { id: 'seed-item-1', name: "Ração Postura Premium (Fase 1)", categoryId: catNutrition.id, unit: "KG", currentStock: 45000, minStock: 10000, producerId, averageCost: 2.45 },
      { id: 'seed-item-2', name: "Vacina Coriza G2", categoryId: catHealth.id, unit: "DOSE", currentStock: 120000, minStock: 25000, producerId, averageCost: 0.18 },
      { id: 'seed-item-3', name: "Estojo de Ovos (30 un)", categoryId: catPacking.id, unit: "UNIT", currentStock: 15000, minStock: 2000, producerId, averageCost: 0.85 },
      { id: 'seed-item-4', name: "Desinfetante TH4", categoryId: catHealth.id, unit: "L", currentStock: 850, minStock: 100, producerId, averageCost: 45.00 },
    ];

    for (const item of items) {
      await db.inventoryItem.upsert({ where: { id: item.id }, update: item as any, create: item as any });
    }

    // 6. Galpões e Lotes
    const house = await db.house.upsert({
      where: { id: 'seed-house-1' },
      update: { name: "Galpão Matriz 01 (Dark House)", capacity: 45000, housingSystem: 'DARK_HOUSE', hasClimate: true, producerId },
      create: { id: 'seed-house-1', name: "Galpão Matriz 01 (Dark House)", capacity: 45000, housingSystem: 'DARK_HOUSE', hasClimate: true, producerId }
    });

    const flock = await db.flock.upsert({
      where: { id: 'seed-flock-1' },
      update: { currentQuantity: 44850, producerId },
      create: { 
        id: 'seed-flock-1', 
        name: "Lote E-01 (Lohmann Elite)", 
        breed: "Lohmann Brown-SL", 
        initialQuantity: 45000, 
        currentQuantity: 44850, 
        acquisitionDate: subDays(new Date(), 60),
        producerId
      }
    });

    // 7. Tarefas (Centro de Operações)
    const tasks = [
      { id: 'seed-task-1', title: "Monitoramento de Amônia e CO2", description: "Verificar exaustores e ventilação mínima no Galpão 01", priority: "CRITICAL", status: "PENDING", dueDate: addDays(new Date(), 0.5), houseId: house.id, flockId: flock.id, producerId },
      { id: 'seed-task-2', title: "Coleta Automatizada Ciclo Matutino", description: "Monitorar esteiras e classificação automática", priority: "MEDIUM", status: "COMPLETED", dueDate: subDays(new Date(), 0.2), completedAt: subDays(new Date(), 0.1), houseId: house.id, producerId },
      { id: 'seed-task-3', title: "Vacinação Coriza (Lote E-01)", description: "Aplicação via aspersão fina", priority: "CRITICAL", status: "IN_PROGRESS", dueDate: new Date(), flockId: flock.id, producerId },
      { id: 'seed-task-4', title: "Conferência de Silos (Insumos)", description: "Conferência física vs digital de ração", priority: "HIGH", status: "PENDING", dueDate: addDays(new Date(), 1), producerId },
      { id: 'seed-task-5', title: "Vazio Sanitário Galpão 04", description: "Início do protocolo de desinfecção 1", priority: "HIGH", status: "PAUSED", dueDate: new Date(), producerId },
      { id: 'seed-task-6', title: "Ajuste de Curva de Luz", description: "Ajustar fotoperíodo conforme linhagem Lohmann", priority: "MEDIUM", status: "PENDING", dueDate: addDays(new Date(), 2), houseId: house.id, producerId },
    ];

    for (const task of tasks) {
      await (db.task as any).upsert({ where: { id: task.id }, update: task, create: task });
    }

    return NextResponse.json({ success: true, message: "MEGA SEED Operacional concluído com sucesso!" });
  } catch (error: any) {
    console.error("❌ Erro no Mega Seeder:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
