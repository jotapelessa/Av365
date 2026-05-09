'use client';

import { Home, Users, Gauge, Activity } from "lucide-react";

interface HouseStatsSummaryProps {
  houses: any[];
}

export default function HouseStatsSummary({ houses }: HouseStatsSummaryProps) {
  const totalCapacity = houses.reduce((acc, h) => acc + (h.capacity || 0), 0);
  const totalArea = houses.reduce((acc, h) => acc + (Number(h.width || 0) * Number(h.length || 0)), 0);
  const occupiedHouses = houses.filter(h => h.flockId).length;
  const occupancyRate = houses.length > 0 ? (occupiedHouses / houses.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" data-audit="houses__grid__summary">
      {/* Capacidade Total */}
      <div 
        data-audit="houses__summary__total-capacity"
        className="p-8 rounded-[6px] bg-white border border-white shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-md bg-primary-bg text-primary">
            <Users size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capacidade Total</span>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight italic">
          {totalCapacity.toLocaleString('pt-BR')} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">aves</span>
        </p>
      </div>

      {/* Área Produtiva */}
      <div 
        data-audit="houses__summary__total-area"
        className="p-8 rounded-[6px] bg-white border border-white shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-md bg-success-bg text-success-text">
            <Gauge size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Área Produtiva</span>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight italic">
          {totalArea.toLocaleString('pt-BR')} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">m²</span>
        </p>
      </div>

      {/* Galpões Ativos */}
      <div 
        data-audit="houses__summary__total-houses"
        className="p-8 rounded-[6px] bg-white border border-white shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-md bg-indigo-50 text-indigo-600">
            <Home size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Galpões</span>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight italic">
          {houses.length} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">unidades</span>
        </p>
      </div>

      {/* Taxa de Ocupação */}
      <div 
        data-audit="houses__summary__occupancy-rate"
        className="p-8 rounded-[6px] bg-white border border-white shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-md bg-amber-50 text-amber-600">
            <Activity size={20} />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ocupação</span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-black text-slate-900 tracking-tight italic">
            {occupancyRate.toFixed(1)}%
          </p>
          <div className="flex-1 h-2 bg-slate-50 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000" 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
