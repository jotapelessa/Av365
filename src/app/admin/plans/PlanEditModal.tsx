'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Layers, Users, Home, TrendingUp, DollarSign } from 'lucide-react';
import { updatePlanData } from './actions';
import { toast } from 'sonner';

interface PlanEditModalProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanEditModal({ plan, isOpen, onClose }: PlanEditModalProps) {
  const [formData, setFormData] = useState({
    name: plan.name,
    description: plan.description || '',
    priceMonthly: Number(plan.priceMonthly),
    priceYearly: Number(plan.priceYearly),
    maxFlocks: plan.maxFlocks,
    maxHouses: plan.maxHouses,
    maxUsers: plan.maxUsers,
    isActive: plan.isActive
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updatePlanData(plan.id, formData);
      if (result.success) {
        toast.success("Plano atualizado com sucesso!");
        onClose();
      } else {
        toast.error("Erro ao atualizar o plano.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop Luxury */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Modal content Elite */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 italic">Engenharia de Ofertas</p>
              <h2 className="text-2xl font-black text-slate-900 italic">Editar Configuração</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Commercial Data */}
              <div className="col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Plano</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <DollarSign size={10} /> Mensalidade (R$)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.priceMonthly}
                  onChange={e => setFormData({...formData, priceMonthly: parseFloat(e.target.value)})}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <TrendingUp size={10} /> Anual (R$)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.priceYearly}
                  onChange={e => setFormData({...formData, priceYearly: parseFloat(e.target.value)})}
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                />
              </div>

              {/* Operational Limits */}
              <div className="col-span-2 mt-4 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 italic">Limites de Engenharia SaaS</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Layers size={10} /> Máx. Lotes
                    </label>
                    <input 
                      type="number"
                      value={formData.maxFlocks}
                      onChange={e => setFormData({...formData, maxFlocks: parseInt(e.target.value)})}
                      className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Home size={10} /> Máx. Galpões
                    </label>
                    <input 
                      type="number"
                      value={formData.maxHouses}
                      onChange={e => setFormData({...formData, maxHouses: parseInt(e.target.value)})}
                      className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Users size={10} /> Máx. Usuários
                    </label>
                    <input 
                      type="number"
                      value={formData.maxUsers}
                      onChange={e => setFormData({...formData, maxUsers: parseInt(e.target.value)})}
                      className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 rounded-[20px] bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar Operação
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[1.5] h-14 rounded-[20px] bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] italic shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={14} />
                    Confirmar Upgrade de Dados
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
