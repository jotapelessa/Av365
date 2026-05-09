'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  ArrowRightLeft,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { createInternalTransfer } from '@/app/finance/actions';
import { toast } from 'sonner';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: any[];
}

export default function TransferModal({ isOpen, onClose, accounts }: TransferModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fromAccountId === formData.toAccountId) {
      toast.error("Contas de origem e destino devem ser diferentes.");
      return;
    }

    setLoading(true);
    try {
      await createInternalTransfer({
        ...formData,
        date: new Date(formData.date)
      });
      toast.success("Transferência realizada com sucesso!");
      onClose();
      window.location.reload();
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
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">
                  Transferência <span className="text-primary">Interna</span>
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                  Movimentação de Recursos entre Caixas
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center text-primary">
                    <ArrowRightLeft size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origem do Recurso</label>
                  <select 
                    required
                    value={formData.fromAccountId}
                    onChange={e => setFormData({...formData, fromAccountId: e.target.value})}
                    className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer shadow-inner-sm"
                  >
                    <option value="">Selecione a conta...</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (R$ {acc.balance.toLocaleString()})</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destino do Recurso</label>
                  <select 
                    required
                    value={formData.toAccountId}
                    onChange={e => setFormData({...formData, toAccountId: e.target.value})}
                    className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer shadow-inner-sm"
                  >
                    <option value="">Selecione a conta...</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-500" /> Valor da Transferência
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-inner-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" /> Data da Operação
                  </label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-inner-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" /> Observações (Opcional)
                </label>
                <input 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Motivo da transferência..."
                  className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-inner-sm"
                />
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
                <LuxuryButton onClick={onClose} variant="secondary">Cancelar</LuxuryButton>
                <LuxuryButton type="submit" isLoading={loading} className="px-12">
                  <Send size={18} className="mr-2" />
                  Efetivar Transferência
                </LuxuryButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
