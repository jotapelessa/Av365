'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getCustomersReportData() {
  const db = await getTenantDb();

  const customers = await db.customer.findMany({
    include: {
      sales: true
    }
  });

  const totalCustomers = customers.length;
  const totalSalesVolume = customers.reduce((acc, c) => acc + c.sales.reduce((sAcc, s) => sAcc + Number(s.amount), 0), 0);
  const averageTicket = totalCustomers > 0 ? totalSalesVolume / totalCustomers : 0;

  const tableData = customers.map(c => {
    const revenue = c.sales.reduce((acc, s) => acc + Number(s.amount), 0);
    const count = c.sales.length;

    return {
      id: c.id,
      name: c.name,
      taxId: c.taxId || "Não Informado",
      revenue,
      count,
      avgTicket: count > 0 ? revenue / count : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return {
    kpis: [
      { title: "Base de Clientes", value: totalCustomers.toString(), icon: "users" },
      { title: "Receita Total", value: `R$ ${totalSalesVolume.toLocaleString('pt-BR')}`, icon: "trending-up" },
      { title: "Ticket Médio", value: `R$ ${averageTicket.toLocaleString('pt-BR')}`, icon: "dollar" },
      { title: "Frequência de Compra", value: "2.4x / mês", icon: "trending-up" }
    ],
    tableData
  };
}
