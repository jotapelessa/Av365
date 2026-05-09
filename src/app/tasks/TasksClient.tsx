'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  RotateCw,
  MoreVertical,
  MapPin,
  Users,
  X,
  Zap,
  History,
  Activity,
  ArrowRight,
  LayoutGrid,
  Check,
  Target,
  Thermometer,
  ShieldCheck,
  TrendingUp,
  Package,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TaskModal from './TaskModal';
import { updateTaskStatus, postponeTask, transferTask, pauseTask, getTaskLogs } from './actions';
import ExecutionView from './ExecutionView';
import BoardColumn from './BoardColumn';
import SortableTaskCard from './SortableTaskCard';

interface TasksClientProps {
  initialTasks: any[];
  houses: any[];
  flocks: any[];
  employees: any[];
  customers: any[];
  suppliers: any[];
  inventoryItems: any[];
  producerId: string;
}

const STATUS_CYCLE = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const getNextStatus = (currentStatus: string) => {
  const index = STATUS_CYCLE.indexOf(currentStatus);
  if (index === -1) return 'PENDING';
  if (index === STATUS_CYCLE.length - 1) return 'PENDING';
  return STATUS_CYCLE[index + 1];
};

export default function TasksClient({ 
  initialTasks, 
  houses, 
  flocks, 
  employees,
  customers,
  suppliers,
  inventoryItems,
  producerId 
}: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<'list' | 'calendar' | 'board' | 'timeline'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExecutionMode, setIsExecutionMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHouse, setFilterHouse] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [taskLogs, setTaskLogs] = useState<any[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSeed = async () => {
    const toastId = toast.loading("Iniciando injeção de dados de elite...");
    try {
      const res = await fetch('/api/producer/seed', { 
        method: 'POST',
        headers: { 'x-seeder-secret': 'dev-secret-123' }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Granja Elite Operacional povoada com sucesso!", { id: toastId });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Erro ao povoar: " + data.error, { id: toastId });
      }
    } catch (e) {
      toast.error("Erro na requisição de seed", { id: toastId });
    }
  };

  const handleOpenModal = (task?: any) => {
    setSelectedTask(task || null);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (taskId: string, status: any) => {
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, status);
        toast.success(`Tarefa atualizada para ${status}`);
      } catch (err: any) {
        setTasks(previousTasks);
        toast.error(`Erro: ${err.message}`);
      }
    });
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.data.current?.status || over.id;
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'DELAYED', 'TRANSFERRED', 'CANCELED', 'OVERDUE'];
    
    if (!validStatuses.includes(newStatus)) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      handleStatusUpdate(taskId, newStatus);
    }
  };

  const handlePause = async (taskId: string, isPausing: boolean) => {
    startTransition(async () => {
      try {
        await pauseTask(taskId, isPausing);
        toast.success(isPausing ? "Operação Pausada" : "Operação Retomada");
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: isPausing ? 'PAUSED' : 'IN_PROGRESS' } : t));
      } catch (err: any) {
        toast.error(`Erro ao pausar: ${err.message}`);
      }
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = filterHouse === 'ALL' || task.houseId === filterHouse;
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
    return matchesSearch && matchesHouse && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    delayed: tasks.filter(t => t.status === 'DELAYED').length,
    critical: tasks.filter(t => t.priority === 'CRITICAL' && t.status !== 'COMPLETED').length
  };

  const handleShowHistory = async (task: any) => {
    setSelectedTask(task);
    setIsHistoryOpen(true);
    setIsLogsLoading(true);
    try {
      const logs = await getTaskLogs(task.id);
      setTaskLogs(logs);
    } catch (err) {
      toast.error("Erro ao atualizar status");
    } finally {
      setIsLogsLoading(false);
    }
  };

  const handleStatusStep = async (task: any) => {
    const nextStatus = getNextStatus(task.status);
    await handleStatusUpdate(task.id, nextStatus as any);
  };

  const monthStart = startOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(endOfMonth(monthStart)) 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'DELAYED': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'PAUSED': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'IN_PROGRESS': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  if (isExecutionMode) {
    return (
      <ExecutionView 
        tasks={tasks}
        onComplete={(id) => handleStatusUpdate(id, 'COMPLETED')}
        onPause={handlePause}
        onBack={() => setIsExecutionMode(false)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      
      {/* 🛡️ Strategic Intelligence Banner */}
      <div className="bg-indigo-950 text-white px-10 py-4 flex items-center justify-between overflow-hidden relative border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900/50 to-indigo-950" />
        
        <div className="relative z-10 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-md opacity-20 animate-pulse" />
              <Zap size={16} className="text-amber-400 fill-amber-400 relative z-10" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 italic">Comando Tático de Inteligência</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <p className="text-[11px] font-bold italic text-indigo-100/80 hidden lg:block tracking-tight">
            "Análise do Lote E-01: Conversão alimentar 4.2% acima da meta. Janela vacinal Marek recomendada para próxima terça às 05:00."
          </p>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/80 italic">Saúde: Excelente</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-indigo-300" />
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 italic">Sinc: Real-Time</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-10 space-y-12 max-w-[1920px] mx-auto w-full relative z-10">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Main Header Elite */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100/50 border border-slate-100 transition-all duration-700 group-hover:rotate-6 group-hover:scale-105">
                <Activity className="text-indigo-600" size={36} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] italic shadow-sm">
                <Target size={14} className="animate-pulse" /> Operação de Precisão
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic leading-none">Centro de Comando <span className="text-indigo-600">Elite</span></h1>
              <p className="text-slate-400 text-base font-bold italic tracking-tight">Gestão tática avançada para produtores de alta performance.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button 
              onClick={handleSeed}
              className="p-5 bg-white text-slate-400 hover:text-indigo-600 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-100/50 transition-all hover:-translate-y-1 active:scale-95 group"
              title="Sincronizar Inteligência"
            >
              <RotateCw size={24} className={`${isPending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            </button>
            <button 
              onClick={() => setIsExecutionMode(true)}
              className="px-10 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[24px] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 active:scale-95 flex items-center gap-4 italic group"
            >
              <Zap size={18} fill="currentColor" className="text-amber-400 group-hover:scale-125 transition-transform" /> Modo Campo
            </button>
            <LuxuryButton 
              onClick={() => handleOpenModal()} 
              className="rounded-[24px] px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 italic"
            >
              <Plus size={18} strokeWidth={4} className="mr-3" /> Iniciar Missão
            </LuxuryButton>
          </div>
        </header>

        {/* Tactical Performance Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {[
            { label: "Equipe Elite", value: employees.length, icon: Users, color: "indigo", trend: "+2 ativos", desc: "Força de Trabalho Ativa" },
            { label: "Alertas Críticos", value: stats.critical, icon: AlertCircle, color: "rose", trend: "Atenção Total", desc: "Ações de Urgência" },
            { label: "Lotes Ativos", value: flocks.length, icon: Activity, color: "emerald", trend: "Em Conformidade", desc: "Monitoramento de Lote" },
            { label: "Balanço Operacional", value: "Ok", icon: Wallet, color: "amber", trend: "Fluxo Positivo", desc: "Contas Integradas" }
          ].map((stat, i) => (
            <div key={i} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                stat.color === 'rose' ? 'from-rose-500 to-orange-400' :
                stat.color === 'emerald' ? 'from-emerald-500 to-teal-400' :
                stat.color === 'amber' ? 'from-amber-500 to-yellow-400' :
                'from-indigo-600 to-cyan-500'
              } rounded-[18px] blur opacity-0 group-hover:opacity-10 transition duration-700`}></div>
              <div className="relative bg-white border border-slate-100 p-8 rounded-[18px] shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase tracking-widest text-${stat.color}-500 italic`}>{stat.trend}</span>
                    <div className="w-8 h-1 bg-slate-50 rounded-full mt-2" />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-1">{stat.value}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View Switcher & Global Filter */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[400px]">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter size={20} />
              </div>
              <input 
                type="text"
                placeholder="Rastrear missão ou galpão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[18px] text-sm font-bold shadow-xl shadow-slate-100/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all italic placeholder:text-slate-300"
              />
            </div>
            <select 
              value={filterHouse}
              onChange={(e) => setFilterHouse(e.target.value)}
              className="px-8 py-5 bg-white border border-slate-100 rounded-[18px] text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none hover:border-indigo-200 transition-all cursor-pointer shadow-xl shadow-slate-100/50 italic min-w-[220px]"
            >
              <option value="ALL">Todos os Galpões</option>
              {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          <div className="p-2 bg-slate-100/40 rounded-[24px] border border-slate-100 backdrop-blur-xl flex items-center gap-2">
            {[
              { id: 'list', label: 'Dashboard', icon: List },
              { id: 'board', label: 'Quadro Operacional', icon: LayoutGrid },
              { id: 'calendar', label: 'Agenda Tática', icon: CalendarIcon },
              { id: 'timeline', label: 'Fluxo Biológico', icon: Activity },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic ${
                  view === v.id 
                  ? 'bg-white text-indigo-600 shadow-2xl shadow-indigo-100/50 border border-indigo-100/20 scale-105' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                <v.icon size={16} strokeWidth={3} />
                <span className="hidden xl:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Render Elite */}
        <div className="flex-1 min-h-[700px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <AnimatePresence mode="wait">
              {view === 'list' && (
                <motion.div 
                  key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="space-y-16"
                >
                  {['PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'DELAYED', 'TRANSFERRED', 'CANCELED', 'OVERDUE'].map(status => {
                    const statusTasks = filteredTasks.filter(t => t.status === status);
                    if (statusTasks.length === 0) return null;

                    return (
                      <div key={status} className="space-y-8">
                        <div className="flex items-center gap-6 ml-4">
                          <div className={`w-4 h-4 rounded-full ${
                            status === 'COMPLETED' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                            status === 'DELAYED' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' :
                            status === 'PAUSED' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                            status === 'IN_PROGRESS' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-300'
                          }`} />
                          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-900 italic flex items-center gap-4">
                            {status === 'PENDING' ? 'Aguardando Disparo' :
                             status === 'IN_PROGRESS' ? 'Operações Ativas' :
                             status === 'PAUSED' ? 'Missões Suspensas' :
                             status === 'COMPLETED' ? 'Arquivo de Elite' : 'Pendências de Atraso'}
                            <span className="text-slate-200 font-bold opacity-50 select-none">/ {statusTasks.length} unidades</span>
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {statusTasks.map((task) => (
                            <div 
                              key={task.id} 
                              className="group relative bg-white border border-slate-100 hover:border-indigo-200/50 p-8 rounded-[18px] shadow-sm hover:shadow-[0_32px_80px_rgba(79,70,229,0.08)] transition-all duration-700 flex flex-col xl:flex-row xl:items-center justify-between gap-10 overflow-hidden"
                            >
                              <div className="flex items-center gap-8 flex-1">
                                <div className="relative group/status">
                                  <button 
                                    onClick={() => handleStatusStep(task)}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      setOpenStatusMenuId(openStatusMenuId === task.id ? null : task.id);
                                    }}
                                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-700 ${
                                      task.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white rotate-12 scale-110' : 
                                      task.status === 'IN_PROGRESS' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' :
                                      'border-slate-100 hover:border-indigo-400 bg-slate-50'
                                    }`}
                                  >
                                    {task.status === 'COMPLETED' ? <Check size={24} strokeWidth={4} /> : 
                                     task.status === 'IN_PROGRESS' ? <RotateCw size={20} strokeWidth={3} className="animate-spin-slow" /> :
                                     <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                  </button>
                                  
                                  <button 
                                    onClick={() => setOpenStatusMenuId(openStatusMenuId === task.id ? null : task.id)}
                                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-md flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm opacity-0 group-hover/status:opacity-100 transition-opacity"
                                  >
                                    <ChevronLeft size={10} strokeWidth={4} className="-rotate-90" />
                                  </button>

                                  <AnimatePresence>
                                    {openStatusMenuId === task.id && (
                                      <>
                                        <div className="fixed inset-0 z-[100]" onClick={() => setOpenStatusMenuId(null)} />
                                        <motion.div 
                                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-[110] overflow-hidden"
                                        >
                                          <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Alteração Rápida</p>
                                          </div>
                                          {[
                                            { id: 'PENDING', label: 'Pendente', color: 'text-slate-400', bg: 'hover:bg-slate-50' },
                                            { id: 'IN_PROGRESS', label: 'Em Execução', color: 'text-indigo-600', bg: 'hover:bg-indigo-50' },
                                            { id: 'COMPLETED', label: 'Concluída', color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
                                            { id: 'PAUSED', label: 'Pausada', color: 'text-amber-600', bg: 'hover:bg-amber-50' },
                                            { id: 'DELAYED', label: 'Atrasada / Adiada', color: 'text-rose-600', bg: 'hover:bg-rose-50' },
                                            { id: 'TRANSFERRED', label: 'Transferida', color: 'text-sky-600', bg: 'hover:bg-sky-50' },
                                            { id: 'CANCELED', label: 'Cancelada', color: 'text-slate-400', bg: 'hover:bg-slate-100' },
                                          ].map((s) => (
                                            <button
                                              key={s.id}
                                              onClick={() => {
                                                handleStatusUpdate(task.id, s.id as any);
                                                setOpenStatusMenuId(null);
                                              }}
                                              className={`w-full px-3 py-2 rounded-lg text-left text-[10px] font-black uppercase tracking-widest italic transition-colors flex items-center justify-between ${s.bg} ${s.color}`}
                                            >
                                              {s.label}
                                              {task.status === s.id && <Check size={12} strokeWidth={4} />}
                                            </button>
                                          ))}
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-4">
                                    <h3 
                                      onClick={() => handleOpenModal(task)}
                                      className={`text-2xl font-black tracking-tighter text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors italic leading-none ${task.status === 'COMPLETED' ? 'line-through text-slate-300 opacity-50' : ''}`}
                                    >
                                      {task.title}
                                    </h3>
                                    {task.priority === 'CRITICAL' && (
                                      <span className="px-4 py-1 bg-rose-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-rose-100 italic">Crítico</span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2.5">
                                      <Clock size={14} className="text-slate-300" />
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{format(new Date(task.dueDate), "dd MMM HH:mm", { locale: ptBR })}</span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-slate-100" />
                                    <div className="flex items-center gap-2.5">
                                      <MapPin size={14} className="text-indigo-400" />
                                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">{task.house?.name || 'Geral'}</span>
                                    </div>
                                    {task.flock && (
                                      <>
                                        <div className="h-3 w-[1px] bg-slate-100" />
                                        <div className="flex items-center gap-2.5">
                                          <Activity size={14} className="text-emerald-500" />
                                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Lote {task.flock.name}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between xl:justify-end gap-10 pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-50">
                                {task.assignedTo && (
                                  <div className="flex items-center gap-5">
                                    <div className="text-right hidden sm:block">
                                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{task.assignedTo.name}</p>
                                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Responsável Tático</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center text-sm font-black text-indigo-600 border border-indigo-100 shadow-inner group-hover:scale-110 transition-transform">
                                      {task.assignedTo.name?.charAt(0)}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-4">
                                  <button 
                                    onClick={() => handleShowHistory(task)}
                                    className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100 group/btn"
                                    title="Audit Log"
                                  >
                                    <History size={20} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                                  </button>
                                  <button 
                                    onClick={() => handleOpenModal(task)}
                                    className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                  >
                                    <MoreVertical size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {view === 'board' && (
                <motion.div 
                  key="board" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar min-h-[800px]"
                >
                  {['PENDING', 'IN_PROGRESS', 'PAUSED', 'DELAYED', 'COMPLETED', 'TRANSFERRED', 'CANCELED'].map(status => (
                    <BoardColumn 
                      key={status}
                      status={status}
                      tasks={filteredTasks.filter(t => t.status === status)}
                      onTaskClick={handleOpenModal}
                    />
                  ))}
                </motion.div>
              )}

              {view === 'calendar' && (
                <motion.div 
                  key="calendar" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[18px] border border-slate-100 shadow-3xl overflow-hidden flex flex-col shadow-indigo-100/20"
                >
                  {/* Calendar Header Elite */}
                  <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between bg-white relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                    <div className="flex items-center gap-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-2 italic">Agenda Tática Mensal</span>
                        <h2 className="text-6xl font-black italic text-slate-900 tracking-tighter capitalize leading-none">
                          {format(currentMonth, 'MMMM', { locale: ptBR })}
                          <span className="text-slate-100 ml-4">{format(currentMonth, 'yyyy')}</span>
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-[18px] border border-slate-100 ml-4 shadow-inner">
                        <button 
                          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
                          className="p-4 hover:bg-white text-slate-400 hover:text-indigo-600 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                        >
                          <ChevronLeft size={24} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => setCurrentMonth(new Date())} 
                          className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-all italic hover:bg-white rounded-xl shadow-sm hover:shadow-md"
                        >
                          Hoje
                        </button>
                        <button 
                          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                          className="p-4 hover:bg-white text-slate-400 hover:text-indigo-600 rounded-xl transition-all active:scale-90 shadow-sm hover:shadow-md"
                        >
                          <ChevronRight size={24} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <div className="hidden xl:flex items-center gap-10 px-10 py-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                      {[
                        { label: 'Crítico', color: 'rose' },
                        { label: 'Planejado', color: 'indigo' },
                        { label: 'Concluído', color: 'emerald' },
                      ].map((tag, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full bg-${tag.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{tag.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Matrix Elite */}
                  <div className="flex-1 overflow-hidden p-8 bg-slate-50/30">
                    <div className="grid grid-cols-7 mb-6 px-4">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="text-center">
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300 italic">{day}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 grid-rows-6 h-[800px] gap-4">
                      {(() => {
                        const monthStart = startOfMonth(currentMonth);
                        const monthEnd = endOfMonth(monthStart);
                        const startDate = startOfWeek(monthStart);
                        const endDate = endOfWeek(monthEnd);
                        const calendarDays = [];
                        let dayIter = startDate;

                        while (dayIter <= endDate) {
                          calendarDays.push(dayIter);
                          dayIter = addDays(dayIter, 1);
                        }

                        while (calendarDays.length < 42) {
                          calendarDays.push(dayIter);
                          dayIter = addDays(dayIter, 1);
                        }

                        return calendarDays.map((date, i) => {
                          const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), date));
                          const isCurrentMonth = isSameMonth(date, monthStart);
                          const isToday = isSameDay(date, new Date());

                          return (
                            <div 
                              key={i} 
                              className={`relative border border-slate-100/50 rounded-[18px] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:scale-[1.02] group hover:z-20 ${
                                !isCurrentMonth ? 'bg-slate-50/10 opacity-30 pointer-events-none' : 
                                isToday ? 'bg-white ring-4 ring-indigo-50 shadow-xl' : 'bg-white shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-5">
                                <span className={`text-xl font-black italic tracking-tighter leading-none ${
                                  !isCurrentMonth ? 'text-slate-100' : 
                                  isToday ? 'text-indigo-600' : 'text-slate-900'
                                }`}>
                                  {format(date, 'd')}
                                </span>
                                  {isToday && (
                                    <div className="px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-100">Atual</div>
                                  )}
                                </div>

                                {/* Status Counters Elite - Full Lifecycle Dashboard */}
                                {dayTasks.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {[
                                      { status: 'PENDING', label: 'PND', count: dayTasks.filter(t => t.status === 'PENDING').length, color: 'text-slate-400', dot: 'bg-slate-300' },
                                      { status: 'IN_PROGRESS', label: 'EXE', count: dayTasks.filter(t => t.status === 'IN_PROGRESS').length, color: 'text-indigo-600', dot: 'bg-indigo-500' },
                                      { status: 'PAUSED', label: 'PAU', count: dayTasks.filter(t => t.status === 'PAUSED').length, color: 'text-amber-600', dot: 'bg-amber-500' },
                                      { status: 'COMPLETED', label: 'FIN', count: dayTasks.filter(t => t.status === 'COMPLETED').length, color: 'text-emerald-600', dot: 'bg-emerald-500' },
                                      { status: 'DELAYED', label: 'ATR', count: dayTasks.filter(t => t.status === 'DELAYED').length, color: 'text-rose-500', dot: 'bg-rose-400' },
                                      { status: 'OVERDUE', label: 'VEN', count: dayTasks.filter(t => t.status === 'OVERDUE').length, color: 'text-rose-700', dot: 'bg-rose-700' },
                                      { status: 'TRANSFERRED', label: 'TRA', count: dayTasks.filter(t => t.status === 'TRANSFERRED').length, color: 'text-sky-600', dot: 'bg-sky-500' },
                                      { status: 'CANCELED', label: 'CAN', count: dayTasks.filter(t => t.status === 'CANCELED').length, color: 'text-slate-900', dot: 'bg-slate-900' },
                                    ].filter(s => s.count > 0).map((s, idx) => (
                                      <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50/50 rounded-md border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all" title={s.status}>
                                        <div className={`w-1 h-1 rounded-full ${s.dot}`} />
                                        <span className={`text-[8px] font-black italic leading-none ${s.color}`}>{s.count}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Lista de tarefas removida para manter apenas contadores numéricos */}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DndContext>
        </div>

        {/* 🚀 SaaS Elite Power Showcase */}
        <div className="py-40 border-t border-slate-100/60 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20" />
          
          <div className="flex flex-col items-center text-center mb-24 space-y-6">
            <div className="px-6 py-2 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em] italic shadow-sm">Tecnologia de Campo</div>
            <h2 className="text-6xl font-black italic tracking-tighter text-slate-900 leading-none">Domínio Operacional <span className="text-indigo-600">360°</span></h2>
            <p className="text-slate-400 max-w-2xl text-lg font-medium italic">Ferramentas de engenharia avícola para quem exige precisão milimétrica em cada lote.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Biosseguridade Elite", icon: ShieldCheck, color: "emerald", desc: "Gestão de vazio sanitário e rastreabilidade total de vacinas." },
              { title: "Inteligência Ambiental", icon: Thermometer, color: "rose", desc: "Monitoramento de amônia, CO2 e umidade em tempo real." },
              { title: "Ciclos Inteligentes", icon: RotateCw, color: "amber", desc: "Automação de rotinas diárias com lembretes no Modo Campo." },
              { title: "Engenharia de Custos", icon: TrendingUp, color: "sky", desc: "Análise de conversão alimentar e ROI por ciclo produtivo." }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-[18px] blur opacity-0 group-hover:opacity-10 transition duration-700"></div>
                <div className="relative h-full bg-white border border-slate-100 p-12 rounded-[18px] shadow-sm hover:shadow-3xl transition-all duration-700 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 bg-${feature.color}-50 text-${feature.color}-600 rounded-[18px] flex items-center justify-center mb-10 shadow-2xl shadow-${feature.color}-50 border border-${feature.color}-100 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                    <feature.icon size={36} />
                  </div>
                  <h4 className="text-2xl font-black italic text-slate-900 mb-6 tracking-tight uppercase leading-none">{feature.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-bold italic">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📜 Advanced Audit Log - Elite Modal */}
        <AnimatePresence>
          {isHistoryOpen && selectedTask && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex justify-end">
              <motion.div 
                initial={{ x: '100%', opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-2xl bg-white h-full shadow-3xl flex flex-col border-l border-white/20 relative"
              >
                <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl shadow-2xl shadow-indigo-100 flex items-center justify-center border border-white/10">
                      <History size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">Rastreabilidade Total</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mt-2 italic flex items-center gap-2">
                        <Zap size={12} fill="currentColor" /> Operação: {selectedTask.title}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsHistoryOpen(false)} 
                    className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90"
                  >
                    <X size={28} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-[#fcfdfe]">
                  {isLogsLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                      <div className="relative">
                        <div className="w-20 h-20 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-xl" />
                        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-200" size={32} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 italic">Sincronizando Auditoria Operacional...</p>
                    </div>
                  ) : (
                    <div className="relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                      {taskLogs.length === 0 ? (
                        <div className="text-center py-20 opacity-50 italic text-slate-400 font-bold text-sm uppercase tracking-widest">Nenhuma alteração registrada no protocolo.</div>
                      ) : taskLogs.map((log: any, idx: number) => (
                        <div key={log.id} className="relative pl-24 pb-16 last:pb-0">
                          <div className={`absolute left-5 top-2 w-6 h-6 rounded-full border-4 border-white shadow-2xl z-10 transition-all duration-500 ${
                            idx === 0 ? 'bg-indigo-600 ring-8 ring-indigo-50 scale-125' : 'bg-slate-200 scale-100'
                          }`} />
                          
                          <div className="bg-white border border-slate-100 p-8 rounded-[18px] shadow-sm hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-700 group/log">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                              <span className={`w-fit text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-lg italic ${
                                log.action === 'TASK_CREATE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                log.action === 'TASK_TRANSFER' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                                log.action === 'TASK_PAUSE' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                log.action === 'TASK_RESUME' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                log.action === 'TASK_STATUS_CHANGE' ? 'bg-slate-950 text-white' :
                                'bg-slate-50 text-slate-600'
                              }`}>
                                {log.action.replace('TASK_', '').replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-3 text-slate-300">
                                <Clock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">
                                  {format(new Date(log.createdAt), "HH:mm '•' dd MMM yyyy", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[18px] border border-slate-100 mb-8">
                              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl font-black text-slate-950 shadow-sm italic">
                                {log.user?.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                <p className="text-base font-black text-slate-950 uppercase tracking-tighter italic leading-none mb-1">{log.user?.name || 'Sistema Central'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Agente Responsável</p>
                              </div>
                            </div>

                            {log.dataAfter?.status && (
                              <div className="pt-8 border-t border-slate-100 flex flex-col gap-5">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Transição de Status:</div>
                                <div className="flex items-center gap-6">
                                  <div className="px-5 py-2.5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-lg italic">{log.dataBefore?.status || 'INICIAL'}</div>
                                  <ArrowRight size={20} className="text-slate-200" strokeWidth={3} />
                                  <div className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg shadow-xl shadow-indigo-100 italic">{log.dataAfter.status}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-10 border-t border-slate-100 bg-white relative z-10">
                  <button 
                    onClick={() => setIsHistoryOpen(false)} 
                    className="w-full py-8 bg-slate-950 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-3xl shadow-slate-200 italic active:scale-95 border-b-4 border-slate-800"
                  >
                    Encerrar Protocolo de Auditoria
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          task={selectedTask} 
          houses={houses} 
          flocks={flocks} 
          employees={employees} 
          customers={customers}
          suppliers={suppliers}
          inventoryItems={inventoryItems}
        />
      </main>
    </div>
  );
}
