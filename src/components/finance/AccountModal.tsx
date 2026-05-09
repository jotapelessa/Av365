'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Building2, 
  Wallet,
  DollarSign
} from 'lucide-react';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { upsertFinancialAccount } from '@/app/finance/actions';
import { toast } from 'sonner';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: any;
}

export default function AccountModal({ isOpen, onClose, account }: AccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'BANK',
    balance: account?.balance || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await upsertFinancialAccount({
        id: account?.id,
        ...formData
      });
      toast.success("Conta financeira salva!");
      onClose();
      window.location.reload(); // Quick refresh for now
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
            className="bg-white w-full max-w-xl rounded-[24px] overflow-hidden shadow-2xl flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">
                  {account ? 'Editar Conta Financeira' : 'Nova Disponibilidade'}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mt-1">
                  Gestão de Ativos & Liquidez
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Building2 size={14} className="text-indigo-500" /> Nome da Conta / Instituição
                  </label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Banco do Brasil - Conta Corrente"
                    className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Wallet size={14} className="text-amber-500" /> Tipo de Conta
                    </label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none cursor-pointer shadow-inner-sm"
                    >
                      <option value="BANK">Bancária</option>
                      <option value="CASH">Caixa Interno (Espécie)</option>
                      <option value="SAVINGS">Reserva / Poupança</option>
                      <option value="INVESTMENT">Investimento</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-500" /> Saldo Inicial (R$)
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={formData.balance}
                      onChange={e => setFormData({...formData, balance: Number(e.target.value)})}
                      className="w-full h-14 px-6 rounded-[18px] bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-4">
                <LuxuryButton onClick={onClose} variant="secondary">Cancelar</LuxuryButton>
                <LuxuryButton type="submit" isLoading={loading} className="px-10">
                  <Save size={18} className="mr-2" />
                  {account ? 'Salvar Alterações' : 'Criar Conta'}
                </LuxuryButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
