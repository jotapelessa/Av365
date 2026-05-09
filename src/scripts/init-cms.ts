import { db } from "../lib/prisma";

async function initializeCMS() {
  console.log("🚀 Iniciando o EggTrack CMS...");
  
  try {
    const config = await db.globalConfig.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        systemName: "EggTrack Elite",
        heroTitle: "Digitalize sua Granja com Inteligência.",
        heroSubtitle: "A plataforma definitiva para gestão de lotes e controle financeiro.",
        heroCtaText: "Começar Agora",
        featuresJson: [
          { icon: "Bird", title: "Gestão de Lotes", desc: "Controle total do ciclo de vida das aves." },
          { icon: "BarChart3", title: "Analytics", desc: "Transforme dados em rentabilidade real." },
          { icon: "ShieldCheck", title: "Biosseguridade", desc: "Alertas inteligentes de sanidade e vacinas." }
        ]
      }
    });

    console.log("✅ CMS Inicializado com Sucesso!");
    console.log("Configurações Atuais:", config.systemName);
  } catch (error) {
    console.error("❌ Falha ao inicializar o CMS:", error);
  }
}

initializeCMS();
