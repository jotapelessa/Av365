'use client';

import { motion } from "framer-motion";

const colors = [
  { name: "Primary", hex: "#4f46e5", class: "bg-[#4f46e5]", usage: "Brand, Ações" },
  { name: "Success", hex: "#10b981", class: "bg-[#10b981]", usage: "KPIs Positivos" },
  { name: "Danger", hex: "#f43f5e", class: "bg-[#f43f5e]", usage: "Alertas, Erros" },
  { name: "Slate Main", hex: "#1e293b", class: "bg-[#1e293b]", usage: "Títulos, Texto" },
  { name: "Slate Muted", hex: "#64748b", class: "bg-[#64748b]", usage: "Legendas" },
];

const pastels = [
  { name: "Emerald", hex: "#dcfce7", class: "bg-[#dcfce7]", usage: "Saúde/Bio" },
  { name: "Violet", hex: "#ede9fe", class: "bg-[#ede9fe]", usage: "Gestão/Admin" },
  { name: "Blue", hex: "#e0f2fe", class: "bg-[#e0f2fe]", usage: "Financeiro" },
  { name: "Amber", hex: "#fef3c7", class: "bg-[#fef3c7]", usage: "Logística" },
];

export function DesignTokensShowcase() {
  return (
    <div className="space-y-12">
      {/* COLORS */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Standard Palette</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {colors.map((color) => (
            <motion.div 
              key={color.name}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-md shadow-lg ${color.class} transition-transform group-hover:scale-110`} />
              <div>
                <p className="text-xs font-black text-slate-800">{color.name}</p>
                <p className="text-[10px] font-bold text-slate-400 font-mono">{color.hex}</p>
                <p className="text-[9px] font-bold text-indigo-400 uppercase mt-1 italic">{color.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PASTELS */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Luxury Pastels (Categorization)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastels.map((color) => (
            <motion.div 
              key={color.name}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-md shadow-sm ${color.class} transition-transform group-hover:scale-110`} />
              <div>
                <p className="text-xs font-black text-slate-800">{color.name}</p>
                <p className="text-[10px] font-bold text-slate-400 font-mono">{color.hex}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 italic">{color.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TYPOGRAPHY */}
      <div className="bg-white p-10 rounded-[6px] border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Typography Scales (Inter)</h3>
        <div className="space-y-12">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Heading 1 / Hero</p>
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-900 leading-none">Agrotech Elite UI</h1>
            <p className="text-xs text-slate-400 font-mono">font-black (900) / text-6xl / tracking-tighter / italic</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dashboard Titles</p>
            <h2 className="text-3xl font-black italic tracking-tight text-slate-800">Operação Bio-Segura</h2>
            <p className="text-xs text-slate-400 font-mono">font-black (900) / text-3xl / tracking-tight / italic</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Metadata / Labels</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Sensor de Ambiência Live</p>
            <p className="text-xs text-slate-400 font-mono">font-black (900) / text-[10px] / uppercase / tracking-[0.2em]</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Body Text</p>
               <p className="text-base font-medium text-slate-600 leading-relaxed">
                 O sistema de design da Agrotech prioriza a densidade de informações sem sacrificar a estética de luxo. 
                 Cada pixel é pensado para a performance do produtor.
               </p>
               <p className="text-xs text-slate-400 font-mono">font-medium / text-base / leading-relaxed</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Muted Text</p>
               <p className="text-sm font-medium text-slate-400 italic">
                 v1.2.4 Elite Framework • Build 2026.05.03
               </p>
               <p className="text-xs text-slate-400 font-mono">font-medium / text-sm / text-slate-400 / italic</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
