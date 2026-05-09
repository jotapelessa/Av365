'use client';

import { DashboardCard } from './DashboardGrid';
import { CheckCircle2, Clock, ChevronRight, ListTodo } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
}

export function ActiveTasksHub({ tasks }: { tasks: Task[] }) {
  const highPriorityCount = tasks.filter(t => t.priority === 'HIGH').length;

  return (
    <DashboardCard 
      auditId="dashboard__hub__tasks"
      span={4} 
      className="bg-white border border-slate-50 shadow-sm flex flex-col relative overflow-hidden group p-[var(--padding-fluid)]"
    >
      <div className="flex items-center justify-between mb-[var(--gap-fluid)]">
        <div className="flex items-center gap-[var(--gap-fluid)]">
          <div className="p-[var(--gap-fluid)] rounded-2xl bg-indigo-50 text-primary flex-shrink-0">
            <ListTodo className="icon-fluid-lg" />
          </div>
          <div>
            <h2 className="text-h2 text-slate-900 tracking-tight italic leading-none" data-audit="dashboard__tasks__title">Tarefas Ativas</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1" data-audit="dashboard__tasks__subtitle">Gestão Operacional</p>
          </div>
        </div>
        {highPriorityCount > 0 && (
          <div data-audit="dashboard__tasks__priority-badge" className="hidden sm:flex px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black uppercase tracking-widest animate-pulse">
            {highPriorityCount} Urgentes
          </div>
        )}
      </div>

      <div className="space-y-[var(--gap-fluid)] flex-1 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              data-audit={`dashboard__tasks__item-${task.id}`}
              className="flex items-center justify-between p-[var(--gap-fluid)] rounded-[18px] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-md transition-all group/item"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-1.5 h-8 rounded-full ${
                  task.priority === 'HIGH' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 
                  task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-800 truncate tracking-tight uppercase">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={10} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <Link 
                href="/tasks" 
                data-audit={`dashboard__tasks__action-${task.id}`}
                className="p-1.5 rounded-lg bg-white text-slate-300 group-hover/item:text-primary group-hover/item:bg-indigo-50 transition-all"
              >
                <ChevronRight size={14} />
              </Link>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-10 opacity-30 text-center" data-audit="dashboard__tasks__empty">
            <CheckCircle2 size={40} className="mb-3 text-slate-300" />
            <p className="text-sm font-black italic text-slate-400">Tudo em dia por aqui!</p>
          </div>
        )}
      </div>

      <Link 
        href="/tasks" 
        data-audit="dashboard__tasks__view-all"
        className="mt-[var(--gap-fluid)] w-full py-3 rounded-xl border border-slate-100 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary hover:bg-indigo-50/50 hover:border-indigo-100 transition-all active:scale-[0.98]"
      >
        Ver Central de Tarefas
      </Link>
    </DashboardCard>
  );
}
