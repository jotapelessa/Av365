'use client';

import React, { useTransition } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  AlertCircle,
  PauseCircle,
  RotateCw,
  Camera,
  Zap,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExecutionViewProps {
  tasks: any[];
  onComplete: (taskId: string) => void;
  onPause: (taskId: string, isPausing: boolean) => void;
  onBack: () => void;
}

export default function ExecutionView({ tasks, onComplete, onPause, onBack }: ExecutionViewProps) {
  const todayTasks = tasks.filter(t => {
    const today = new Date();
    const taskDate = new Date(t.dueDate);
    return isSameDay(taskDate, today);
  });

  function isSameDay(d1: Date, d2: Date) {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-[#fcfdfe] flex flex-col font-sans"
    >
      {/* Tactical Mobile Header Elite */}
      <div className="bg-indigo-950 text-white p-10 pb-16 rounded-b-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 p-10 opacity-20 group">
          <Zap size={140} fill="currentColor" className="text-amber-400 group-hover:scale-110 transition-transform duration-1000" />
        </div>
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <button onClick={onBack} className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-all">
            <ChevronRight className="rotate-180" size={28} strokeWidth={3} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Tactical Field Mode</span>
            <div className="h-1.5 w-10 bg-indigo-500 rounded-full mt-2 shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-black shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 italic">
            ELITE
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 italic">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-2">Operações <span className="text-indigo-400">Ativas</span></h1>
          <p className="text-indigo-100/60 text-xs font-bold italic tracking-tight uppercase tracking-[0.1em]">
            {todayTasks.filter(t => t.status === 'COMPLETED').length}/{todayTasks.length} Missões Neutralizadas
          </p>
        </div>
      </div>

      {/* Operation List Elite */}
      <div className="flex-1 overflow-y-auto p-8 -mt-10 space-y-8 pb-48 custom-scrollbar relative z-20">
        {todayTasks.length > 0 ? todayTasks.map(task => (
          <div key={task.id} className={`p-8 rounded-[18px] shadow-xl border border-slate-100 flex flex-col gap-8 transition-all duration-500 active:scale-[0.98] ${
            task.status === 'PAUSED' ? 'bg-amber-50/50 border-amber-200' : 
            task.status === 'COMPLETED' ? 'bg-white border-slate-100 opacity-60' :
            'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                  task.priority === 'CRITICAL' ? 'bg-rose-600 text-white shadow-rose-200 animate-pulse' : 
                  task.status === 'PAUSED' ? 'bg-amber-500 text-white shadow-amber-200' :
                  'bg-slate-950 text-white shadow-slate-300 border border-white/10'
                }`}>
                  {task.status === 'COMPLETED' ? <CheckCircle2 size={40} strokeWidth={3} /> :
                   task.status === 'PAUSED' ? <PauseCircle size={40} strokeWidth={3} /> :
                   task.priority === 'CRITICAL' ? <AlertCircle size={40} strokeWidth={3} /> : 
                   <Activity size={40} strokeWidth={3} className="animate-pulse" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg italic ${
                      task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {task.priority === 'CRITICAL' ? 'Urgência Crítica' : 'Operação Normal'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter leading-tight uppercase">{task.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={14} className="text-indigo-600" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{task.house?.name || 'Área Geral'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {task.description && (
              <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 italic text-sm text-slate-500 font-bold leading-relaxed">
                "{task.description}"
              </div>
            )}

            {task.status !== 'COMPLETED' && (
              <div className="grid grid-cols-2 gap-5">
                <button 
                  onClick={() => onComplete(task.id)}
                  className="h-32 rounded-[24px] bg-emerald-600 text-white flex flex-col items-center justify-center gap-2 shadow-2xl shadow-emerald-200 active:scale-95 transition-all border-b-[6px] border-emerald-800"
                >
                  <CheckCircle2 size={36} strokeWidth={3} />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Neutralizar</span>
                </button>
                
                <button 
                  onClick={() => onPause(task.id, task.status !== 'PAUSED')}
                  className={`h-32 rounded-[24px] flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all border-b-[6px] ${
                    task.status === 'PAUSED' 
                    ? 'bg-slate-950 text-white border-slate-800 shadow-slate-300' 
                    : 'bg-amber-500 text-white border-amber-700 shadow-amber-200'
                  }`}
                >
                  {task.status === 'PAUSED' ? (
                    <>
                      <RotateCw size={36} strokeWidth={3} />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Retomar</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle size={36} strokeWidth={3} />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Suspender</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-24 px-10">
            <div className="w-48 h-48 bg-white rounded-[48px] flex items-center justify-center mb-12 shadow-2xl border border-slate-50 relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <CheckCircle2 size={80} className="text-emerald-500 relative z-10" strokeWidth={1.5} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter mb-4">Perímetro Limpo</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed italic max-w-xs">
              Todas as operações táticas agendadas para hoje foram finalizadas com sucesso.
            </p>
          </div>
        )}
      </div>

      {/* Floating Tactical Footer Elite */}
      <div className="fixed bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#fcfdfe] via-[#fcfdfe]/95 to-transparent flex flex-col gap-4 z-30">
        <div className="flex items-center gap-4">
          <LuxuryButton className="flex-1 py-10 rounded-[24px] text-xl font-black italic tracking-tighter shadow-2xl shadow-rose-100 flex items-center justify-center gap-4 group" variant="secondary">
            <Camera size={28} strokeWidth={3} className="text-rose-500 group-hover:scale-110 transition-transform" /> 
            <span className="uppercase tracking-[0.1em]">Relatar Anormalidade</span>
          </LuxuryButton>
        </div>
      </div>
    </motion.div>
  );
}
