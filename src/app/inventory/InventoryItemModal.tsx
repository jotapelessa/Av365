'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Package, 
  AlertTriangle,
  Layers,
  Activity,
  DollarSign
} from 'lucide-react';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { upsertInventoryItem } from '@/app/inventory/actions';
import { toast } from 'sonner';

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  categories: any[];
}

export default function InventoryItemModal({ isOpen, onClose, item, categories }: InventoryItemModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || '',
    categoryId: item?.categoryId || '',
    unit: item?.unit || 'KG',
    currentStock: item?.currentStock || 0,
    minStock: item?.minStock || 0,
    averageCost: item?.averageCost || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await upsertInventoryItem({
        id: item?.id,
        ...formData
      });
      if (result.success) {
        toast.success("Item de estoque salvo!");
        onClose();
        window.location.reload();
      } else {
        toast.error("Erro ao salvar item.");
      }
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-[24px] overflow-hidden shadow-2xl flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white text-indigo-600 shadow-sm border border-slate-100">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">
                    {item ? 'Editar Insumo' : 'Novo Item de Elite'}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mt-1">
                    Controle de Ativos Biológicos & Suprimentos
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Package size={14} className="text-indigo-500" /> Nome do Produto / Insumo
                  </label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Ração Inicial Fase 1"
                    className="luxury-input-elite w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={14} className="text-indigo-500" /> Categoria
                  </label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                    className="luxury-input-elite w-full appearance-none cursor-pointer"
                  >
                    <option value="">Selecionar Categoria...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" /> Unidade de Medida
                  </label>
                  <select 
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="luxury-input-elite w-full appearance-none cursor-pointer"
                  >
                    <option value="KG">Quilos (KG)</option>
                    <option value="TON">Toneladas (TON)</option>
                    <option value="UN">Unidades (UN)</option>
                    <option value="L">Litros (L)</option>
                    <option value="DOSE">Doses</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Package size={14} className="text-emerald-500" /> Estoque Atual
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.currentStock}
                    onChange={e => setFormData({...formData, currentStock: Number(e.target.value)})}
                    className="luxury-input-elite w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-rose-500" /> Estoque Mínimo (Alerta)
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.minStock}
                    onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                    className="luxury-input-elite w-full border-rose-100 focus:border-rose-400"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-500" /> Custo Médio / Unitário (R$)
                  </label>
                  <input 
                    type="number"
                    step="0.0001"
                    required
                    value={formData.averageCost}
                    onChange={e => setFormData({...formData, averageCost: Number(e.target.value)})}
                    className="luxury-input-elite w-full"
                    placeholder="0.0000"
                  />
                </div>

              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
                <LuxuryButton onClick={onClose} variant="secondary">Cancelar</LuxuryButton>
                <LuxuryButton type="submit" isLoading={loading} className="px-12">
                  <Save size={18} className="mr-2" />
                  {item ? 'Salvar Alterações' : 'Cadastrar Item'}
                </LuxuryButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .luxury-input-elite {
          @apply px-5 py-4 bg-slate-50 border border-slate-100 rounded-[18px] text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm;
        }
      `}</style>
    </AnimatePresence>
  );
}
