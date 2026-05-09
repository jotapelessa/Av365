'use client';

import { useState } from "react";
import { Home } from "lucide-react";
import HouseForm from "./HouseForm";

export default function HouseEmptyState() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center p-20 rounded-[6px] border-2 border-dashed border-slate-200 bg-slate-50/50">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary mb-6">
          <Home size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum galpão cadastrado</h3>
        <p className="text-slate-400 text-center max-w-sm mb-8 font-medium">
          Sua infraestrutura física precisa estar mapeada para que você possa alocar os lotes de aves.
        </p>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-md font-black text-xs uppercase tracking-widest transition-all shadow-sm"
        >
          Adicionar Galpão
        </button>
      </div>

      {showModal && <HouseForm onClose={() => setShowModal(false)} />}
    </>
  );
}
