'use client';

import { useState, useTransition } from "react";
import { 
  Database, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Download,
  AlertTriangle,
  XCircle,
  Zap,
  UploadCloud
} from "lucide-react";
import { backupProducerData, resetProducerData, updateProducerStatus, restoreProducerBackup } from "@/app/admin/producers/[id]/actions";
import { toast } from "sonner";
import { useRef } from "react";

interface ProducerControlPanelProps {
  producerId: string;
  currentStatus: string;
}

export function ProducerControlPanel({ producerId, currentStatus }: ProducerControlPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [resetStage, setResetStage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    startTransition(async () => {
      const result = await backupProducerData(producerId);
      if (result.success && result.data) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", result.filename || "backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("Backup gerado e baixado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao gerar backup.");
      }
    });
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        startTransition(async () => {
          const result = await restoreProducerBackup(producerId, json);
          if (result.success) {
            toast.success("Dados restaurados com sucesso a partir do snapshot.");
          } else {
            toast.error(result.error);
          }
        });
      } catch {
        toast.error("O arquivo selecionado não é um JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = (mode: 'OPERATIONAL' | 'TOTAL') => {
    if (resetStage === 0) {
      setResetStage(1);
      setTimeout(() => setResetStage(0), 5000);
      return;
    }

    startTransition(async () => {
      const result = await resetProducerData(producerId, mode);
      if (result.success) {
        toast.success(`Reset ${mode === 'TOTAL' ? 'total' : 'operacional'} concluído.`);
        setResetStage(0);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleStatusUpdate = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateProducerStatus(producerId, newStatus);
      if (result.success) {
        toast.success(`Status alterado para ${newStatus}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* CARD DE CONTROLES CRÍTICOS */}
      <section className="bento-card-elite p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-30" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10 pb-6 border-b border-slate-50">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Centro de Governança</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Ações de integridade e controle de acesso</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* BACKUP & RESTORE */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group/card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100"><Database size={16} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 italic">Snapshot de Dados</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mb-6 leading-relaxed">Gere um dump completo ou restaure o estado a partir de um arquivo externo.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleBackup}
                disabled={isPending}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 italic"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                <span>Exportar Backup</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleRestore} 
                accept=".json" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                className="w-full py-4 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 italic"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                <span>Importar / Restaurar</span>
              </button>
            </div>
          </div>

          {/* RESET */}
          <div className="p-6 rounded-2xl bg-rose-50/30 border border-rose-100 hover:border-rose-200 hover:bg-white transition-all group/card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100"><RotateCcw size={16} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-rose-700 italic">Reset Operacional</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mb-6 leading-relaxed">Limpeza total ou parcial dos dados do produtor. Ação irreversível.</p>
            <button 
              onClick={() => handleReset('OPERATIONAL')}
              disabled={isPending}
              className={`w-full py-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 italic shadow-lg ${
                resetStage === 1 
                  ? 'bg-rose-600 text-white shadow-rose-200 scale-105 ring-4 ring-rose-100' 
                  : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              <span>{resetStage === 1 ? 'CLIQUE PARA CONFIRMAR' : 'Zerar Dados Operacionais'}</span>
            </button>
          </div>
        </div>

        {/* GESTÃO DE STATUS RÁPIDA */}
        <div className="mt-8 pt-8 border-t border-slate-50 relative z-10">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
             <Zap size={12} className="text-amber-500" /> Alteração de Estado Vital
           </h3>
           <div className="flex flex-wrap gap-3">
             {[
               { label: 'Ativar', value: 'ACTIVE', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white', icon: CheckCircle2 },
               { label: 'Suspender', value: 'PAUSED', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white', icon: AlertTriangle },
               { label: 'Bloquear', value: 'CANCELED', color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white', icon: XCircle }
             ].map((btn) => (
               <button
                 key={btn.value}
                 onClick={() => handleStatusUpdate(btn.value)}
                 disabled={isPending || currentStatus === btn.value}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 italic disabled:opacity-30 disabled:grayscale ${btn.color}`}
               >
                 <btn.icon size={14} />
                 {btn.label}
               </button>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}
