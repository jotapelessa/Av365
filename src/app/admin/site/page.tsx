import { db } from "@/lib/prisma";
import AdminSiteClient from "./AdminSiteClient";

export default async function AdminSitePage() {
  console.log("ADMIN_SITE_PAGE: Starting render...");
  
  let config;
  try {
    console.log("ADMIN_SITE_PAGE: Attempting upsert...");
    config = await db.globalConfig.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        systemName: "EggTrack Elite",
        heroTitle: "A Nova Era da Avicultura Digital.",
        heroSubtitle: "Otimize a conversão alimentar, reduza a mortalidade e maximize a lucratividade com inteligência artificial e dados em tempo real.",
        heroCtaText: "Iniciar Gestão de Elite",
        heroVideoUrl: "",
        featuresJson: [
          { icon: "Activity", title: "Conversão Alimentar", desc: "Acompanhamento preciso do GPD e eficiência nutricional por lote." },
          { icon: "Target", title: "Gestão por Metas", desc: "Compare o desempenho real com as linhagens genéticas em tempo real." },
          { icon: "ShieldCheck", title: "Biosseguridade 360°", desc: "Controle rigoroso de vacinação e protocolos sanitários de elite." }
        ],
        contactEmail: "",
        contactPhone: "",
        seoTitle: "EggTrack Elite | Gestão Avícola Profissional",
        seoDescription: "Transforme sua granja com tecnologia de ponta."
      }
    });
    console.log("ADMIN_SITE_PAGE: Upsert successful. Config ID:", config?.id);
  } catch (error: any) {
    console.error("ADMIN_SITE_PAGE: UPSERT ERROR:", error);
    return (
      <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-[18px]">
        <h2 className="text-rose-400 font-black mb-2 uppercase tracking-widest text-xs italic">Erro de Banco de Dados</h2>
        <pre className="text-[10px] text-rose-300 overflow-auto font-bold">{error?.message || "Erro desconhecido"}</pre>
      </div>
    );
  }

  if (!config) return <div className="p-10 text-slate-500 font-black uppercase tracking-[0.2em] text-center italic">Erro crítico na infraestrutura de dados.</div>;

  // Serialização forçada para garantir estabilidade no Client Component (Regra 7 do Manual)
  const serializedConfig = JSON.parse(JSON.stringify(config));

  return <AdminSiteClient initialConfig={serializedConfig} />;
}
