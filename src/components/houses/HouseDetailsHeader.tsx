'use client';

import { Home, Ruler, Grid, ShieldCheck, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HouseDetailsHeaderProps {
  house: any;
}

export function HouseDetailsHeader({ house }: HouseDetailsHeaderProps) {
  const area = (Number(house.width) * Number(house.length)).toFixed(1);
  const housingSystemLabels: Record<string, string> = {
    'DARK_HOUSE': 'Dark House',
    'AUTOMATED': 'Automatizado',
    'CONVENTIONAL': 'Convencional'
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/houses"
          className="p-2.5 rounded-full bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">{house.name}</h1>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm
              ${house.status === 'ACTIVE' || house.status === 'BUSY' ? 'bg-emerald-500 text-white' : 
                house.status === 'MAINTENANCE' ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {house.status === 'BUSY' ? 'Lote Ativo' : 
               house.status === 'ACTIVE' ? 'Disponível' : 
               house.status === 'MAINTENANCE' ? 'Manutenção' : 'Vazio Sanitário'}
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">{house.description || 'Gestão técnica de infraestrutura avícola.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-[6px] bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-50 text-slate-500">
            <Home size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Sistema</p>
            <p className="text-sm font-bold text-slate-900">{housingSystemLabels[house.housingSystem] || house.housingSystem}</p>
          </div>
        </div>

        <div className="p-4 rounded-[6px] bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-50 text-slate-500">
            <Grid size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Área Total</p>
            <p className="text-sm font-bold text-slate-900">{area} m²</p>
          </div>
        </div>

        <div className="p-4 rounded-[6px] bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-50 text-slate-500">
            <Ruler size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dimensões</p>
            <p className="text-sm font-bold text-slate-900">{house.width}m x {house.length}m</p>
          </div>
        </div>

        <div className="p-4 rounded-[6px] bg-white border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-50 text-slate-500">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Biossegurança</p>
            <p className="text-sm font-bold text-emerald-600">Nível 03</p>
          </div>
        </div>

        <div className="p-4 rounded-[6px] bg-indigo-600 text-white shadow-lg flex items-center gap-3 cursor-pointer hover:bg-indigo-700 transition-colors group">
          <div className="p-2 rounded-md bg-white/10 text-white group-hover:rotate-12 transition-transform">
            <Settings size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tight">Configurações</p>
            <p className="text-sm font-bold">Gerenciar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
