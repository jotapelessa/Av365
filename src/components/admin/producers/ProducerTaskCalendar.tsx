'use client';

import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

export function ProducerTaskCalendar({ tasks }: { tasks: Task[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), day));
  };

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle2 size={8} className="text-emerald-500" />;
    if (status === 'IN_PROGRESS') return <Clock size={8} className="text-amber-500" />;
    return <AlertCircle size={8} className="text-rose-500" />;
  };

  return (
    <div className="bento-card-elite p-10 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Agenda de Operações</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Cronograma de Manejo Técnico</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronLeft size={20} /></button>
          <span className="text-sm font-black text-slate-800 uppercase tracking-widest min-w-[140px] text-center italic">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div key={day} className="bg-slate-50 py-3 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={idx} 
              className={`min-h-[100px] p-2 bg-white transition-all hover:bg-slate-50/50 relative group/day ${
                !isCurrentMonth ? 'opacity-20' : ''
              }`}
            >
              <span className={`text-[11px] font-black italic ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                {format(day, "d")}
              </span>
              
              <div className="mt-2 space-y-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-1 p-1 bg-slate-50 rounded-md border border-slate-100 overflow-hidden">
                    {getStatusIcon(task.status)}
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600 truncate">
                      {task.title}
                    </span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[8px] font-black text-indigo-400 pl-1">
                    + {dayTasks.length - 3} mais
                  </div>
                )}
              </div>

              {isToday && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
