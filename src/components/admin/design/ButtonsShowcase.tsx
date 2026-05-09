'use client';

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Loader2, Trash2, CheckCircle2, ChevronRight, Zap } from "lucide-react";

// Componente de Botão Magnético para Showcase
function MagneticButton({ children, className, ...props }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className={`relative px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-[11px] transition-all duration-300 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function ButtonsShowcase() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);

  // Lógica de Confirmação em 2 Passos
  useEffect(() => {
    let timer: any;
    if (deleteStep === 1) {
      timer = setTimeout(() => setDeleteStep(0), 3000);
    }
    return () => clearTimeout(timer);
  }, [deleteStep]);

  return (
    <div className="space-y-12 bg-slate-50/50 p-10 rounded-[28px] border border-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* PRIMARY ACTIONS */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Actions</h3>
          <div className="flex flex-col gap-4">
            <MagneticButton className="bg-primary text-white shadow-[0_10px_20px_-10px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
              <span>Salvar Alterações</span>
              <ChevronRight size={14} />
            </MagneticButton>
            <button className="px-8 py-4 rounded-[24px] bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">
              Cancelar Operação
            </button>
          </div>
        </div>

        {/* STATUS ACTIONS */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status & Feedback</h3>
          <div className="flex flex-col gap-4">
            <button className="px-8 py-4 rounded-[24px] bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              <span>Lote Ativado</span>
            </button>
            <button disabled className="px-8 py-4 rounded-[24px] bg-indigo-600/50 text-white/70 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 cursor-not-allowed">
              <Loader2 size={16} className="animate-spin" />
              <span>Processando...</span>
            </button>
          </div>
        </div>

        {/* DESTRUCTIVE / SECURITY */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security & Critical</h3>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                if (deleteStep === 0) setDeleteStep(1);
                else {
                  setIsDeleting(true);
                  setTimeout(() => { setIsDeleting(false); setDeleteStep(0); }, 2000);
                }
              }}
              disabled={isDeleting}
              className={`
                px-8 py-4 rounded-[24px] font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2
                ${deleteStep === 0 ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-rose-600 text-white scale-105 shadow-xl shadow-rose-200'}
                ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>{deleteStep === 0 ? 'Remover Lote' : 'Confirmar Exclusão? (3s)'}</span>
                </>
              )}
            </button>
            <p className="text-[9px] font-bold text-slate-400 italic text-center">Ação irreversível de 2 passos.</p>
          </div>
        </div>
      </div>

      {/* ICON BUTTONS & VARIANTS */}
      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Variants & Micro-actions</h3>
        <div className="flex flex-wrap gap-6 items-center">
           <button className="p-4 rounded-md bg-white border border-slate-100 text-slate-600 shadow-sm hover:scale-110 hover:shadow-md transition-all active:scale-95 group">
             <Zap size={20} className="group-hover:text-amber-400 group-hover:fill-amber-400 transition-all" />
           </button>
           <button className="p-4 rounded-md bg-white border border-slate-100 text-slate-600 shadow-sm hover:scale-110 hover:shadow-md transition-all active:scale-95 group">
             <Trash2 size={20} className="group-hover:text-rose-500 transition-all" />
           </button>
           <button className="px-6 py-2.5 rounded-full border-2 border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all">
             Outline Small
           </button>
           <button className="px-6 py-2.5 rounded-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">
             Ghost Action
           </button>
        </div>
      </div>
    </div>
  );
}
