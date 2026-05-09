'use client';

import { useState, useEffect } from "react";
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Filter,
  Trash2,
  Layout,
  MessageSquare,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUIFeedbacks, updateUIFeedbackStatus } from "@/app/admin/actions-audit";
import { toast } from "sonner";

export default function AdminAuditPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getUIFeedbacks();
      setReports(data);
    } catch (err) {
      toast.error("Erro ao carregar auditoria.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await updateUIFeedbackStatus(id, newStatus);
      toast.success(`Reporte marcado como ${newStatus}`);
      loadReports();
    } catch (err) {
      toast.error("Erro ao atualizar status.");
    }
  }

  const filteredReports = reports.filter(r => 
    filter === "ALL" ? true : r.status === filter
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-[18px] flex items-center justify-center shadow-2xl rotate-3 border border-white/10">
              <Monitor className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Auditoria de Interface</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Log de Feedback & Regressões UI</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
          {['ALL', 'OPEN', 'FIXED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'OPEN' ? 'Abertos' : 'Corrigidos'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 animate-pulse">
           {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[32px]" />)}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative group bg-white border rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 ${
                  report.status === 'OPEN' ? 'border-slate-100' : 'border-emerald-100 opacity-80'
                }`}
              >
                {/* STATUS BAR */}
                <div className={`h-1.5 w-full ${
                  report.status === 'OPEN' ? 'bg-indigo-600' : 'bg-emerald-500'
                }`} />

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200/50">
                          {report.viewport}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          report.status === 'OPEN' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                         {report.issueType.split(', ').map((type: string) => (
                           <span key={type} className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-tighter">
                             {type}
                           </span>
                         ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <a href={report.pageUrl} target="_blank" className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 border border-slate-200 transition-all">
                          <ExternalLink size={14} />
                       </a>
                       {report.status === 'OPEN' ? (
                         <button 
                           onClick={() => handleStatusChange(report.id, 'FIXED')}
                           className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                         >
                           <CheckCircle2 size={14} />
                         </button>
                       ) : (
                         <button 
                           onClick={() => handleStatusChange(report.id, 'OPEN')}
                           className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-600 hover:text-white transition-all"
                         >
                           <AlertCircle size={14} />
                         </button>
                       )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                       <Layout size={16} className="text-slate-400 mt-1 shrink-0" />
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Elemento Auditado</p>
                          <code className="text-[11px] font-bold text-indigo-600 break-all">{report.elementId || 'Global Page'}</code>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                       <MessageSquare size={16} className="text-slate-400 mt-1 shrink-0" />
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Observações</p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                            "{report.description || 'Sem descrição detalhada.'}"
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                           <Clock size={12} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(report.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                     <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        ID: {report.id}
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-slate-400" />
           </div>
           <h2 className="text-xl font-black italic text-slate-600 tracking-tight">Céu de Brigadeiro!</h2>
           <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-widest">Nenhum feedback pendente na auditoria.</p>
        </div>
      )}
    </div>
  );
}
