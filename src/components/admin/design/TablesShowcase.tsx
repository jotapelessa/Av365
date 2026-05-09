'use client';

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Thermometer, Droplets, ArrowRight, CheckCircle2 } from "lucide-react";

const mockData = [
  { id: 1, date: new Date(), eggs: 12450, mortality: 2, temp: 27.4, humidity: 60.1, status: "stable" },
  { id: 2, date: new Date(Date.now() - 86400000), eggs: 12380, mortality: 0, temp: 28.1, humidity: 58.5, status: "warning" },
  { id: 3, date: new Date(Date.now() - 172800000), eggs: 12510, mortality: 1, temp: 26.8, humidity: 62.3, status: "stable" },
];

export function TablesShowcase() {
  return (
    <div className="bg-white rounded-[6px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Data / Operação</th>
              <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Produção Diária</th>
              <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sanidade</th>
              <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Climatologia</th>
              <th className="px-6 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockData.map((item) => (
              <tr key={item.id} className="group hover:bg-indigo-50/30 transition-all cursor-default">
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-slate-700">{format(item.date, 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p className="text-[9px] font-bold text-slate-400 italic uppercase">Turno Manhã • Bio-Check</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{item.eggs.toLocaleString('pt-BR')} ovos</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">98.2% eficácia</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.mortality > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className={`text-sm font-black ${item.mortality > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                      {item.mortality} mortes
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Thermometer size={10} className="text-rose-400" />
                      <span className="text-[11px] font-black text-slate-600">{item.temp}°C</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Droplets size={10} className="text-indigo-400" />
                      <span className="text-[11px] font-black text-slate-600">{item.humidity}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                    ${item.status === 'stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                  `}>
                    {item.status === 'stable' ? <CheckCircle2 size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                    {item.status === 'stable' ? 'Estável' : 'Atenção'}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button className="p-2.5 rounded-md bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                     <ArrowRight size={14} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Visualização de 3 registros de elite</p>
        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver Histórico Completo</button>
      </div>
    </div>
  );
}
