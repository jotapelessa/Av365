import { db } from "@/lib/prisma";
import { Users, Building2 } from "lucide-react";
import AdminProducersListClient from "./AdminProducersListClient";

export default async function AdminProducersPage() {
  const producers = await db.producer.findMany({
    include: {
      subscription: {
        include: {
          plan: true
        }
      },
      users: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const sanitizedProducers = JSON.parse(JSON.stringify(producers));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Building2 size={12} /> Governança de Clientes
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 italic">Clientes (Tenants)</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão centralizada de produtores e contratos.</p>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Ativa</p>
            <p className="text-xl font-black text-slate-900 leading-none tabular-nums">{sanitizedProducers.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Users size={18} />
          </div>
        </div>
      </header>

      <AdminProducersListClient producers={sanitizedProducers} />
    </div>
  );
}
