'use client';

import { useState } from "react";
import { 
  Palette, 
  Layout, 
  Type, 
  Box, 
  MousePointer2, 
  AlertCircle, 
  Save, 
  RotateCcw,
  Eye,
  CheckCircle2,
  Trash2,
  Plus,
  Activity,
  ShieldCheck,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateDesignConfig } from "./actions";

interface DesignConfig {
  radius: number;
  shadowIntensity: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  colors: {
    primary: string;
    success: string;
    danger: string;
    slateMain: string;
    slateMuted: string;
  };
  pastels: {
    emerald: string;
    violet: string;
    blue: string;
    amber: string;
  };
  typography: {
    headingFamily: string;
    bodyFamily: string;
    baseSize: number;
    headingItalic: boolean;
  };
  spacing: {
    containerPadding: number;
    cardPadding: number;
    gridGap: number;
    buttonPadding: number;
  };
}

const defaultConfig: DesignConfig = {
  radius: 18,
  shadowIntensity: 'md',
  colors: {
    primary: "#4f46e5",
    success: "#10b981",
    danger: "#f43f5e",
    slateMain: "#1e293b",
    slateMuted: "#64748b"
  },
  pastels: {
    emerald: "#dcfce7",
    violet: "#ede9fe",
    blue: "#e0f2fe",
    amber: "#fef3c7"
  },
  typography: {
    headingFamily: "Inter",
    bodyFamily: "Inter",
    baseSize: 16,
    headingItalic: true
  },
  spacing: {
    containerPadding: 24,
    cardPadding: 32,
    gridGap: 32,
    buttonPadding: 12
  }
};

export default function DesignEditorClient({ initialConfig }: { initialConfig?: any }) {
  const [config, setConfig] = useState<DesignConfig>(() => {
    if (!initialConfig || Object.keys(initialConfig).length === 0) return defaultConfig;
    return {
      ...defaultConfig,
      ...initialConfig,
      colors: { ...defaultConfig.colors, ...initialConfig.colors },
      pastels: { ...defaultConfig.pastels, ...initialConfig.pastels },
      typography: { ...defaultConfig.typography, ...initialConfig.typography },
      spacing: { ...defaultConfig.spacing, ...initialConfig.spacing },
    };
  });
  const [activeTab, setActiveTab] = useState<'palette' | 'typography' | 'layout' | 'components'>('palette');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (path: string, value: any) => {
    const newConfig = { ...config };
    const parts = path.split('.');
    let current: any = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("designConfig", JSON.stringify(config));
    await updateDesignConfig(formData);
    setIsSaving(false);
  };

  const getShadowClass = (intensity: string) => {
    switch(intensity) {
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      default: return '';
    }
  };

  const tabs = [
    { id: 'palette', icon: Palette, label: 'Paleta Elite' },
    { id: 'typography', icon: Type, label: 'Tipografia' },
    { id: 'layout', icon: Layout, label: 'Arquitetura' },
    { id: 'components', icon: Box, label: 'Componentes' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20">
      {/* SIDEBAR CONTROLS */}
      <div className="lg:w-1/3 space-y-8">
        <div className="bg-white rounded-[18px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Design Engine v4.0</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setConfig(defaultConfig)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors"
                title="Reset para Padrão"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all relative ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeDesignTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'palette' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Cores de Identidade</p>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(config.colors).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{key}</span>
                          <input 
                            type="color" 
                            value={val} 
                            onChange={(e) => handleUpdate(`colors.${key}`, e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Luxury Pastels</p>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(config.pastels).map(([key, val]) => (
                        <div key={key} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{key}</span>
                          <input 
                            type="color" 
                            value={val} 
                            onChange={(e) => handleUpdate(`pastels.${key}`, e.target.value)}
                            className="w-full h-8 rounded-lg cursor-pointer border-none bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'typography' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Configurações de Texto</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tamanho Base (px)</label>
                        <input 
                          type="range" min="12" max="24" 
                          value={config.typography.baseSize}
                          onChange={(e) => handleUpdate('typography.baseSize', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <p className="text-right text-[10px] font-black text-indigo-600 italic">{config.typography.baseSize}px</p>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Itálico nos Títulos</span>
                        <button 
                          onClick={() => handleUpdate('typography.headingItalic', !config.typography.headingItalic)}
                          className={`w-12 h-6 rounded-full transition-all relative ${config.typography.headingItalic ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.typography.headingItalic ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'layout' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Raio Global (Radius)</label>
                        <input 
                          type="range" min="0" max="40" 
                          value={config.radius}
                          onChange={(e) => handleUpdate('radius', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <p className="text-right text-[10px] font-black text-indigo-600 italic">{config.radius}px</p>
                      </div>

                      <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Intensidade da Sombra</label>
                        <div className="grid grid-cols-5 gap-2">
                          {['none', 'sm', 'md', 'lg', 'xl'].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleUpdate('shadowIntensity', s)}
                              className={`py-2 rounded-xl text-[8px] font-black uppercase transition-all ${
                                config.shadowIntensity === s 
                                  ? 'bg-indigo-600 text-white shadow-lg' 
                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Padding dos Cards</label>
                        <input 
                          type="range" min="8" max="64" step="8"
                          value={config.spacing.cardPadding}
                          onChange={(e) => handleUpdate('spacing.cardPadding', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <p className="text-right text-[10px] font-black text-indigo-600 italic">{config.spacing.cardPadding}px</p>
                      </div>

                      <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Espaçamento Grid (Gap)</label>
                        <input 
                          type="range" min="8" max="64" step="8"
                          value={config.spacing.gridGap}
                          onChange={(e) => handleUpdate('spacing.gridGap', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <p className="text-right text-[10px] font-black text-indigo-600 italic">{config.spacing.gridGap}px</p>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'components' && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anatomia de Botões</p>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vertical Padding (px)</label>
                        <input 
                          type="range" min="4" max="24" 
                          value={config.spacing.buttonPadding}
                          onChange={(e) => handleUpdate('spacing.buttonPadding', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <p className="text-right text-[10px] font-black text-indigo-600 italic">{config.spacing.buttonPadding}px</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ecossistema de Ícones</p>
                     <div className="grid grid-cols-4 gap-4">
                        {[Activity, Zap, ShieldCheck, TrendingUp].map((Icon, i) => (
                          <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                            <Icon size={20} />
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sistema de Alertas</p>
                     <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-700 uppercase italic">Sucesso Bio-Operacional</span>
                        </div>
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                          <Trash2 size={14} className="text-rose-500" />
                          <span className="text-[9px] font-black text-rose-700 uppercase italic">Risco de Sanidade Detectado</span>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 italic"
            >
              {isSaving ? "Sincronizando..." : <><Save size={14} /> Publicar Master</>}
            </button>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW AREA */}
      <div className="lg:w-2/3">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <Eye size={16} className="text-indigo-600" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Live Elite Preview</h3>
            </div>
            <p className="text-[9px] font-bold text-slate-300 italic">Visualização em tempo real</p>
          </div>

          <div 
            className="p-12 bg-slate-50 border border-slate-200 rounded-[32px] min-h-[600px] shadow-inner-sm transition-all duration-500"
            style={{ padding: `${config.spacing.containerPadding}px` }}
          >
            <div className="space-y-12" style={{ gap: `${config.spacing.gridGap}px` }}>
              {/* PREVIEW HEADER */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.colors.primary }} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Preview Mode</span>
                </div>
                <h1 
                  className="font-black tracking-tight leading-none" 
                  style={{ 
                    fontSize: `${config.typography.baseSize * 3}px`, 
                    color: config.colors.slateMain,
                    fontStyle: config.typography.headingItalic ? 'italic' : 'normal'
                  }}
                >
                  Gestão Bio-SaaS
                </h1>
                <p className="text-slate-500 font-medium max-w-lg leading-relaxed" style={{ fontSize: `${config.typography.baseSize}px` }}>
                  O equilíbrio perfeito entre a robustez do campo e a precisão tecnológica do EggTrack Elite.
                </p>
              </div>

              {/* PREVIEW CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gap: `${config.spacing.gridGap}px` }}>
                <div 
                  className={`bg-white border border-slate-200 transition-all hover:shadow-md ${getShadowClass(config.shadowIntensity)}`}
                  style={{ borderRadius: `${config.radius}px`, padding: `${config.spacing.cardPadding}px` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="p-3 rounded-2xl shadow-sm border"
                      style={{ backgroundColor: config.pastels.emerald, color: config.colors.success, borderColor: config.colors.success + '20' }}
                    >
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio-Status</span>
                  </div>
                  <h3 className="text-xl font-black italic mb-2" style={{ color: config.colors.slateMain }}>Saúde do Lote</h3>
                  <p className="text-sm font-medium text-slate-500 italic">Lote Sul-01 • 98% Vitalidade</p>
                </div>

                <div 
                  className={`bg-white border border-slate-200 transition-all hover:shadow-md ${getShadowClass(config.shadowIntensity)}`}
                  style={{ borderRadius: `${config.radius}px`, padding: `${config.spacing.cardPadding}px` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="p-3 rounded-2xl shadow-sm border"
                      style={{ backgroundColor: config.pastels.violet, color: config.colors.primary, borderColor: config.colors.primary + '20' }}
                    >
                      <MousePointer2 size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ações Master</span>
                  </div>
                  <div className="space-y-4">
                    <button 
                      className={`w-full font-black text-[10px] uppercase tracking-widest transition-all italic ${getShadowClass(config.shadowIntensity)}`}
                      style={{ 
                        backgroundColor: config.colors.primary, 
                        color: 'white', 
                        borderRadius: `${config.radius / 1.5}px`,
                        padding: `${config.spacing.buttonPadding}px 0`
                      }}
                    >
                      Processar Lote
                    </button>
                    <button 
                      className="w-full border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                      style={{ 
                        borderRadius: `${config.radius / 1.5}px`,
                        padding: `${config.spacing.buttonPadding}px 0`
                      }}
                    >
                      Auditoria
                    </button>
                  </div>
                </div>
              </div>

              {/* PREVIEW ALERTS */}
              <div className="space-y-4">
                <div 
                  className={`p-4 border flex items-center gap-4 transition-all ${getShadowClass(config.shadowIntensity)}`}
                  style={{ backgroundColor: config.pastels.amber, borderColor: config.colors.slateMuted + '20', borderRadius: `${config.radius}px` }}
                >
                   <div className="p-2 bg-white rounded-lg shadow-sm">
                     <AlertCircle size={18} className="text-amber-600" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-amber-900 italic">Alerta de Ambiência</p>
                     <p className="text-xs font-bold text-amber-700/80">Temperatura oscilando no Galpão 04.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
