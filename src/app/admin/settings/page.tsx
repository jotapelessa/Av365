import { db } from "@/lib/prisma";
import { Settings, Shield, Bell, Save, AlertTriangle, Monitor, Palette } from "lucide-react";
import { updateGlobalConfig } from "./actions";

export default async function AdminSettingsPage() {
  let config;
  try {
    config = await db.globalConfig.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        systemName: "EggTrack Elite",
        primaryColor: "#4F46E5",
        secondaryColor: "#1E1B4B",
        sessionTimeoutMin: 60,
        maintenanceMode: false,
        heroTitle: "Digitalize sua Granja com Inteligência.",
        heroSubtitle: "A plataforma definitiva para gestão de lotes e controle financeiro.",
        heroCtaText: "Começar Agora",
        heroVideoUrl: "",
        featuresJson: [],
        contactEmail: "",
        contactPhone: "",
        seoTitle: "EggTrack Elite | Gestão Avícola Profissional",
        seoDescription: "Transforme sua granja com tecnologia de ponta."
      }
    });
  } catch (error: any) {
    return (
      <div className="p-10 bg-danger-bg border border-danger/20 rounded-[6px]">
        <h2 className="text-danger font-bold mb-2">Erro de Banco de Dados (Settings)</h2>
        <pre className="text-[10px] text-danger/60 overflow-auto">{error?.message || "Erro desconhecido"}</pre>
      </div>
    );
  }

  if (!config) return <div className="p-10 text-slate-500 font-bold uppercase tracking-widest text-center">Erro crítico na infraestrutura de dados.</div>;

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
          <Settings size={12} /> System Architect
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">Configurações Globais</h1>
        <p className="text-slate-500 text-sm font-medium">Parâmetros críticos da infraestrutura e regras de negócio do ecossistema.</p>
      </header>

      <form action={updateGlobalConfig as any} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Core Config Luxury */}
          <section className="p-8 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Palette size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Identidade & Branding</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nome do Sistema</label>
                <input 
                  name="systemName"
                  type="text" 
                  defaultValue={config.systemName}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Timeout de Sessão (Min)</label>
                <input 
                  name="sessionTimeoutMin"
                  type="number"
                  defaultValue={config.sessionTimeoutMin}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cor Primária</label>
                <div className="flex gap-4">
                  <input 
                    name="primaryColor"
                    type="text"
                    defaultValue={config.primaryColor}
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-black uppercase tracking-widest"
                  />
                  <div className="w-12 h-12 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: config.primaryColor }} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cor Secundária</label>
                <div className="flex gap-4">
                  <input 
                    name="secondaryColor"
                    type="text"
                    defaultValue={config.secondaryColor}
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 font-black uppercase tracking-widest"
                  />
                  <div className="w-12 h-12 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: config.secondaryColor }} />
                </div>
              </div>
            </div>
          </section>

          {/* Infrastructure Luxury */}
          <section className="p-8 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Monitor size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Assets Globais</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Logotipo (URL)</label>
                <input 
                  name="logoUrl"
                  type="text"
                  defaultValue={config.logoUrl || ''}
                  placeholder="https://..."
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Favicon (URL)</label>
                <input 
                  name="faviconUrl"
                  type="text"
                  defaultValue={config.faviconUrl || ''}
                  placeholder="https://..."
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Danger Zone Luxury */}
          <section className="p-8 rounded-[18px] bg-rose-50 border border-rose-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-rose-200/50">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl font-black text-rose-700 tracking-tight italic">Zona Crítica</h2>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest italic">Manutenção</p>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    name="maintenanceMode"
                    type="checkbox"
                    defaultChecked={config.maintenanceMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </div>
              </div>
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-tighter">Suspende acesso global.</p>
            </div>
          </section>

          <button 
            type="submit" 
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 italic"
          >
            <Save size={18} />
            <span>Salvar Master Config</span>
          </button>
          
          <div className="text-center p-6 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] italic">
              EggTrack Architect v5.1-Elite
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
