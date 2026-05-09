import Link from "next/link";
import { ShieldAlert, Construction, CreditCard, ArrowLeft } from "lucide-react";

export default async function BlockedPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;

  const options = {
    maintenance: {
      icon: <Construction size={48} className="text-amber-500" />,
      title: "Manutenção em Curso",
      description: "Estamos realizando melhorias estruturais no EggTrack Elite. Voltaremos em instantes com um sistema ainda mais potente.",
      cta: "Verificar Novamente"
    },
    paused: {
      icon: <CreditCard size={48} className="text-rose-500" />,
      title: "Assinatura Pausada",
      description: "O acesso à sua granja foi temporariamente suspenso. Por favor, regularize sua situação financeira ou contate o administrador.",
      cta: "Falar com Suporte"
    },
    canceled: {
      icon: <ShieldAlert size={48} className="text-slate-500" />,
      title: "Acesso Encerrado",
      description: "Sua assinatura foi cancelada. Se você deseja reativar sua conta e recuperar seus dados, entre em contato conosco.",
      cta: "Reativar Agora"
    }
  };

  const content = (reason && reason in options ? options[reason as keyof typeof options] : null) || {
    icon: <ShieldAlert size={48} className="text-indigo-500" />,
    title: "Acesso Restrito",
    description: "Houve um problema ao validar seu acesso. Por favor, tente novamente ou contate o suporte técnico.",
    cta: "Voltar ao Início"
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="p-6 rounded-[6px] bg-slate-50 border border-slate-100 shadow-xl shadow-slate-100/50">
            {content.icon}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{content.title}</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 text-white font-black rounded-[6px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            {content.cta}
          </Link>
          
          <Link 
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Tentar outro Login
          </Link>
        </div>

        <div className="pt-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            EggTrack <span className="text-indigo-400">Security Engine</span>
          </p>
        </div>
      </div>
    </div>
  );
}
