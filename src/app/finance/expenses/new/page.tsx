import { getTenantDb } from "@/lib/tenant";
import ExpenseFormClient from "@/components/finance/ExpenseFormClient";

export default async function NewExpensePage() {
  const dbClient = await getTenantDb();

  const [flocks, suppliers, employees, accounts] = await Promise.all([
    dbClient.flock.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true }
    }),
    dbClient.supplier.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    dbClient.employee.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    dbClient.financialAccount.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <ExpenseFormClient 
      flocks={flocks}
      suppliers={suppliers}
      employees={employees}
      accounts={accounts}
    />
  );
}
