'use client';

import { DashboardCard } from "@/components/dashboard/DashboardGrid";
import { CheckCircle2, Circle, Clock, AlertCircle, Camera, User } from "lucide-react";

interface HouseTaskListProps {
  tasks: any[];
}

export function HouseTaskList({ tasks }: HouseTaskListProps) {
  const getStatusConfig = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'COMPLETED';
    
    if (status === 'COMPLETED') return { icon: <CheckCircle2 size={18} className="text-emerald-500" />, label: 'Concluída', color: 'text-emerald-500' };
    if (isOverdue) return { icon: <AlertCircle size={18} className="text-rose-500" />, label: 'Atrasada', color: 'text-rose-500' };
    if (status === 'IN_PROGRESS') return { icon: <Clock size={18} className="text-amber-500" />, label: 'Em Andamento', color: 'text-amber-500' };
    return { icon: <Circle size={18} className="text-slate-300" />, label: 'Pendente', color: 'text-slate-400' };
  };

  return (
    <DashboardCard span={12} className="p-10 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Checklist Operacional</h4>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Tarefas vinculadas a este galpão</p>
        </div>
        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
             Total: {tasks.length}
           </span>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const config = getStatusConfig(task.status, task.dueDate);
            return (
              <div 
                key={task.id}
                className="group flex items-center justify-between p-5 rounded-md border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="transition-transform group-hover:scale-110 duration-500">
                    {config.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </h5>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        <Clock size={10} />
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <User size={10} />
                          {task.assignedTo.name?.split(' ')[0]}
                        </div>
                      )}
                      {task.completionPhoto && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-tight">
                          <Camera size={10} />
                          Foto Anexa
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className={`text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg border bg-white ${config.color} border-slate-100`}>
                      {config.label}
                   </div>
                   <button className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-indigo-600 hover:border-indigo-100">
                      <CheckCircle2 size={14} />
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="p-4 rounded-full bg-white text-slate-200 mb-4 shadow-sm">
               <CheckCircle2 size={32} />
            </div>
            <p className="text-sm text-slate-400 font-bold italic">Nenhuma tarefa pendente para este galpão.</p>
            <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
              + Criar Tarefa de Manutenção
            </button>
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
            Ver Histórico Completo de Manutenções
          </button>
        </div>
      )}
    </DashboardCard>
  );
}
