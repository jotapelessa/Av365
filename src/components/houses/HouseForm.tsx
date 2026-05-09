'use client';

import { useState } from "react";
import { createHouse } from "@/app/houses/actions";
import { toast } from "sonner";
import { Loader2, Save, X, Home, Gauge, Zap, Wind } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

interface HouseFormProps {
  onClose: () => void;
}

export default function HouseForm({ onClose }: HouseFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 12, length: 100 });

  const area = dimensions.width * dimensions.length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createHouse(formData);
      if (result.success) {
        toast.success("Galpão criado com sucesso!");
        onClose();
      } else {
        toast.error("Erro ao criar galpão");
      }
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[6px] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-primary text-white shadow-lg shadow-indigo-100">
              <Home size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Novo Galpão de Elite</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Infraestrutura Técnica</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-white text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Galpão</label>
                <input 
                  name="name"
                  required
                  placeholder="Ex: Galpão Sul 01"
                  className="w-full px-5 py-4 rounded-md bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade Máxima (Aves)</label>
                <input 
                  name="capacity"
                  type="number"
                  required
                  placeholder="Ex: 15000"
                  className="w-full px-5 py-4 rounded-md bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sistema de Alojamento</label>
                <select 
                  name="housingSystem"
                  className="w-full px-5 py-4 rounded-md bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700 appearance-none"
                >
                  <option value="CONVENTIONAL">Convencional</option>
                  <option value="AUTOMATED">Automatizado</option>
                  <option value="DARK_HOUSE">Dark House</option>
                </select>
              </div>
            </div>

            {/* Dimensões e Tecnologia */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Largura (m)</label>
                  <input 
                    name="width"
                    type="number"
                    step="0.1"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                    className="w-full px-5 py-4 rounded-md bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comprimento (m)</label>
                  <input 
                    name="length"
                    type="number"
                    step="0.1"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                    className="w-full px-5 py-4 rounded-md bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Preview de Área */}
              <div className="p-4 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-indigo-600">
                  <Gauge size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Área Calculada</span>
                </div>
                <span className="text-lg font-black text-indigo-700">{area.toLocaleString('pt-BR')} m²</span>
              </div>

              <div className="pt-2 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="hasClimate" className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                    <Wind size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Climatização Ativa</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="hasAutoFeeding" className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Alimentação Automática</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-6 pt-8 border-t border-slate-50">
            <button 
              type="button"
              onClick={onClose}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              Descartar
            </button>
            <LuxuryButton 
              type="submit"
              isLoading={isPending}
              variant="primary"
              icon={Save}
              className="px-10"
            >
              Efetivar Galpão
            </LuxuryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
