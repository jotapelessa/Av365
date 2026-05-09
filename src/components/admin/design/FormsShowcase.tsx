'use client';

import { useState } from "react";
import { Mail, Lock, Bird, Calendar, ChevronDown, Check, AlertCircle } from "lucide-react";

export function FormsShowcase() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="bg-white p-10 rounded-[6px] border border-slate-100 shadow-2xl shadow-slate-200/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* TEXT INPUTS */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Input Master Examples</h3>
          
          <div className="space-y-6">
            {/* Standard Input */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">
                Nome do Lote
              </label>
              <div className="relative">
                <Bird className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Ex: Lohmann LSL 2024-A"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-md text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                />
              </div>
            </div>

            {/* Error State */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] ml-1">
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
                <input 
                  type="date" 
                  className="w-full pl-12 pr-4 py-4 bg-rose-50/50 border border-rose-200 rounded-md text-sm font-bold text-rose-700 outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                  <AlertCircle size={18} />
                </div>
              </div>
              <p className="text-[9px] font-bold text-rose-500 italic ml-1 uppercase">Data inválida ou no futuro.</p>
            </div>

            {/* Success State */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">
                E-mail de Notificação
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                <input 
                  type="email" 
                  defaultValue="admin@agrotech.com"
                  className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-200 rounded-md text-sm font-bold text-emerald-700 outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                  <Check size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTS & CONTROLS */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Advanced Controls</h3>
          
          <div className="space-y-10">
            {/* Custom Select Placeholder */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Linhagem Genética
              </label>
              <div className="relative cursor-pointer">
                <div className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md text-sm font-bold text-slate-700 flex items-center justify-between group-hover:bg-white group-hover:border-indigo-600 transition-all">
                  <span>Lohmann Brown-Classic</span>
                  <ChevronDown size={18} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Toggle / Switch */}
            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-md border border-slate-100">
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">Alertas Críticos</p>
                <p className="text-[9px] font-bold text-slate-400 italic mt-1.5 uppercase">Notificar por WhatsApp/Telegram</p>
              </div>
              <button 
                onClick={() => setToggle(!toggle)}
                className={`
                  w-14 h-8 rounded-full p-1 transition-all duration-500 flex
                  ${toggle ? 'bg-indigo-600 justify-end shadow-lg shadow-indigo-100' : 'bg-slate-200 justify-start'}
                `}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            {/* Range / Slider Mock */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Limite de Umidade</label>
                <span className="text-xs font-black text-indigo-600 italic">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full relative">
                <div className="absolute left-0 top-0 h-full w-[75%] bg-indigo-600 rounded-full shadow-lg shadow-indigo-100" />
                <div className="absolute left-[75%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full shadow-xl cursor-grab" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
