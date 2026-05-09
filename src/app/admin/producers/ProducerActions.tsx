'use client';

import { useState } from "react";
import { 
  PauseCircle, 
  PlayCircle, 
  XCircle, 
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { pauseSubscription, resumeSubscription, cancelSubscription } from "./actions";
import { useRouter } from "next/navigation";

interface ProducerActionsProps {
  producerId: string;
  status: string;
}

export function ProducerActions({ producerId, status }: ProducerActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (action: string) => {
    setLoading(action);
    try {
      if (action === 'pause') await pauseSubscription(producerId);
      if (action === 'resume') await resumeSubscription(producerId);
      if (action === 'cancel') {
        if (confirm('⚠️ TEM CERTEZA? O cancelamento bloqueará o acesso do cliente imediatamente.')) {
          await cancelSubscription(producerId);
        } else {
          setLoading(null);
          return;
        }
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Erro ao processar ação administrativa.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {status === 'ACTIVE' && (
        <button
          onClick={() => handleAction('pause')}
          disabled={loading !== null}
          className="group flex items-center gap-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/20 rounded-[6px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          {loading === 'pause' ? <Loader2 size={16} className="animate-spin" /> : <PauseCircle size={16} className="group-hover:rotate-12 transition-transform" />}
          Pausar Assinatura
        </button>
      )}

      {(status === 'PAUSED' || status === 'TRIAL') && (
        <button
          onClick={() => handleAction('resume')}
          disabled={loading !== null}
          className="group flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 rounded-[6px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          {loading === 'resume' ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} className="group-hover:scale-110 transition-transform" />}
          Reativar Acesso
        </button>
      )}

      {status !== 'CANCELED' && (
        <button
          onClick={() => handleAction('cancel')}
          disabled={loading !== null}
          className="group flex items-center gap-2 px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-[6px] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
        >
          {loading === 'cancel' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} className="group-hover:rotate-45 transition-transform" />}
          Cancelar Conta
        </button>
      )}

      {status === 'CANCELED' && (
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-[6px] font-black text-[10px] text-slate-500 uppercase tracking-widest cursor-not-allowed">
          <AlertTriangle size={16} /> Conta Cancelada
        </div>
      )}
    </div>
  );
}
