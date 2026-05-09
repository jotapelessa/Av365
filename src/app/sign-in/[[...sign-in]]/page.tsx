import { SignIn } from "@clerk/nextjs";
import { Bird } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado Esquerdo: Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.4)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.3)_0%,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-[6px] bg-indigo-600 text-white shadow-xl shadow-indigo-900/20">
            <Bird size={32} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">EggTrack <span className="text-indigo-400">Elite</span></span>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            A nova era da <br />
            <span className="text-indigo-400 italic">inteligência avícola.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
            Gestão multi-tenant de alta precisão, rastreabilidade sanitária e controle financeiro executivo em uma única plataforma.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <div className="w-12 h-px bg-slate-800" />
          AgroVantagem 365 Ecosystem
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="p-2 rounded-[6px] bg-indigo-600 text-white shadow-lg">
              <Bird size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter">EggTrack Elite</span>
          </div>

          <div className="bg-white p-10 rounded-[6px] shadow-2xl shadow-indigo-100 border border-white">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bem-vindo de volta</h1>
              <p className="text-slate-400 font-medium text-sm">Acesse sua central de controle executiva.</p>
            </div>

            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none p-0 w-full",
                  header: "hidden",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-sm font-black py-3 rounded-[6px] transition-all shadow-lg shadow-indigo-100 normal-case",
                  formFieldInput: "rounded-[6px] border-slate-200 focus:border-indigo-600 focus:ring-indigo-600 h-12 transition-all",
                  formFieldLabel: "text-slate-900 font-bold text-xs uppercase tracking-widest mb-2",
                  footer: "hidden",
                  dividerRow: "hidden",
                  socialButtonsBlockButton: "rounded-[6px] border-slate-200 hover:bg-slate-50 font-bold text-slate-600 transition-all h-12",
                  formFieldAction: "text-indigo-600 font-bold hover:text-indigo-700",
                },
              }}
            />

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Ainda não tem uma conta?{" "}
                <Link href="/sign-up" className="text-indigo-600 font-black hover:underline underline-offset-4">
                  Começar agora
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
