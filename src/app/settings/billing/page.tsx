import { db, getProducerId } from "@/lib/tenant";
import BillingHubClient from "@/app/settings/billing/BillingHubClient";
import { CreditCard } from "lucide-react";

export default async function BillingSettingsPage() {
  const producerId = await getProducerId();

  if (!producerId) {
    return (
      <div className="p-12 text-center bg-white rounded-[18px] border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-2">Acesso Negado</h2>
        <p className="text-slate-500">Você precisa estar vinculado a uma granja para acessar faturamento.</p>
      </div>
    );
  }

  const subscription = await db.subscription.findUnique({
    where: { producerId },
    include: {
      plan: true
    }
  });

  const invoices = await db.invoice.findMany({
    where: { producerId },
    orderBy: { billingDate: 'desc' },
    take: 10
  });

  const flockCount = await db.flock.count({ where: { producerId } });
  const houseCount = await db.house.count({ where: { producerId } });

  const usage = {
    flocks: flockCount,
    houses: houseCount,
    maxFlocks: subscription?.plan?.maxFlocks || 1,
    maxHouses: subscription?.plan?.maxHouses || 1,
  };

  return <BillingHubClient subscription={subscription} invoices={invoices} usage={usage} />;
}

