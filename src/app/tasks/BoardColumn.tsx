'use client';

// Componente de Coluna para o Board de Tarefas Táticas

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';
import { 
  Target, 
  Activity, 
  PauseCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  ArrowRight 
} from 'lucide-react';

interface BoardColumnProps {
  status: string;
  tasks: any[];
  onTaskClick: (task: any) => void;
}

export default function BoardColumn({ status, tasks, onTaskClick }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { status }
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { 
        label: 'Aguardando', 
        icon: Target, 
        color: 'text-slate-400', 
        bg: 'bg-slate-100/30',
        dot: 'bg-slate-300'
      };
      case 'IN_PROGRESS': return { 
        label: 'Em Execução', 
        icon: Activity, 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50/30',
        dot: 'bg-indigo-500'
      };
      case 'PAUSED': return { 
        label: 'Suspensas', 
        icon: PauseCircle, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50/30',
        dot: 'bg-amber-500'
      };
      case 'COMPLETED': return { 
        label: 'Finalizadas', 
        icon: CheckCircle2, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50/30',
        dot: 'bg-emerald-500'
      };
      case 'DELAYED': return { 
        label: 'Atrasadas', 
        icon: Clock, 
        color: 'text-rose-600', 
        bg: 'bg-rose-50/30',
        dot: 'bg-rose-500'
      };
      case 'OVERDUE': return { 
        label: 'Vencidas', 
        icon: AlertCircle, 
        color: 'text-rose-700', 
        bg: 'bg-rose-100/30',
        dot: 'bg-rose-700'
      };
      case 'CANCELED': return { 
        label: 'Canceladas', 
        icon: X, 
        color: 'text-slate-400', 
        bg: 'bg-slate-200/30',
        dot: 'bg-slate-400'
      };
      case 'TRANSFERRED': return { 
        label: 'Transferidas', 
        icon: ArrowRight, 
        color: 'text-sky-600', 
        bg: 'bg-sky-50/30',
        dot: 'bg-sky-500'
      };
      default: return { 
        label: status, 
        icon: Target, 
        color: 'text-slate-400', 
        bg: 'bg-slate-100/30',
        dot: 'bg-slate-300'
      };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="flex-1 min-w-[320px] max-w-[400px] flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Column Header - Glassmorphism */}
      <div className="flex items-center justify-between px-6 py-5 mb-6 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[18px] shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 rounded-full ${config.dot} shadow-[0_0_12px_rgba(79,70,229,0.3)]`} />
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900 italic">
            {config.label}
          </h3>
          <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-md">
            {tasks.length}
          </span>
        </div>
        <config.icon size={16} className={config.color} strokeWidth={3} />
      </div>

      {/* Column Content */}
      <div 
        ref={setNodeRef}
        className={`flex-1 p-5 rounded-[18px] transition-all duration-500 ${config.bg} border border-slate-100/50 hover:border-indigo-100/50 min-h-[500px]`}
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
            {tasks.length === 0 && (
              <div className="h-48 flex flex-col items-center justify-center text-center opacity-10 group">
                <config.icon size={48} className="mb-3 group-hover:scale-110 transition-transform duration-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Zero Operações</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
