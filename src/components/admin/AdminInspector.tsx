'use client';

import { useState, useEffect, useRef } from "react";
import { 
  Monitor, 
  Smartphone, 
  Tablet as TabletIcon, 
  Lightbulb, 
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
  Columns
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { reportUIIssue } from "@/app/admin/actions-audit";
import { useLayout } from "./LayoutContext";

interface AdminInspectorProps {
  isAdmin: boolean;
}

export default function AdminInspector({ isAdmin }: AdminInspectorProps) {
  const { configs, activeViewport, setActiveViewport, updateLayout } = useLayout();
  
  const [viewport, setViewport] = useState("Desktop");
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<{ id: string; rect: DOMRect } | null>(null);
  
  // States para Auditoria
  const [isReporting, setIsReporting] = useState(false);
  const [reportData, setReportData] = useState<{ types: string[]; description: string }>({ 
    types: ["Layout"], 
    description: "" 
  });

  // States para Orquestrador de Layout
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  
  const pathname = usePathname();
  const lastElementRef = useRef<HTMLElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);
      let v = "Desktop";
      if (w < 640) v = "Smartphone";
      else if (w < 1024) v = "Tablet";
      
      setViewport(v);
      setActiveViewport(v); // Sincroniza com o Contexto de Layout
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isReporting || isOrchestrating) return;

      const target = e.target as HTMLElement;
      if (target.closest('.audit-bulb-trigger') || target.closest('.layout-orchestrator-trigger')) return;

      let auditElement = target.closest('[data-audit]') as HTMLElement;

      // Se o elemento capturado estiver dentro de um card orquestrável, prioriza o card
      if (auditElement) {
        const parentCard = auditElement.closest('.bento-card-elite[data-audit]') as HTMLElement;
        if (parentCard) {
          auditElement = parentCard;
        }
      }

      if (auditElement) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }

        if (lastElementRef.current !== auditElement) {
          lastElementRef.current = auditElement;
          setHoveredElement({
            id: auditElement.getAttribute('data-audit') || 'unnamed-element',
            rect: auditElement.getBoundingClientRect()
          });
        }
      } else {
        if (!hideTimeoutRef.current) {
          hideTimeoutRef.current = setTimeout(() => {
            lastElementRef.current = null;
            setHoveredElement(null);
            hideTimeoutRef.current = null;
          }, 300);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isAdmin, isReporting, isOrchestrating, setActiveViewport]);

  if (!isAdmin || !isVisible) {
    if (isAdmin && !isVisible) {
       return (
         <button 
           onClick={() => setIsVisible(true)}
           className="fixed bottom-4 right-4 z-[9999] p-3 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-all border border-white/20"
         >
           <ShieldCheck size={20} className="text-indigo-400" />
         </button>
       );
    }
    return null;
  }

  const handleApplyLayout = async (span: number, order?: number) => {
    if (!hoveredElement) return;
    
    toast.promise(updateLayout(hoveredElement.id, span, order), {
      loading: `Orquestrando layout ${activeViewport}...`,
      success: `Layout ${activeViewport} atualizado!`,
      error: 'Erro ao persistir layout.'
    });
    
    setIsOrchestrating(false);
  };

  const handleSubmitReport = async () => {
    if (!hoveredElement) return;
    if (reportData.types.length === 0) {
      toast.error("Selecione pelo menos um tipo de problema.");
      return;
    }

    try {
      const res = await reportUIIssue({
        elementId: hoveredElement.id,
        pageUrl: pathname,
        viewport,
        issueType: reportData.types.join(", "),
        description: reportData.description
      });

      if (res.success) {
        toast.success("Feedback enviado para auditoria!");
        setIsReporting(false);
        setReportData({ types: ["Layout"], description: "" });
      }
    } catch (err) {
      toast.error("Erro crítico no reporte.");
    }
  };

  return (
    <>
      {/* BARRA DE VIEWPORT (TOP) */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-8 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 no-print overflow-hidden shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Orquestrador {activeViewport} Elite</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
             {viewport === "Smartphone" && <Smartphone size={12} className="text-rose-400" />}
             {viewport === "Tablet" && <TabletIcon size={12} className="text-amber-400" />}
             {viewport === "Desktop" && <Monitor size={12} className="text-emerald-400" />}
             <span className={`text-[10px] font-black uppercase tracking-tighter ${
               viewport === "Smartphone" ? "text-rose-400" : 
               viewport === "Tablet" ? "text-amber-400" : "text-emerald-400"
             }`}>
               {viewport} <span className="text-white/40 ml-1">({width}px)</span>
             </span>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-white/40 hover:text-white transition-colors">
          <X size={14} />
        </button>
      </motion.div>

      {/* ÍCONES FLUTUANTES (LÂMPADA E GRID) */}
      <AnimatePresence>
        {hoveredElement && !isReporting && !isOrchestrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: hoveredElement.rect.left + hoveredElement.rect.width - 24,
              top: hoveredElement.rect.top - 12
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed z-[9999] flex flex-col items-center gap-1.5 pointer-events-auto"
          >
            <button
              onClick={() => setIsReporting(true)}
              className="p-2 bg-amber-400 text-slate-900 rounded-full shadow-xl border-2 border-white hover:bg-amber-300 active:scale-90 transition-all audit-bulb-trigger"
              title="Reportar problema"
            >
              <Lightbulb size={16} className="fill-slate-900" />
            </button>

            <button
              onClick={() => setIsOrchestrating(true)}
              className="p-2 bg-indigo-600 text-white rounded-full shadow-xl border-2 border-white hover:bg-indigo-500 active:scale-90 transition-all layout-orchestrator-trigger"
              title={`Orquestrar Layout (${activeViewport})`}
            >
              <LayoutGrid size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DO ORQUESTRADOR DE LAYOUT */}
      <AnimatePresence>
        {isOrchestrating && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOrchestrating(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-8 border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic leading-none text-indigo-600">Layout {activeViewport}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Personalização Responsiva</p>
                </div>
                <button onClick={() => setIsOrchestrating(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 block">Presets de Largura (Span)</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { v: 3, l: '25%' },
                      { v: 4, l: '33%' },
                      { v: 6, l: '50%' },
                      { v: 8, l: '66%' },
                      { v: 12, l: '100%' }
                    ].map((s) => (
                      <button
                        key={s.v}
                        onClick={() => handleApplyLayout(s.v, configs[hoveredElement?.id || '']?.order)}
                        className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all border ${
                          configs[hoveredElement?.id || '']?.span === s.v
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="h-6 w-full flex items-center justify-center">
                           <Columns size={14} className={s.v === 12 ? 'scale-x-150' : s.v <= 4 ? 'scale-x-50' : ''} />
                        </div>
                        <span className="text-[8px] font-black">{s.l}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 block">Prioridade ({activeViewport})</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleApplyLayout(configs[hoveredElement?.id || '']?.span || 12, -100)} className="flex items-center justify-center gap-3 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"><ArrowUp size={14} /> Topo</button>
                      <button onClick={() => handleApplyLayout(configs[hoveredElement?.id || '']?.span || 12, 100)} className="flex items-center justify-center gap-3 py-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"><ArrowDown size={14} /> Fim</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReporting && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsReporting(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8 border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic leading-none">Reportar Feedback</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Elemento: <span className="text-indigo-600">{hoveredElement?.id}</span></p>
                </div>
                <button onClick={() => setIsReporting(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block">Tipos de Problema</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Layout', 'Texto', 'Gráfico', 'Bug', 'Responsividade', 'Outro'].map((t) => (
                      <button key={t} onClick={() => setReportData(p => ({...p, types: p.types.includes(t) ? p.types.filter(x => x !== t) : [...p.types, t]}))} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${reportData.types.includes(t) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-slate-200'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block">Descrição Detalhada</label>
                  <textarea value={reportData.description} onChange={(e) => setReportData(p => ({...p, description: e.target.value}))} placeholder="O que está errado?" className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" />
                </div>
                <button onClick={handleSubmitReport} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"><Send size={18} /> Enviar Feedback</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
