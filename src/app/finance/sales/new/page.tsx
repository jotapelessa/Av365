import { getTenantDb, getProducerId } from "@/lib/tenant";
import SaleFormClient from "@/components/finance/SaleFormClient";

export default async function NewSalePage() {
  const dbClient = await getTenantDb();
  const pid = await getProducerId();

  const [customers, accounts] = await Promise.all([
    dbClient.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    dbClient.financialAccount.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ]);

  console.log(`[Elite Finance] Nova Venda - Produtor: ${pid} | Clientes: ${customers.length} | Contas: ${accounts.length}`);

  return (
    <SaleFormClient 
      customers={JSON.parse(JSON.stringify(customers))}
      accounts={JSON.parse(JSON.stringify(accounts))}
    />
  );
}
