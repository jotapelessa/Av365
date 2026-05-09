'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Calendar, 
  AlertTriangle, 
  MapPin, 
  User, 
  Bird,
  Repeat,
  Trash2,
  Clock,
  Zap,
  ChevronRight,
  ClipboardList,
  Activity
} from 'lucide-react';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { createTask, updateTask } from './actions';
import { toast } from 'sonner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  houses: any[];
  flocks: any[];
  employees: any[];
  customers: any[];
  suppliers: any[];
  inventoryItems: any[];
}

export default function TaskModal({ 
  isOpen, 
  onClose, 
  task,
  houses, 
  flocks, 
  employees,
  customers,
  suppliers,
  inventoryItems
}: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    priority: task?.priority || 'MEDIUM',
    category: task?.category || 'OTHER',
    houseId: task?.houseId || '',
    flockId: task?.flockId || '',
    assignedUserId: task?.assignedUserId || '',
    clientId: task?.clientId || '',
    supplierId: task?.supplierId || '',
    inventoryItemId: task?.inventoryItemId || '',
    recurrenceRule: task?.recurrenceRule || '',
    status: task?.status || 'PENDING'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task?.id) {
        await updateTask(task.id, { ...formData, dueDate: new Date(formData.dueDate) });
        toast.success("Operação atualizada!");
      } else {
        await createTask({ ...formData, dueDate: new Date(formData.dueDate) as any });
        toast.success("Missão tática agendada!");
      }
      onClose();
    } catch (err: any) {
      toast.error(`Falha Crítica: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[18px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex flex-col max-h-[95vh] border border-white/20 relative"
          >
            {/* Header Elite */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-200 border border-white/10 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <Zap className="text-white relative z-10" size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">
                    {task ? 'Modificar Operação' : 'Nova Missão Operacional'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Central de Comando Tático</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[#fcfdfe]">
              {/* Expert Templates Quick-Actions Elite */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                  <ClipboardList size={14} className="text-indigo-600" /> Modelos Operacionais de Elite
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Vacinação", title: "Vacinação Preventiva", desc: "Aplicação conforme cronograma sanitário rigoroso.", priority: "CRITICAL", category: "SANITY", icon: "💉" },
                    { label: "Coleta", title: "Coleta Técnica de Ovos", desc: "Coleta manual com triagem e registro de qualidade.", priority: "HIGH", category: "MAINTENANCE", icon: "🥚" },
                    { label: "Entrega", title: "Entrega de Produtos", desc: "Logística de saída para cliente final.", priority: "HIGH", category: "COMMERCIAL", icon: "🚛" },
                    { label: "Abastecimento", title: "Compra de Insumos", desc: "Abastecimento de estoque via fornecedor.", priority: "HIGH", category: "SUPPLY", icon: "🚜" },
                    { label: "Limpeza", title: "Sanitização de Perímetro", desc: "Limpeza profunda e desinfecção nível G2.", priority: "HIGH", category: "MAINTENANCE", icon: "🧼" },
                  ].map((temp) => (
                    <button
                      key={temp.label}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        title: temp.title,
                        description: temp.desc,
                        priority: temp.priority as any,
                        category: temp.category as any
                      })}
                      className={`group px-4 py-2.5 rounded-xl border text-[10px] font-black transition-all active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-lg ${
                        formData.category === temp.category 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'
                      }`}
                    >
                      <span className="group-hover:scale-125 transition-transform">{temp.icon}</span>
                      <span className="uppercase tracking-widest italic">{temp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description Elite */}
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Identificador da Missão..."
                    className="w-full h-16 px-6 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all text-2xl font-black italic tracking-tighter uppercase placeholder:text-slate-200 shadow-sm"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-100 group-focus-within:text-indigo-100 transition-colors pointer-events-none">
                    <ChevronRight size={32} strokeWidth={3} />
                  </div>
                </div>
                <div className="relative">
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Diretrizes operacionais e instruções específicas para o executor de campo..."
                    rows={3}
                    className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-600 resize-none italic placeholder:text-slate-300"
                  />
                  <div className="absolute top-4 right-4 opacity-10">
                    <ClipboardList size={40} />
                  </div>
                </div>
              </div>

              {/* Grid de Configurações Elite */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                      <Calendar size={14} className="text-indigo-600" /> Data de Execução
                    </label>
                    <input 
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none italic"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                      <AlertTriangle size={14} className="text-amber-500" /> Nível de Prioridade
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({...formData, priority: p as any})}
                          className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border-2 italic ${
                            formData.priority === p 
                              ? 'bg-slate-950 text-white border-slate-950 shadow-xl shadow-slate-200' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {p === 'CRITICAL' ? '⚠️ CRÍTICA' : p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                      <MapPin size={14} className="text-sky-600" /> Alocação de Setor
                    </label>
                    <select 
                      value={formData.houseId}
                      onChange={e => setFormData({...formData, houseId: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer italic"
                    >
                      <option value="">Operação Geral / Sem Local</option>
                      {houses.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                      <User size={14} className="text-emerald-600" /> Agente Responsável
                    </label>
                    <select 
                      value={formData.assignedUserId}
                      onChange={e => setFormData({...formData, assignedUserId: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer italic"
                    >
                      <option value="">Pool de Operações (Livre)</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                      <Activity size={14} className="text-indigo-600" /> Status da Missão
                    </label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-indigo-600 transition-all appearance-none cursor-pointer italic"
                    >
                      <option value="PENDING">PENDENTE / AGUARDANDO</option>
                      <option value="IN_PROGRESS">EM EXECUÇÃO</option>
                      <option value="PAUSED">PAUSADA</option>
                      <option value="COMPLETED">CONCLUÍDA</option>
                      <option value="DELAYED">ATRASADA / ADIADA</option>
                      <option value="OVERDUE">VENCIDA</option>
                      <option value="CANCELED">CANCELADA</option>
                      <option value="TRANSFERRED">TRANSFERIDA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Conexões Dinâmicas Táticas Elite */}
              <AnimatePresence>
                {(formData.category === 'COMMERCIAL' || formData.category === 'LOGISTICS' || formData.category === 'SUPPLY' || formData.category === 'SANITY') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100"
                  >
                    {(formData.category === 'COMMERCIAL' || formData.category === 'LOGISTICS') && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                          <User size={14} className="text-sky-600" /> Cliente Vinculado
                        </label>
                        <select 
                          value={formData.clientId}
                          onChange={e => setFormData({...formData, clientId: e.target.value})}
                          className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-sky-600 transition-all appearance-none cursor-pointer italic"
                        >
                          <option value="">Selecionar Cliente...</option>
                          {customers.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                        </select>
                      </div>
                    )}

                    {formData.category === 'SUPPLY' && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                          <MapPin size={14} className="text-amber-600" /> Fornecedor Vinculado
                        </label>
                        <select 
                          value={formData.supplierId}
                          onChange={e => setFormData({...formData, supplierId: e.target.value})}
                          className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-amber-600 transition-all appearance-none cursor-pointer italic"
                        >
                          <option value="">Selecionar Fornecedor...</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
                        </select>
                      </div>
                    )}

                    {(formData.category === 'SANITY' || formData.category === 'SUPPLY') && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                          <Zap size={14} className="text-emerald-600" /> Insumo / Produto Relacionado
                        </label>
                        <select 
                          value={formData.inventoryItemId}
                          onChange={e => setFormData({...formData, inventoryItemId: e.target.value})}
                          className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 font-black text-xs text-slate-900 outline-none focus:border-emerald-600 transition-all appearance-none cursor-pointer italic"
                        >
                          <option value="">Selecionar Insumo...</option>
                          {inventoryItems.map(item => <option key={item.id} value={item.id}>{item.name.toUpperCase()}</option>)}
                        </select>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recorrência Visual Elite */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-2xl shadow-indigo-100 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Repeat size={18} className="text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Automação de Ciclo</span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Repetir esta operação automaticamente</span>
                  </div>
                </div>
                <select 
                  value={formData.recurrenceRule}
                  onChange={e => setFormData({...formData, recurrenceRule: e.target.value})}
                  className="h-10 px-6 rounded-xl border border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-[0.2em] text-indigo-400 focus:bg-white focus:text-slate-900 outline-none transition-all cursor-pointer appearance-none relative z-10 italic"
                >
                  <option value="">Única</option>
                  <option value="DAILY">Diária</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensal</option>
                </select>
              </div>
            </form>

            {/* Footer Actions Elite */}
            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-4">
                {task && (
                  <button type="button" className="w-12 h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100">
                    <Trash2 size={20} strokeWidth={2.5} />
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest italic">{task ? 'Última modificação hoje' : 'Protocolo de criação ativa'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={onClose} 
                  className="px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-all italic"
                >
                  Cancelar
                </button>
                <LuxuryButton onClick={handleSubmit} isLoading={loading} className="gap-3 rounded-[24px] px-10 py-7 text-sm font-black italic tracking-tighter uppercase shadow-2xl shadow-indigo-200">
                  <Save size={20} strokeWidth={3} />
                  {task ? 'Atualizar Dados' : 'Agendar Missão'}
                </LuxuryButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
