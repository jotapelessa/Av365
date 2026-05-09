'use client';

import { History, User, Clock, ShieldCheck, ArrowRight, Database } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
  dataBefore: unknown;
  dataAfter: unknown;
}

export function ProducerAuditTimeline({ logs }: { logs: AuditLog[] }) {
  const getActionLabel = (action: string) => {
    if (action.startsWith('STATUS_CHANGE_')) return 'Alteração de Status';
    if (action === 'BACKUP_GENERATED') return 'Backup de Dados';
    if (action.startsWith('DATA_RESET_')) return 'Reset de Dados';
    return action;
  };

  const getActionColor = (action: string) => {
    if (action.includes('ACTIVE')) return 'text-emerald-500 bg-emerald-50';
    if (action.includes('RESET')) return 'text-rose-500 bg-rose-50';
    if (action.includes('BACKUP')) return 'text-indigo-500 bg-indigo-50';
    return 'text-slate-500 bg-slate-50';
  };

  return (
    <div className="bento-card-elite p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <History size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Rastro de Auditoria</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Histórico detalhado de governança</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-8 last:pb-0">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${log.action.includes('RESET') ? 'bg-rose-500' : 'bg-indigo-500'}`} />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={10} /> {format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800 italic">{log.action}</p>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{log.user?.name || log.user?.email || 'Sistema'}</span>
                </div>
              </div>

              {/* Detalhes da Mudança se houver */}
              {!!(log.dataBefore || log.dataAfter) && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4 text-[10px]">
                  {((log.dataBefore as { status?: string })?.status) && (
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-400 uppercase">De:</span>
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-black text-slate-600">{(log.dataBefore as { status: string }).status}</span>
                      <ArrowRight size={12} className="text-slate-300" />
                      <span className="font-black text-slate-400 uppercase">Para:</span>
                      <span className="px-2 py-1 bg-white border border-indigo-200 rounded-lg font-black text-indigo-600">{(log.dataAfter as { status: string })?.status}</span>
                    </div>
                  )}
                  {log.action.includes('BACKUP') && (
                    <div className="flex items-center gap-2 text-indigo-600 font-black uppercase">
                      <Database size={12} /> Snapshot de Segurança Gerado
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-40">
            <ShieldCheck size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Nenhum registro de auditoria encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
