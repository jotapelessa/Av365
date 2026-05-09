'use client';

import { useState } from "react";
import { Save, Bird, Info, Wallet, Scale, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { createFlock } from "../../app/flocks/actions";

interface House {
  id: string;
  name: string;
}

export default function FlockFormClient({ houses }: { houses: House[] }) {
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const totalCost = (unitPrice * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <form action={createFlock} className="bg-white/40 backdrop-blur-xl rounded-[6px] border border-white/20 p-10 space-y-12 shadow-sm">
      {/* SEÇÃO 1: IDENTIFICAÇÃO TÉCNICA */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
          <div className="p-3 rounded-[6px] bg-primary text-white shadow-lg shadow-indigo-100">
            <Bird size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight leading-none">Identificação Técnica</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Dados fundamentais do plantel</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nome do Lote</label>
            <input 
              name="name"
              type="text" 
              placeholder="Ex: Lote Norte 01"
              required
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linhagem Genética</label>
            <input 
              name="breed"
              type="text" 
              placeholder="Ex: Lohmann Brown"
              required
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Finalidade</label>
            <select 
              name="purpose"
              required
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none shadow-sm"
            >
              <option value="POSTURA">Postura (Ovos)</option>
              <option value="CORTE">Corte (Carne)</option>
              <option value="RECRIA">Recria</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Galpão de Alojamento</label>
            <select 
              name="houseId"
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none shadow-sm"
            >
              <option value="">Selecione um galpão (opcional)</option>
              {houses.map(house => (
                <option key={house.id} value={house.id}>{house.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: BIOMETRIA E ORIGEM */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
          <div className="p-3 rounded-[6px] bg-emerald-500 text-white shadow-lg shadow-emerald-100">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight leading-none">Biometria e Origem</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Controle biológico inicial</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fornecedor</label>
            <input 
              name="supplier"
              type="text" 
              placeholder="Ex: Granja X"
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Idade na Chegada (Dias)</label>
            <input 
              name="ageAtArrival"
              type="number" 
              placeholder="1"
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Peso Médio (g)</label>
            <input 
              name="initialWeight"
              type="number" 
              step="0.01"
              placeholder="40"
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data de Nascimento</label>
            <input 
              name="birthDate"
              type="date" 
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Data de Aquisição</label>
            <input 
              name="acquisitionDate"
              type="date" 
              required
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: INVESTIMENTO FINANCEIRO */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
          <div className="p-3 rounded-[6px] bg-amber-500 text-white shadow-lg shadow-amber-100">
            <Wallet size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 italic tracking-tight leading-none">Investimento Financeiro</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Capital inicial e custo por ave</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantidade de Aves</label>
            <input 
              name="initialQuantity"
              type="number" 
              placeholder="0"
              required
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Preço Unitário (R$)</label>
            <input 
              name="unitPrice"
              type="number" 
              step="0.01"
              placeholder="0,00"
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-6 py-4 rounded-[6px] bg-white/50 border border-slate-100 text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {quantity > 0 && unitPrice > 0 && (
          <div className="p-8 rounded-[6px] bg-indigo-50/50 border border-indigo-100 flex items-center justify-between backdrop-blur-sm shadow-sm group">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[6px] bg-white text-primary shadow-sm group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Investimento Estimado</h4>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{totalCost}</p>
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest max-w-[180px] text-right leading-relaxed">
              Este valor será lançado <span className="text-primary">automaticamente</span> no módulo financeiro.
            </p>
          </div>
        )}
      </div>

      <div className="pt-10 border-t border-slate-100 flex items-center justify-between gap-6">
        <Link 
          href="/flocks"
          className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
        >
          Cancelar
        </Link>
        
        <button 
          type="submit"
          className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Save size={18} className="group-hover:rotate-12 transition-transform" />
          Salvar Lote de Elite
        </button>
      </div>
    </form>
  );
}
