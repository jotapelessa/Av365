'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getEquityData() {
  const db = await getTenantDb();

  // 1. Saldo em Contas (Ativo Circulante)
  const accounts = await db.financialAccount.findMany();
  const totalCash = accounts.reduce((acc, accnt) => acc + Number(accnt.balance), 0);

  // 2. Valor em Estoque (Ativo Imobilizado/Circulante)
  const inventory = await db.inventoryItem.findMany();
  const totalInventoryValue = inventory.reduce((acc, item) => acc + (Number(item.currentStock) * Number(item.averageCost)), 0);

  // 3. Valor dos Lotes (Ativo Biológico)
  const flocks = await db.flock.findMany({ where: { status: 'ACTIVE' } });
  const totalFlockValue = flocks.reduce((acc, f) => acc + (Number(f.currentQuantity) * (Number(f.unitPrice) || 0)), 0);

  const totalAssets = totalCash + totalInventoryValue + totalFlockValue;

  const tableData = [
    { category: "Disponibilidades", description: "Saldo em contas bancárias e caixa", value: totalCash, type: "Ativo Circulante" },
    { category: "Estoque", description: "Insumos, ração e materiais", value: totalInventoryValue, type: "Ativo Circulante" },
    { category: "Ativos Biológicos", description: "Valor de mercado dos lotes ativos", value: totalFlockValue, type: "Ativo Permanente" }
  ];

  return {
    kpis: [
      { title: "Patrimônio Total", value: `R$ ${totalAssets.toLocaleString('pt-BR')}`, icon: "trending-up" },
      { title: "Liquidez Imediata", value: `R$ ${totalCash.toLocaleString('pt-BR')}`, icon: "dollar" },
      { title: "Capital em Estoque", value: `R$ ${totalInventoryValue.toLocaleString('pt-BR')}`, icon: "package" },
      { title: "Valor Biológico", value: `R$ ${totalFlockValue.toLocaleString('pt-BR')}`, icon: "trending-up" }
    ],
    tableData
  };
}
