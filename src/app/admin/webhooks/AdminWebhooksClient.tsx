'use client';

import { 
  Database, 
  Activity, 
  Zap, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminWebhooksClientProps {
  initialLogs: any[];
  stats: {
    successRate: string;
    count24h: number;
    avgLatency: string;
  };
}

export default function AdminWebhooksClient({ initialLogs, stats }: AdminWebhooksClientProps) {
  const [copied, setCopied] = useState(false);
  const webhookUrl = "https://api.av365.com.br/api/webhooks/stripe";

  const statCards = [
    { label: "Taxa de Sucesso", value: stats.successRate, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Eventos (24h)", value: stats.count24h.toString(), icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Latência Média", value: stats.avgLatency, icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const columns = [
    { 
      key: "eventType", 
      header: "Evento",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${item.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <Zap size={14} />
          </div>
          <span className="font-black italic text-slate-900">{item.eventType}</span>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Status",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === 'SUCCESS' ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <XCircle size={14} className="text-rose-500" />
          )}
          <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {item.status}
          </span>
        </div>
      )
    },
    { 
      key: "createdAt", 
      header: "Data / Hora",
      render: (item: any) => (
        <span className="text-xs text-slate-500 font-medium italic">
          {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </span>
      )
    },
    { 
      key: "latency", 
      header: "Latência",
      render: (item: any) => (
        <span className="font-mono text-xs text-slate-400">{item.latency ? `${item.latency}ms` : '---'}</span>
      )
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER E ENDPOINT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 rounded-[22px] bg-slate-900 text-white shadow-xl">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">Sincronização Master</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Webhooks de Alta Performance • Stripe Engine</p>
            </div>
          </div>

          <div className="p-8 rounded-[24px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stripe Webhook Endpoint</span>
              </div>
              <div className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Live & SSL Secure
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 group">
              <code className="text-xs font-mono text-slate-600 flex-1 truncate">{webhookUrl}</code>
              <button 
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-white transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200"
              >
                {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Configure esta URL no Dashboard do Stripe com os eventos sugeridos na <span className="text-indigo-600 font-black cursor-pointer hover:underline">documentação</span>.
            </p>
          </div>
        </div>

        {/* ESTATÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 gap-4">
          {statCards.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 5 }}
              className="p-6 rounded-[22px] bg-white border border-slate-200 flex items-center justify-between group shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 italic tracking-tight">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEED DE EVENTOS RECENTES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Activity size={20} className="text-slate-400" />
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Eventos em Tempo Real</h2>
          </div>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:translate-x-1 transition-transform flex items-center gap-2 italic">
            Ver Logs Completos <ArrowRight size={14} />
          </button>
        </div>

        <LuxuryTable 
          columns={columns}
          data={initialLogs}
        />
      </section>

      {/* AVISO DE SEGURANÇA */}
      <div className="p-8 rounded-[24px] bg-indigo-50/50 border border-indigo-100 flex items-center gap-6">
        <div className="p-4 rounded-full bg-white text-indigo-600 shadow-sm shrink-0 border border-indigo-100">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4 className="text-sm font-black text-indigo-900 italic mb-1">Verificação de Assinatura Master Ativa</h4>
          <p className="text-xs text-indigo-700/70 font-medium leading-relaxed max-w-2xl">
            Todos os payloads recebidos são validados via hash <span className="font-black text-indigo-900">SHA512</span> utilizando a secret do Stripe. 
            Tentativas de injeção ou payloads sem assinatura válida são descartados automaticamente pelo gateway de segurança.
          </p>
        </div>
      </div>

    </div>
  );
}
