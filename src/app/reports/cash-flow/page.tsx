import { getTenantDb } from "@/lib/tenant";
import CashFlowClient from "./CashFlowClient";

export default async function CashFlowReportPage() {
  const db = await getTenantDb();
  
  // Pegamos dados reais (exemplo simplificado)
  const sales = await db.sale.findMany({
    take: 20,
    orderBy: { date: 'desc' },
    include: { customer: true }
  });

  const expenses = await db.expense.findMany({
    take: 20,
    orderBy: { date: 'desc' }
  });

  const totalIn = sales.reduce((acc, s) => acc + Number(s.amount), 0);
  const totalOut = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const netFlow = totalIn - totalOut;

  // Serialização robusta
  const sanitizedSales = JSON.parse(JSON.stringify(sales));
  const sanitizedExpenses = JSON.parse(JSON.stringify(expenses));

  return (
    <CashFlowClient 
      sales={sanitizedSales}
      expenses={sanitizedExpenses}
      totalIn={totalIn}
      totalOut={totalOut}
      netFlow={netFlow}
    />
  );
}
