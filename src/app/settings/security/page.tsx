'use client';

import React, { useState } from 'react';
import { useSession, useUser } from "@clerk/nextjs";
import { ShieldCheck, Lock, Smartphone, Monitor, Globe, ChevronRight, AlertTriangle, Key } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const { user } = useUser();
  const { session } = useSession();

  // No client-side do Clerk, podemos listar as sessões do usuário logado
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      user.getSessions().then(sess => {
        setActiveSessions(sess.map(s => ({
          id: s.id,
          device: s.latestActivity.deviceType || "Dispositivo Desconhecido",
          location: `${s.latestActivity.city || "Localização"}, ${s.latestActivity.country || "Desconhecida"}`,
          browser: `${s.latestActivity.browserName || "Navegador"} / ${(s.latestActivity as any).osName || (s.latestActivity as any).os || "OS"}`,
          current: s.id === session?.id,
          date: s.id === session?.id ? "Ativo agora" : new Date(s.lastActiveAt).toLocaleDateString(),
          icon: s.latestActivity.deviceType === 'mobile' ? Smartphone : Monitor
        })));
      });
    }
  }, [user, session]);

  const sessions = activeSessions.length > 0 ? activeSessions : [
    { 
      id: "current",
      device: "Este Dispositivo", 
      location: "Localizando...", 
      browser: "Navegador Atual", 
      current: true, 
      date: "Ativo agora",
      icon: Monitor 
    }
  ];

  const handleRevokeSession = async (sessionId: string) => {
    if (!user) return;
    try {
      const sessionsToRevoke = await user.getSessions();
      const targetSession = sessionsToRevoke.find(s => s.id === sessionId);
      if (targetSession) {
        await targetSession.revoke();
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
        toast.success("Sessão encerrada com sucesso.");
      }
    } catch (err) {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!user || !session) return;
    try {
      const sessionsToRevoke = await user.getSessions();
      const others = sessionsToRevoke.filter(s => s.id !== session.id);
      for (const s of others) {
        await s.revoke();
      }
      setActiveSessions(prev => prev.filter(s => s.current));
      toast.success("Todas as outras sessões foram encerradas.");
    } catch (err) {
      toast.error("Erro ao encerrar outras sessões.");
    }
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: CONTROLES DE ACESSO */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARDS DE AÇÃO RÁPIDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bento-card-elite group cursor-pointer border-indigo-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform">
                  <Key size={20} />
                </div>
                <h3 className="font-black text-slate-900 italic">Trocar Senha</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-4">Atualize sua chave de acesso periodicamente para maior segurança.</p>
              <div className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                Gerenciar via Clerk <ChevronRight size={14} />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bento-card-elite group cursor-pointer border-emerald-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
                  <Smartphone size={20} />
                </div>
                <h3 className="font-black text-slate-900 italic">MFA / 2FA</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-4">Adicione uma camada extra de proteção via SMS ou App Autenticador.</p>
              <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest gap-2">
                Configurar Agora <ChevronRight size={14} />
              </div>
            </motion.div>
          </div>

          {/* SESSÕES ATIVAS */}
          <section className="bento-card-elite !p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm">
                  <Monitor size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 italic leading-none">Dispositivos & Sessões</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Controle de acessos recentes à sua conta</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {sessions.map((sess, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${sess.current ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      <sess.icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-800 italic">{sess.device}</p>
                        {sess.current && (
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Sessão Atual</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sess.browser} • {sess.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{sess.date}</p>
                    {!sess.current && (
                      <button 
                        onClick={() => handleRevokeSession(sess.id)}
                        className="text-[9px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest underline decoration-2 underline-offset-4"
                      >
                        Encerrar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-slate-50/30 border-t border-slate-50">
              <button 
                onClick={handleRevokeAllOtherSessions}
                className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white hover:text-rose-600 hover:border-rose-200 transition-all"
              >
                Encerrar todas as outras sessões
              </button>
            </div>
          </section>

        </div>

        {/* LADO DIREITO: STATUS DE PROTEÇÃO */}
        <div className="space-y-8">
          <div className="p-8 rounded-[22px] bg-slate-900 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-500/30">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" /> Nível de Proteção: Alto
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-2">Segurança Blindada</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                Sua conta está protegida por criptografia de ponta a ponta e monitoramento de anomalias.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Senha</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Forte</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">2FA</span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Recomendado</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IP Registrado</span>
                  <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">187.21.**.**</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[18px] bg-rose-50 border border-rose-100 space-y-4">
             <div className="flex items-center gap-3 text-rose-600">
               <AlertTriangle size={20} />
               <h4 className="text-sm font-black italic">Zona de Perigo</h4>
             </div>
             <p className="text-[10px] text-rose-700 font-medium leading-relaxed uppercase tracking-tight">
               A exclusão da conta é irreversível e apagará todos os dados de produção e históricos financeiros da sua granja.
             </p>
             <button className="w-full py-4 rounded-2xl bg-white border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
               Excluir Minha Conta
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
