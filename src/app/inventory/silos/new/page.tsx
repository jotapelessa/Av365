'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardContainer, DashboardItem } from '@/components/dashboard/DashboardClient';
import { createSilo } from '../actions';
import { Layers, ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewSiloPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    feedType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createSilo({
        name: formData.name,
        capacity: Number(formData.capacity),
        feedType: formData.feedType || undefined
      });

      if (result.success) {
        router.push('/inventory/silos');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar silo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <DashboardItem className="mb-8">
        <Link 
          href="/inventory/silos"
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Voltar para Silos
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Configurar <span className="text-primary italic">Novo Silo</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Defina a capacidade e o tipo de ração para monitoramento automático.</p>
      </DashboardItem>

      <DashboardItem className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Silo</label>
              <input 
                required
                placeholder="Ex: Silo Norte 01"
                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[18px] text-slate-900 font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade (Toneladas)</label>
              <input 
                required
                type="number"
                step="0.01"
                placeholder="Ex: 15"
                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[18px] text-slate-900 font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Ração (Opcional)</label>
            <input 
              placeholder="Ex: Pré-inicial / Postura"
              className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[18px] text-slate-900 font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              value={formData.feedType}
              onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-slate-900 text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Finalizar Cadastro
          </button>
        </form>
      </DashboardItem>
    </DashboardContainer>
  );
}
