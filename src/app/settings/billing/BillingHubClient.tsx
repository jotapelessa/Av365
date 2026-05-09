'use client';

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Download, ExternalLink, Calendar, Package, TrendingUp, Info } from "lucide-react";
import { motion } from "framer-motion";
import { createPortalSession } from "./actions";

interface BillingHubClientProps {
  subscription: any;
  invoices: any[];
  usage: {
    flocks: number;
    houses: number;
    maxFlocks: number;
    maxHouses: number;
  };
}

export default function BillingHubClient({ subscription, invoices, usage }: BillingHubClientProps) {
  const [isPending, setIsPending] = useState(false);
  const plan = subscription?.plan || { name: "Gratuito", priceMonthly: 0 };

  const handleManageSubscription = async () => {
    setIsPending(true);
    try {
      await createPortalSession();
    } catch (error: any) {
      toast.error(error.message || "Erro ao abrir portal de pagamentos");
    } finally {
      setIsPending(false);
    }
  };

  
  const usageStats = [
    { label: "Lotes Ativos", current: usage.flocks, max: usage.maxFlocks, unit: "Lotes" },
    { label: "Galpões Cadastrados", current: usage.houses, max: usage.maxHouses, unit: "Galpões" },
  ];

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: PLANO E USO */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARD DO PLANO ATUAL */}
          <section className="bento-card-elite relative overflow-hidden group border-indigo-100">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest mb-4 italic">
                   Status da Assinatura: {subscription?.status || 'Ativo'}
                </div>
                <h2 className="text-3xl font-black text-slate-900 italic mb-2">Plano {plan.name}</h2>
                <p className="text-sm text-slate-500 font-medium">
                  Seu próximo faturamento será em <span className="text-indigo-600 font-black">{new Date(subscription?.currentPeriodEnd || Date.now()).toLocaleDateString('pt-BR')}</span>.
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900 italic tabular-nums">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(plan.priceMonthly))}
                  <span className="text-xs text-slate-400 font-bold uppercase not-italic ml-1">/ mês</span>
                </p>
                <button 
                  onClick={handleManageSubscription}
                  disabled={isPending}
                  className="mt-4 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform ml-auto disabled:opacity-50"
                >
                   {isPending ? 'Redirecionando...' : 'Gerenciar no Stripe'} <ExternalLink size={14} />
                </button>

              </div>
            </div>
          </section>

          {/* INDICADORES DE USO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usageStats.map((stat, i) => {
              const percent = Math.min((stat.current / stat.max) * 100, 100);
              return (
                <div key={i} className="bento-card-elite">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 shadow-sm">
                      <Package size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  
                  <div className="flex items-end justify-between mb-2">
                    <h4 className="text-2xl font-black text-slate-900 italic tabular-nums">{stat.current} <span className="text-xs text-slate-400 not-italic">/ {stat.max}</span></h4>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{percent.toFixed(0)}%</span>
                  </div>
                  
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${percent > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* HISTÓRICO DE FATURAS */}
          <section className="bento-card-elite !p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 italic leading-none">Histórico de Faturas</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Transações e recibos fiscais</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Recibo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.map((inv, i) => (
                    <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-slate-900">{new Date(inv.billingDate).toLocaleDateString('pt-BR')}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-black text-slate-900 italic">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.amount))}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {inv.status === 'PAID' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100 group-hover:scale-110">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center">
                        <Info size={32} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhuma fatura encontrada</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* LADO DIREITO: BENEFÍCIOS & UPGRADE */}
        <div className="space-y-8">
          <div className="p-8 rounded-[22px] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={120} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-black italic tracking-tight mb-4">Potencialize sua Granja</h3>
              <ul className="space-y-4 mb-8">
                {[
                  "Relatórios Zootécnicos Ilimitados",
                  "Módulo de Sanidade Avançado",
                  "Previsão de Produção via IA",
                  "Suporte 24/7 de Especialistas"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-indigo-200 mt-0.5 shrink-0" />
                    <span className="text-xs text-indigo-50 font-medium leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-4 rounded-[18px] bg-white text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95 italic">
                Fazer Upgrade para Elite
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[18px] bg-amber-50 border border-amber-100 space-y-4">
             <div className="flex items-center gap-3 text-amber-600">
               <Info size={20} />
               <h4 className="text-sm font-black italic">Informação de Faturamento</h4>
             </div>
             <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
               Utilizamos o Stripe para processamento seguro de pagamentos. Seus dados de cartão nunca tocam nossos servidores.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
