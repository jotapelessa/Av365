'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MapPin, MoreVertical, RotateCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SortableTaskCardProps {
  task: any;
  onClick: (task: any) => void;
}

export default function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return { color: 'bg-rose-500', bg: 'bg-rose-50/50', text: 'text-rose-600', label: 'Crítico' };
      case 'HIGH': return { color: 'bg-amber-500', bg: 'bg-amber-50/50', text: 'text-amber-600', label: 'Alta' };
      case 'MEDIUM': return { color: 'bg-indigo-500', bg: 'bg-indigo-50/50', text: 'text-indigo-600', label: 'Média' };
      default: return { color: 'bg-slate-300', bg: 'bg-slate-50', text: 'text-slate-400', label: 'Normal' };
    }
  };

  const pConfig = getPriorityConfig(task.priority);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group bg-white border border-slate-100 p-6 rounded-[18px] shadow-sm hover:shadow-xl hover:shadow-indigo-100/10 transition-all duration-300 cursor-grab active:cursor-grabbing relative overflow-hidden mb-4"
    >
      {task.priority === 'CRITICAL' && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-500" />
      )}
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-lg ${pConfig.bg} flex items-center gap-1.5`}>
              <div className={`w-1.5 h-1.5 rounded-full ${pConfig.color}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${pConfig.text} italic`}>
                {pConfig.label}
              </span>
            </div>
            {task.priority === 'CRITICAL' && (
              <AlertTriangle size={12} className="text-rose-500 animate-pulse" />
            )}
          </div>
          <button className="p-1 text-slate-300 group-hover:text-slate-600 transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>

        <h4 className="text-sm font-black text-slate-900 italic tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h4>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <Clock size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter italic">
              {format(new Date(task.dueDate), "dd MMM", { locale: ptBR })}
            </span>
          </div>
          {task.house && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
              <MapPin size={10} className="text-indigo-400" />
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter italic">{task.house.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 pt-4 border-t border-slate-50/80">
          <div className="flex -space-x-2">
            {task.assignedTo && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border-2 border-white shadow-md" title={task.assignedTo.name}>
                {task.assignedTo.name?.charAt(0)}
              </div>
            )}
            {task.recurrenceRule && (
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border-2 border-white shadow-sm">
                <RotateCw size={12} strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
            #{task.id.slice(-4)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
