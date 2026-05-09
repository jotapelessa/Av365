import { getTenantDb } from "@/lib/tenant";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import FinanceDashboardClient from "@/components/finance/FinanceDashboardClient";

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const period = (await searchParams).period || '30days';
  const dbClient = await getTenantDb();

  let startDate = new Date();
  if (period === '30days') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === 'month') {
    startDate.setDate(1);
    startDate.setHours(0,0,0,0);
  } else if (period === 'year') {
    startDate.setMonth(0, 1);
    startDate.setHours(0,0,0,0);
  }

  const [sales, expenses, installments, accounts, flocks] = await Promise.all([
    dbClient.sale.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: "desc" },
      include: { customer: true }
    }),
    dbClient.expense.findMany({
      where: { date: { gte: startDate } },
      orderBy: { date: "desc" },
      include: { flock: true, supplier: true, employee: true }
    }),
    dbClient.installment.findMany({
      where: { 
        status: 'PENDING',
        dueDate: { lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { dueDate: 'asc' }
    }),
    dbClient.financialAccount.findMany(),
    dbClient.flock.findMany({
      where: { status: 'ACTIVE' },
      include: { houses: true }
    })
  ]);

  // 1. Cálculos de Totais e Stats
  const totalSales = sales.reduce((acc: number, s: any) => acc + Number(s.amount), 0);
  const totalExpenses = expenses.reduce((acc: number, e: any) => acc + Number(e.amount), 0);
  const currentBalance = accounts.reduce((acc: number, a: any) => acc + Number(a.balance), 0);

  // Patrimônio Biológico (Valor estimado das aves)
  const biologicalAssetsValue = flocks.reduce((acc: number, f: any) => {
    const unitValue = Number(f.unitPrice) || 15;
    return acc + (f.currentQuantity * unitValue);
  }, 0);

  // Projeção de Recebíveis e Pagamentos (Próximos 30 dias)
  const incomingForecast = installments
    .filter(i => !!i.saleId)
    .reduce((acc: number, i: any) => acc + Number(i.amount), 0);
    
  const outgoingForecast = installments
    .filter(i => !!i.expenseId)
    .reduce((acc: number, i: any) => acc + Number(i.amount), 0);

  const projectedBalance = currentBalance + incomingForecast - outgoingForecast;
  const totalEquity = currentBalance + incomingForecast + biologicalAssetsValue; // Patrimônio Total (Liquidez + Recebíveis + Lotes)

  // 2. SERIALIZAÇÃO ROBUSTA PARA RSC (Resolve Decimal, Date e Classes do Prisma)
  const sanitizedSales = JSON.parse(JSON.stringify(sales));
  const sanitizedExpenses = JSON.parse(JSON.stringify(expenses));
  const sanitizedInstallments = JSON.parse(JSON.stringify(installments));
  const sanitizedAccounts = JSON.parse(JSON.stringify(accounts));
  const sanitizedFlocks = JSON.parse(JSON.stringify(flocks));

  // Chart Data
  const last15Days = Array.from({ length: 15 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (14 - i));
    return d.toISOString().split('T')[0];
  });

  const next15Days = Array.from({ length: 15 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });


  const realizedMap = new Map();
  sanitizedSales.forEach((s: any) => {
    const day = s.date.split('T')[0];
    realizedMap.set(day, (realizedMap.get(day) || 0) + Number(s.amount));
  });
  sanitizedExpenses.forEach((e: any) => {
    const day = e.date.split('T')[0];
    realizedMap.set(day, (realizedMap.get(day) || 0) - Number(e.amount));
  });

  const projectedMap = new Map();
  sanitizedInstallments.forEach((inst: any) => {
    const day = inst.dueDate.split('T')[0];
    const amount = inst.saleId ? Number(inst.amount) : -Number(inst.amount);
    projectedMap.set(day, (projectedMap.get(day) || 0) + amount);
  });

  const displayDays = [...last15Days, ...next15Days.slice(1)];
  const chartData = displayDays.map(day => ({
    date: format(new Date(day), 'dd/MM', { locale: ptBR }),
    realized: Math.max(0, realizedMap.get(day) || 0),
    projected: Math.max(0, (realizedMap.get(day) || 0) + (projectedMap.get(day) || 0)),
  }));

  return (
    <FinanceDashboardClient 
      sales={sanitizedSales}
      expenses={sanitizedExpenses}
      installments={sanitizedInstallments}
      accounts={sanitizedAccounts}
      flocks={sanitizedFlocks}
      stats={{
        totalSales,
        totalExpenses,
        currentBalance,
        projectedBalance,
        totalEquity,
        biologicalAssetsValue
      }}
      chartData={chartData}
      period={period}
    />
  );
}
