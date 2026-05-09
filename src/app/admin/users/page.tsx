import { db } from "@/lib/prisma";
import { UserCheck, Search } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import AdminUsersListClient from "./AdminUsersListClient";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      producer: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const sanitizedUsers = JSON.parse(JSON.stringify(users));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <UserCheck size={12} /> Governança de Acesso
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 italic">Usuários SaaS</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão centralizada de operadores e produtores.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar usuário..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[18px] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all w-[260px] font-medium shadow-sm"
            />
          </div>
          <LuxuryButton 
            variant="primary"
            icon="user-plus"
          >
            Novo Operador
          </LuxuryButton>
        </div>
      </header>

      <AdminUsersListClient users={sanitizedUsers} />
    </div>
  );
}
