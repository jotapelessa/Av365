'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getDreData() {
  const db = await getTenantDb();

  // Buscar vendas (Receita Bruta)
  const sales = await db.sale.findMany();
  const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.amount), 0);

  // Buscar despesas (Custos)
  const expenses = await db.expense.findMany();
  const totalExpenses = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  // Lucro Bruto
  const grossProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Gerar dados mensais para a tabela
  // Por simplicidade, vamos agrupar por mês/ano do createdAt
  const monthlyData: Record<string, { revenue: number, expenses: number }> = {};

  sales.forEach(s => {
    const month = new Date(s.createdAt).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 };
    monthlyData[month].revenue += Number(s.amount);
  });

  expenses.forEach(e => {
    const month = new Date(e.createdAt).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 };
    monthlyData[month].expenses += Number(e.amount);
  });

  const tableData = Object.entries(monthlyData).map(([month, values]) => ({
    period: month,
    revenue: values.revenue,
    expenses: values.expenses,
    profit: values.revenue - values.expenses,
    margin: values.revenue > 0 ? ((values.revenue - values.expenses) / values.revenue) * 100 : 0
  })).sort((a, b) => {
    const [ma, ya] = a.period.split('/');
    const [mb, yb] = b.period.split('/');
    return new Date(Number(ya), Number(ma) - 1).getTime() - new Date(Number(yb), Number(mb) - 1).getTime();
  });

  return {
    kpis: [
      { title: "Receita Total", value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, icon: "trending-up" },
      { title: "Custos Totais", value: `R$ ${totalExpenses.toLocaleString('pt-BR')}`, icon: "trending-down" },
      { title: "Resultado Líquido", value: `R$ ${grossProfit.toLocaleString('pt-BR')}`, icon: "dollar" },
      { title: "Margem Final", value: `${profitMargin.toFixed(1)}%`, icon: "trending-up" }
    ],
    tableData
  };
}
