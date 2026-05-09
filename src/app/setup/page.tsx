'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bird, 
  Check, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  Loader2 
} from "lucide-react";
import { completeSetup } from "./actions";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const plans = [
  {
    id: "bronze",
    name: "Bronze",
    subtitle: "Ideal para produtores iniciantes",
    price: "97",
    color: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    text: "text-orange-600",
    icon: Bird,
    features: ["Até 1 Galpão", "Até 2 Lotes Ativos", "Relatórios Zootécnicos Básicos", "Suporte via E-mail"]
  },
  {
    id: "silver",
    name: "Prata",
    subtitle: "O padrão para granjas em crescimento",
    price: "197",
    color: "from-slate-50 to-slate-200",
    border: "border-slate-300",
    text: "text-slate-600",
    icon: ShieldCheck,
    popular: true,
    features: ["Até 5 Galpões", "Até 10 Lotes Ativos", "Relatórios Avançados", "Gestão Financeira Base", "Suporte Prioritário"]
  },
  {
    id: "gold",
    name: "Ouro",
    subtitle: "Experiência completa de elite",
    price: "397",
    color: "from-yellow-50 to-yellow-100",
    border: "border-yellow-300",
    text: "text-yellow-600",
    icon: Crown,
    features: ["Galpões Ilimitados", "Lotes Ilimitados", "Ecossistema Financeiro Completo", "Consultoria Zootécnica Integrada", "Suporte VIP 24/7"]
  }
];

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [farmName, setFarmName] = useState("");
  const [capacity, setCapacity] = useState("0");
  const [purpose, setPurpose] = useState("POSTURA");
  const [housingSystem, setHousingSystem] = useState("CONVENTIONAL");

  const nextStep = () => setStep(s => s + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await completeSetup({
        farmName,
        capacity: Number(capacity),
        purpose,
        housingSystem,
        planId: selectedPlan
      });
      nextStep();
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao configurar sua granja.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden flex flex-col items-center py-12 px-4 selection:bg-indigo-100">
      {/* LUXURY BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50/50 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="max-w-3xl w-full text-center mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 rounded-[24px] bg-white shadow-2xl shadow-indigo-100/50 border border-indigo-50 text-indigo-600 mb-8"
        >
          <Zap size={28} className="fill-indigo-600" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6 leading-[0.9]"
        >
          Experiência <span className="text-indigo-600 italic">Elite</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] ml-1"
        >
          Configuração de Granja Profissional
        </motion.p>
      </header>

      {/* STEPS INDICATOR */}
      <div className="flex items-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500
              ${step === s ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : step > s ? 'bg-success text-white' : 'bg-slate-100 text-slate-400'}
            `}>
              {step > s ? <Check size={16} /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-success' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      <main className="max-w-6xl w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`
                    relative group cursor-pointer bg-white rounded-[28px] border-2 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2
                    ${selectedPlan === plan.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Sparkles size={10} className="fill-white" /> Recomendado
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-[6px] bg-gradient-to-br ${plan.color} ${plan.text} flex items-center justify-center mb-6`}>
                    <plan.icon size={28} />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-6">{plan.subtitle}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-slate-400 font-bold text-sm">R$</span>
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 font-medium text-sm">/mês</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-4 h-4 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-slate-600 text-sm font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <LuxuryButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                      nextStep();
                    }}
                    variant={selectedPlan === plan.id ? 'secondary' : 'outline'}
                    fullWidth
                    icon="arrow-right"
                    iconPosition="right"
                  >
                    Selecionar Plano
                  </LuxuryButton>
                </div>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto bg-white rounded-[32px] border border-slate-100 p-10 shadow-xl shadow-indigo-50/50"
            >
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">Detalhes da sua Granja</h2>
              <p className="text-slate-500 font-medium mb-8">Precisamos de alguns dados técnicos para calibrar seus relatórios.</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 rounded-[6px] bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider border border-rose-100">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Operação</label>
                    <input 
                      required
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="Ex: Granja Vale do Sol"
                      className="w-full h-14 px-5 rounded-[6px] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidade de Aves</label>
                    <input 
                      type="number"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Ex: 5000"
                      className="w-full h-14 px-5 rounded-[6px] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 font-medium transition-all"
                      name="capacity"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Finalidade da Produção</label>
                  <select 
                    required 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full h-14 px-5 rounded-[6px] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 font-medium appearance-none"
                  >
                    <option value="POSTURA">Postura (Ovos)</option>
                    <option value="CORTE">Corte (Carne)</option>
                    <option value="RECRIA">Recria</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sistema de Alojamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['CONVENTIONAL', 'AUTOMATED', 'DARK_HOUSE'].map((sys) => (
                      <button 
                        key={sys}
                        type="button"
                        onClick={() => setHousingSystem(sys)}
                        className={`
                          py-3 px-2 rounded-[6px] text-[10px] font-black uppercase tracking-tighter transition-all active:scale-95 border
                          ${housingSystem === sys 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                            : 'bg-slate-50 text-slate-500 border-transparent hover:border-indigo-200'}
                        `}
                      >
                        {sys.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <LuxuryButton 
                  type="submit"
                  isLoading={isSubmitting}
                  fullWidth
                  variant="secondary"
                  icon="sparkles"
                  className="mt-4"
                >
                  Finalizar Configuração
                </LuxuryButton>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={48} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">Tudo Pronto!</h2>
              <p className="text-slate-500 font-medium mb-10">Sua conta de elite foi configurada com sucesso. Estamos preparando seu dashboard personalizado.</p>
              
              <div className="space-y-4">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    onAnimationComplete={() => window.location.href = '/dashboard'}
                    className="h-full bg-indigo-600"
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando com o ecossistema...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        EggTrack Professional SaaS &copy; 2026
      </footer>
    </div>
  );
}
