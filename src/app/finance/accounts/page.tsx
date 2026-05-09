import { getTenantDb } from "@/lib/tenant";
import AccountsDashboardClient from "@/components/finance/AccountsDashboardClient";

export default async function AccountsPage() {
  const dbClient = await getTenantDb();
  
  const [accounts, transfers] = await Promise.all([
    dbClient.financialAccount.findMany({
      orderBy: { name: 'asc' }
    }),
    dbClient.internalTransfer.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: {
        fromAccount: true,
        toAccount: true
      }
    })
  ]);

  // SERIALIZAÇÃO PARA RSC (Decimal -> Number)
  const sanitizedAccounts = accounts.map((a: any) => ({
    ...a,
    balance: Number(a.balance),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  const sanitizedTransfers = transfers.map((t: any) => ({
    ...t,
    amount: Number(t.amount),
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
    fromAccount: t.fromAccount ? { ...t.fromAccount, balance: Number(t.fromAccount.balance) } : null,
    toAccount: t.toAccount ? { ...t.toAccount, balance: Number(t.toAccount.balance) } : null,
  }));

  const totalBalance = sanitizedAccounts.reduce((acc: number, curr: any) => acc + curr.balance, 0);

  return (
    <AccountsDashboardClient 
      accounts={sanitizedAccounts}
      transfers={sanitizedTransfers}
      totalBalance={totalBalance}
    />
  );
}
