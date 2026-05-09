import { db } from "@/lib/prisma";
import { ShieldAlert, Activity, ShieldCheck, Clock, Terminal, Fingerprint, Eye, Search } from "lucide-react";

export default async function AdminSecurityPage() {
  const logs = await db.adminActionLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <ShieldAlert size={12} /> Vigilância & Auditoria
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">Logs de Segurança</h1>
          <p className="text-slate-500 text-sm font-medium">Rastreabilidade total de ações administrativas e alterações críticas.</p>
        </div>

        <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-[18px] shadow-sm">
          <div className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
            <Fingerprint size={12} /> Monitoramento Ativo
          </div>
        </div>
      </header>

      {/* Modern Log Timeline Luxury */}
      <section className="p-8 rounded-[18px] bg-white border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Activity size={18} />
            </div>
            Fluxo de Atividades Síncronas
          </h2>
          <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Últimos 100 registros
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-400">
                <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] italic">Data / Hora</th>
                <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] italic">Operador Admin</th>
                <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] italic">Ação Executada</th>
                <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] italic">Origem IP</th>
                <th className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] italic text-right">Auditar</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="group/row hover:translate-x-1 transition-all duration-300">
                  <td className="px-6 py-4 bg-slate-50/50 border-y border-l border-slate-100 rounded-l-2xl group-hover/row:bg-indigo-50/30 group-hover/row:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                      <Clock size={12} className="text-rose-400" />
                      <span className="text-[11px] tracking-tight tabular-nums">{new Date(log.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover/row:bg-indigo-50/30 group-hover/row:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {log.adminId.slice(0, 1).toUpperCase()}
                      </div>
                      <p className="text-[11px] font-black text-slate-700 tracking-widest uppercase">{log.adminId.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover/row:bg-indigo-50/30 group-hover/row:border-indigo-100 transition-colors">
                    <span className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 group-hover/row:bg-indigo-50/30 group-hover/row:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <Terminal size={12} className="text-slate-300" />
                      <span className="text-[11px] font-mono tracking-tighter">{log.ipAddress || "0.0.0.0"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 bg-slate-50/50 border-y border-r border-slate-100 rounded-r-2xl group-hover/row:bg-indigo-50/30 group-hover/row:border-indigo-100 transition-colors text-right">
                    <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all active:scale-90">
                      <Search size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <div className="p-4 rounded-full bg-white border border-slate-200 shadow-sm">
                        <ShieldAlert size={32} className="text-slate-300" />
                      </div>
                      <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Silêncio Operacional: Sem Logs</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
