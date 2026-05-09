'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Droplets, History, ArrowUpRight, ArrowDownRight, Settings2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SiloMovementModal from './SiloMovementModal';

interface Silo {
  id: string;
  name: string;
  capacity: number;
  currentStock: number;
  feedType: string | null;
  movements: any[];
}

export default function SiloListClient({ initialSilos }: { initialSilos: Silo[] }) {
  const [selectedSilo, setSelectedSilo] = React.useState<Silo | null>(null);

  if (initialSilos.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Layers size={32} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum Silo Encontrado</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Comece cadastrando seu primeiro silo para monitorar o estoque de ração da fazenda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {initialSilos.map((silo, index) => {
        const percentage = Math.min(100, (silo.currentStock / silo.capacity) * 100);
        const isCritical = percentage < 15;

        return (
          <motion.div 
            key={silo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ui-card bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden group"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{silo.name}</h3>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Droplets size={12} className="text-primary" /> {silo.feedType || 'Ração Geral'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-right mb-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter italic">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedSilo(silo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-primary hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    <Settings2 size={12} /> Gerenciar
                  </button>
                </div>
              </div>

              {/* TANK VISUALIZER */}
              <div className="relative h-28 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 mb-8 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={`absolute inset-y-0 left-0 ${
                    isCritical 
                      ? 'bg-gradient-to-r from-rose-500 to-rose-400' 
                      : 'bg-gradient-to-r from-indigo-600 via-primary to-primary/80'
                  } shadow-[4px_0_15px_rgba(59,130,246,0.3)]`}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                  />
                </motion.div>
                
                {/* GRID OVERLAY */}
                <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-20">
                  <div className="border-r border-slate-300" />
                  <div className="border-r border-slate-300" />
                  <div className="border-r border-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidade</p>
                  <p className="text-lg font-black text-slate-900">{silo.capacity} <span className="text-xs text-slate-400">t</span></p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Atual</p>
                  <p className={`text-lg font-black ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                    {silo.currentStock} <span className="text-xs text-slate-400">t</span>
                  </p>
                </div>
              </div>
            </div>

            {/* RECENT MOVEMENTS MINI-TICKER */}
            <div className="bg-slate-50/30 border-t border-slate-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <History size={14} className="text-slate-400" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">Últimas Operações</h4>
              </div>
              <div className="space-y-3">
                {silo.movements.map((mov: any) => (
                  <div key={mov.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {mov.type === 'IN' ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ArrowDownRight size={14} />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                          <ArrowUpRight size={14} />
                        </div>
                      )}
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{mov.type === 'IN' ? 'Carga' : 'Consumo'}</p>
                        <p className="text-[9px] text-slate-400 font-medium">
                          {new Date(mov.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <p className={`text-[11px] font-black ${mov.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mov.type === 'IN' ? '+' : '-'}{mov.quantity} t
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {selectedSilo && (
          <SiloMovementModal 
            silo={selectedSilo} 
            onClose={() => setSelectedSilo(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
