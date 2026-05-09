'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { addSiloMovement } from './actions';

interface SiloMovementModalProps {
  silo: { id: string; name: string };
  onClose: () => void;
}

export default function SiloMovementModal({ silo, onClose }: SiloMovementModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addSiloMovement({
        siloId: silo.id,
        type,
        quantity: Number(quantity),
        reason: reason || undefined
      });

      if (result.success) {
        onClose();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar movimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{silo.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registrar Movimentação</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-[18px]">
              <button 
                type="button"
                onClick={() => setType('IN')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${
                  type === 'IN' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Plus size={16} /> Carga (Entrada)
              </button>
              <button 
                type="button"
                onClick={() => setType('OUT')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${
                  type === 'OUT' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Minus size={16} /> Consumo (Saída)
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantidade (Toneladas)</label>
              <input 
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-[22px] text-2xl font-black text-slate-900 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none italic"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observação / Motivo</label>
              <input 
                placeholder="Ex: Abastecimento quinzenal"
                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[18px] text-slate-900 font-bold focus:bg-white focus:border-primary/30 outline-none transition-all"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !quantity}
              className="w-full h-16 bg-slate-900 text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              Confirmar Operação
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
