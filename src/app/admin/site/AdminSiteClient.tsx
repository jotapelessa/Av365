'use client';

import { useState, useTransition } from 'react';
import { Globe, Eye, Save, Layout, Image, Info, Zap, Activity, Target, ShieldCheck, Bird, BarChart3, Plus, X, Truck, Landmark, PlayCircle, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updateHomepageConfig } from "./actions";

const ICON_OPTIONS = [
  { value: "Activity", label: "Atividade", icon: Activity },
  { value: "Target", label: "Meta", icon: Target },
  { value: "ShieldCheck", label: "Segurança", icon: ShieldCheck },
  { value: "Bird", label: "Ave", icon: Bird },
  { value: "BarChart3", label: "Gráfico", icon: BarChart3 },
];

export default function AdminSiteClient({ initialConfig }: { initialConfig: any }) {
  const [isPending, startTransition] = useTransition();
  const [designConfig, setDesignConfig] = useState(
    initialConfig.designConfig || {
      tacTitle: "Centro de Comando Tático.",
      tacDesc: "A interface que os maiores produtores do Brasil utilizam para gerenciar milhares de aves com um clique.",
      premiumTitle: "O Futuro é Premium.",
      premiumDesc: "A escala definitiva para grupos produtores de alta performance que não aceitam nada menos que o topo do mercado.",
      roiTitle: "ROI Avícola",
      roiDesc: "Junte-se a mais de 500 granjas de elite que já digitalizaram sua lucratividade.",
      opTitle: "Cadeia de Suprimentos.",
      opDesc: "Logística preditiva e controle de estoque ininterrupto. Nunca pare a produção por falta de insumos críticos.",
      bioTitle: "Proteção Total do Plantel.",
      bioDesc: "Protocolos sanitários rígidos, histórico de vacinação inalterável e monitoramento de vazio sanitário automatizado.",
      finTitle: "Sua Granja, um Ativo de Elite.",
      finDesc: "Conciliação bancária automática, DRE por lote e gestão de fornecedores integrada. Visualize a rentabilidade real de cada ave em tempo real.",
      expertTitle: "Insight de IA Agrotech",
      expertDesc: "Aumento de 2ppm de Amônia detectado no Galpão 04. Recomendado ajuste automático de exaustores em +15%.",
      nh3Value: "8ppm",
      nh3Status: "Ideal",
      humValue: "62%",
      humStatus: "Monitorar"
    }
  );

  const [features, setFeatures] = useState<any[]>(initialConfig.featuresJson || []);

  const addFeature = () => {
    if (features.length >= 6) {
      toast.error("Máximo de 6 diferenciais atingido.");
      return;
    }
    setFeatures([...features, { icon: "Activity", title: "", desc: "" }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  const updateDesignConfig = (field: string, value: string) => {
    setDesignConfig({ ...designConfig, [field]: value });
  };

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Adiciona designConfig como string JSON no formData
      formData.append('designConfig', JSON.stringify(designConfig));
      try {
        const result = await updateHomepageConfig(formData);
        if (result.success) {
          toast.success("Configurações publicadas com sucesso!");
        } else {
          toast.error(result.error || "Erro ao publicar.");
        }
      } catch (error) {
        toast.error("Erro crítico na comunicação.");
      }
    });
  }

  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'general', label: 'Geral & SEO', icon: Globe },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'tactical', label: 'Comando Tático', icon: Activity },
    { id: 'supply', label: 'Suprimentos', icon: Truck },
    { id: 'finance', label: 'Financeiro', icon: Landmark },
    { id: 'roi', label: 'Premium & ROI', icon: Target },
  ];

  return (
    <form action={handleSubmit} className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 sticky top-0 z-40 bg-[#f8fafc]/90 backdrop-blur-xl py-6 -mx-4 px-4 border-b border-slate-200/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Globe size={12} /> Design System Architect
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">CMS de Elite <span className="text-indigo-600">v2.0</span></h1>
          <p className="text-slate-500 text-sm font-medium">Controle total sobre a experiência visual da Agrotech 365.</p>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/" 
            target="_blank"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center gap-2 shadow-sm italic"
          >
            <Eye size={14} /> View Live
          </Link>
          <button 
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 italic"
          >
            {isPending ? <Activity className="animate-spin" size={14} /> : <Save size={14} />}
            {isPending ? "Sincronizando..." : "Publicar Design"}
          </button>
        </div>
      </header>

      {/* Modern Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 rounded-3xl border border-slate-200/50 sticky top-[116px] z-30 shadow-sm backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-white text-indigo-600 shadow-md scale-105' 
              : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="space-y-10">
          {/* 1. SEÇÃO HERO */}
          {activeTab === 'hero' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Seção Hero (Elite)</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A porta de entrada da sua marca</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Título de Impacto</label>
                    <input 
                      name="heroTitle"
                      type="text" 
                      defaultValue={initialConfig.heroTitle}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-lg text-slate-900 font-black italic focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subtítulo Estratégico</label>
                    <textarea 
                      name="heroSubtitle"
                      rows={4}
                      defaultValue={initialConfig.heroSubtitle}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-600 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all italic leading-relaxed"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Botão de Ação (CTA)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
                        <MousePointer2 size={16} />
                      </div>
                      <input 
                        name="heroCtaText"
                        type="text" 
                        placeholder="Ex: Começar Agora"
                        defaultValue={initialConfig.heroCtaText}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">URL do Vídeo (Background)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <PlayCircle size={16} />
                      </div>
                      <input 
                        name="heroVideoUrl"
                        type="text" 
                        placeholder="https://..."
                        defaultValue={initialConfig.heroVideoUrl}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-mono focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic mb-6">Design & Tipografia</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tamanho Fonte</label>
                      <select 
                        value={designConfig.heroTitleSize || 'text-7xl'}
                        onChange={(e) => updateDesignConfig('heroTitleSize', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="text-5xl">Pequeno (5xl)</option>
                        <option value="text-6xl">Médio (6xl)</option>
                        <option value="text-7xl">Grande (7xl)</option>
                        <option value="text-8xl">Elite (8xl)</option>
                        <option value="text-[120px]">Ultra (120px)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cor do Título</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={designConfig.heroTitleColor || '#0f172a'}
                          onChange={(e) => updateDesignConfig('heroTitleColor', e.target.value)}
                          className="w-12 h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={designConfig.heroTitleColor || '#0f172a'}
                          onChange={(e) => updateDesignConfig('heroTitleColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Background do Galpão (URL)</label>
                    <input 
                      type="text" 
                      value={designConfig.heroBgUrl || ''}
                      onChange={(e) => updateDesignConfig('heroBgUrl', e.target.value)}
                      placeholder="/images/hero-bg.png"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. COMANDO TÁTICO & SHOWCASES */}
          {activeTab === 'tactical' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Centro de Comando (Showcases)</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestão das seções operacionais e táticas</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Tactical Command */}
                  <div className="space-y-6 p-8 rounded-3xl bg-indigo-50/50 border border-indigo-100">
                    <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest italic border-l-4 border-indigo-500 pl-4">1. Comando Tático</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Título do Comando</label>
                        <input 
                          type="text" 
                          value={designConfig.tacTitle || ""}
                          onChange={(e) => updateDesignConfig('tacTitle', e.target.value)}
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-black italic focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Descrição Tática</label>
                        <textarea 
                          rows={3}
                          value={designConfig.tacDesc || ""}
                          onChange={(e) => updateDesignConfig('tacDesc', e.target.value)}
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-bold italic focus:border-indigo-400 outline-none resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-100">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cor Título</label>
                          <input 
                            type="color" 
                            value={designConfig.tacTitleColor || '#ffffff'}
                            onChange={(e) => updateDesignConfig('tacTitleColor', e.target.value)}
                            className="w-full h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fonte</label>
                          <select 
                            value={designConfig.tacTitleSize || 'text-7xl'}
                            onChange={(e) => updateDesignConfig('tacTitleSize', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold"
                          >
                            <option value="text-5xl">5xl</option>
                            <option value="text-6xl">6xl</option>
                            <option value="text-7xl">7xl</option>
                            <option value="text-8xl">8xl</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 p-8 bg-slate-900 rounded-[32px] border border-white/5 text-white">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic mb-6">Visual & Ambientação</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Background Image (URL)</label>
                        <input 
                          type="text" 
                          value={designConfig.tacBgUrl || ''}
                          onChange={(e) => updateDesignConfig('tacBgUrl', e.target.value)}
                          placeholder="/images/tactical-bg.png"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-medium outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Brilho da Imagem</label>
                        <input 
                          type="range" 
                          min="0" max="100"
                          value={designConfig.tacBgBrightness || 20}
                          onChange={(e) => updateDesignConfig('tacBgBrightness', e.target.value)}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. CADEIA DE SUPRIMENTOS */}
          {activeTab === 'supply' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="p-4 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100">
                  <Truck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Cadeia de Suprimentos</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controle de insumos e logística preditiva</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Título da Seção</label>
                    <input 
                      type="text" 
                      value={designConfig.opTitle || ""}
                      onChange={(e) => updateDesignConfig('opTitle', e.target.value)}
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-black italic focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Descrição Logística</label>
                    <textarea 
                      rows={3}
                      value={designConfig.opDesc || ""}
                      onChange={(e) => updateDesignConfig('opDesc', e.target.value)}
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-bold italic focus:border-indigo-400 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic mb-4">Aparência Visual</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Background Image (URL)</label>
                      <input 
                        type="text" 
                        value={designConfig.opBgUrl || ''}
                        onChange={(e) => updateDesignConfig('opBgUrl', e.target.value)}
                        placeholder="/images/supply-bg.png"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-medium outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tamanho Fonte</label>
                        <select 
                          value={designConfig.opTitleSize || 'text-7xl'}
                          onChange={(e) => updateDesignConfig('opTitleSize', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold"
                        >
                          <option value="text-6xl">6xl</option>
                          <option value="text-7xl">7xl</option>
                          <option value="text-8xl">8xl</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cor Título</label>
                        <input 
                          type="color" 
                          value={designConfig.opTitleColor || '#0f172a'}
                          onChange={(e) => updateDesignConfig('opTitleColor', e.target.value)}
                          className="w-full h-10 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. COMANDO FINANCEIRO */}
          {activeTab === 'finance' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Landmark size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Comando Financeiro</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DRE, fluxo de caixa e gestão de ativos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Título Financeiro</label>
                    <input 
                      type="text" 
                      value={designConfig.finTitle || ""}
                      onChange={(e) => updateDesignConfig('finTitle', e.target.value)}
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-black italic focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Descrição de Lucratividade</label>
                    <textarea 
                      rows={3}
                      value={designConfig.finDesc || ""}
                      onChange={(e) => updateDesignConfig('finDesc', e.target.value)}
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-bold italic focus:border-indigo-400 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-slate-900 rounded-[32px] border border-white/5 text-white shadow-2xl">
                  <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest italic mb-4">Luxury Dark Style</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fonte Título</label>
                      <select 
                        value={designConfig.finTitleSize || 'text-7xl'}
                        onChange={(e) => updateDesignConfig('finTitleSize', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold"
                      >
                        <option value="text-6xl">6xl</option>
                        <option value="text-7xl">7xl</option>
                        <option value="text-8xl">8xl</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cor Título</label>
                      <input 
                        type="color" 
                        value={designConfig.finTitleColor || '#ffffff'}
                        onChange={(e) => updateDesignConfig('finTitleColor', e.target.value)}
                        className="w-full h-10 p-1 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. PREMIUM & ROI */}
          {activeTab === 'roi' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Elite High Stakes (ROI)</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversão final e ROI de elite</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">A) Seção de Escala</h4>
                    <input 
                      type="text" 
                      value={designConfig.premiumTitle || ""}
                      onChange={(e) => updateDesignConfig('premiumTitle', e.target.value)}
                      placeholder="Título de Escala"
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-black italic outline-none"
                    />
                    <textarea 
                      rows={2}
                      value={designConfig.premiumDesc || ""}
                      onChange={(e) => updateDesignConfig('premiumDesc', e.target.value)}
                      className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold italic outline-none"
                    />
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-600 border border-indigo-400 space-y-4 text-white">
                    <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest italic">B) CTA Final de ROI</h4>
                    <input 
                      type="text" 
                      value={designConfig.roiTitle || ""}
                      onChange={(e) => updateDesignConfig('roiTitle', e.target.value)}
                      placeholder="Título ROI"
                      className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-black italic outline-none text-white"
                    />
                    <textarea 
                      rows={2}
                      value={designConfig.roiDesc || ""}
                      onChange={(e) => updateDesignConfig('roiDesc', e.target.value)}
                      className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold italic outline-none text-indigo-100"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-slate-950 rounded-[40px] border border-white/10 shadow-3xl text-white">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic mb-4">ROI Section Design</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Background ROI (URL)</label>
                      <input 
                        type="text" 
                        value={designConfig.roiBgUrl || ''}
                        onChange={(e) => updateDesignConfig('roiBgUrl', e.target.value)}
                        placeholder="/images/roi-bg.png"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white font-medium outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fonte ROI</label>
                        <select 
                          value={designConfig.roiTitleSize || 'text-7xl'}
                          onChange={(e) => updateDesignConfig('roiTitleSize', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold"
                        >
                          <option value="text-6xl">6xl</option>
                          <option value="text-7xl">7xl</option>
                          <option value="text-8xl">8xl</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cor Título</label>
                        <input 
                          type="color" 
                          value={designConfig.roiTitleColor || '#ffffff'}
                          onChange={(e) => updateDesignConfig('roiTitleColor', e.target.value)}
                          className="w-full h-10 p-1 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. GERAL & SEO */}
          {activeTab === 'general' && (
            <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Globe size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Configurações Globais</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidade do sistema e SEO</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título SEO (Browser Tab)</label>
                    <input 
                      name="seoTitle"
                      type="text" 
                      defaultValue={initialConfig.seoTitle}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-400 outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição SEO (Meta)</label>
                    <textarea 
                      name="seoDescription"
                      rows={3}
                      defaultValue={initialConfig.seoDescription}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic mb-4">Contatos & Suporte</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Público</label>
                      <input 
                        name="contactEmail"
                        type="email" 
                        defaultValue={initialConfig.contactEmail}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefone</label>
                      <input 
                        name="contactPhone"
                        type="text" 
                        defaultValue={initialConfig.contactPhone}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                        <ShieldCheck size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Modo Manutenção</span>
                    </div>
                    <input 
                      name="maintenanceMode"
                      type="checkbox" 
                      defaultChecked={initialConfig.maintenanceMode}
                      className="w-12 h-6 rounded-full bg-slate-200 border-none focus:ring-0 cursor-pointer appearance-none checked:bg-rose-500 transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-6"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Features Section Luxury */}
          <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Layout size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Diferenciais em Lista</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cards rápidos de tecnologia</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature: any, i: number) => (
                <div key={i} className="space-y-6 p-8 rounded-[24px] bg-slate-50 border border-slate-100 relative group hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all duration-500">
                  <button 
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="absolute top-4 right-4 p-2 bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>

                  <div className="flex gap-4 items-start">
                    <div className="space-y-3 flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Ícone</label>
                      <div className="flex gap-2 flex-wrap">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateFeature(i, 'icon', opt.value)}
                            className={`p-2.5 rounded-xl border transition-all ${
                              feature.icon === opt.value 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                              : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200'
                            }`}
                          >
                            <opt.icon size={16} />
                          </button>
                        ))}
                      </div>
                      <input type="hidden" name={`featureIcon_${i}`} value={feature.icon} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
                    <input 
                      name={`featureTitle_${i}`}
                      type="text" 
                      placeholder="Ex: Inteligência Nutricional"
                      value={feature.title || ""}
                      onChange={(e) => updateFeature(i, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-black uppercase tracking-widest focus:border-indigo-400 outline-none italic"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                    <textarea 
                      name={`featureDesc_${i}`}
                      placeholder="Descrição técnica..."
                      value={feature.desc || ""}
                      onChange={(e) => updateFeature(i, 'desc', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-[11px] text-slate-500 font-bold italic resize-none outline-none leading-relaxed h-24 focus:border-indigo-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* SEO & Brand Section */}
          <section className="p-10 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Globe size={20} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Visibilidade & SEO</h3>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Index Title</label>
                <input 
                  name="seoTitle"
                  type="text" 
                  defaultValue={initialConfig.seoTitle}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-900 font-black italic focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Index Description</label>
                <textarea 
                  name="seoDescription"
                  rows={4}
                  defaultValue={initialConfig.seoDescription}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 font-bold italic focus:bg-white outline-none leading-relaxed transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
