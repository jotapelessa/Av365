import { getTenantDb } from "@/lib/tenant";
import { createDailyRecord } from "../../actions";
import { ArrowLeft, Egg, Save, Skull, Calendar, Droplets, Thermometer, Wind, MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecordProductionPage({ params }: PageProps) {
  const { id } = await params;
  const tenantPrisma = await getTenantDb();

  const flock = await tenantPrisma.flock.findUnique({
    where: { id },
  });

  if (!flock) redirect("/flocks");

  const handleAction = async (formData: FormData) => {
    "use server";
    const result = await createDailyRecord(id, formData);
    if (result.success) {
      redirect(`/flocks/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <Link 
            href={`/flocks/${id}`} 
            className="p-3 rounded-[6px] bg-white shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Lançar Produção</h1>
            <p className="text-slate-500 font-medium">Lote: <span className="text-indigo-600 font-black">{flock.name}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 p-2 rounded-[6px] border border-indigo-100">
          <Calendar size={18} className="text-indigo-600 ml-2" />
          <input 
            form="record-form"
            name="date" 
            type="date" 
            defaultValue={new Date().toISOString().split('T')[0]}
            className="bg-transparent text-sm font-black text-indigo-900 focus:outline-none pr-2" 
          />
        </div>
      </header>

      <form id="record-form" action={handleAction} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* BLOCO 1: Produção de Ovos (Bento 8x12) */}
        <div className="md:col-span-8 space-y-6 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-[6px] bg-indigo-50 text-indigo-600">
              <Egg size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase tracking-widest text-xs">Produção de Ovos</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Coletado</label>
              <input name="eggsTotal" type="number" placeholder="0" required className="w-full px-6 py-5 rounded-[6px] bg-slate-50 border border-slate-100 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">Quebrados</label>
              <input name="eggsBroken" type="number" placeholder="0" className="w-full px-6 py-5 rounded-[6px] bg-amber-50/20 border border-amber-100 text-2xl font-black text-amber-700 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Sujos</label>
              <input name="eggsDirty" type="number" placeholder="0" className="w-full px-6 py-5 rounded-[6px] bg-orange-50/20 border border-orange-100 text-2xl font-black text-orange-900 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none" />
            </div>
          </div>
        </div>

        {/* BLOCO 2: Ambiência (Bento 4x12) */}
        <div className="md:col-span-4 space-y-6 p-8 rounded-[40px] bg-indigo-600 text-white shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[6px] bg-white/10">
              <Wind size={20} />
            </div>
            <h2 className="font-black uppercase tracking-widest text-[10px]">Ambiência</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Temperatura</label>
                <Thermometer size={14} className="text-indigo-200" />
              </div>
              <div className="relative">
                <input name="temperature" type="number" step="0.1" placeholder="0.0" className="w-full px-6 py-4 rounded-[6px] bg-white/10 border border-white/20 text-xl font-black text-white focus:bg-white/20 transition-all outline-none placeholder:text-indigo-300" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-indigo-200 text-xs">ºC</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Umidade</label>
                <Droplets size={14} className="text-indigo-200" />
              </div>
              <div className="relative">
                <input name="humidity" type="number" step="0.1" placeholder="0" className="w-full px-6 py-4 rounded-[6px] bg-white/10 border border-white/20 text-xl font-black text-white focus:bg-white/20 transition-all outline-none placeholder:text-indigo-300" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-indigo-200 text-xs">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO 3: Nutrição (Bento 6x12) */}
        <div className="md:col-span-6 space-y-6 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[6px] bg-emerald-50 text-emerald-600">
              <Droplets size={20} />
            </div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase tracking-widest text-[10px]">Consumo Diário</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ração (Kg)</label>
              <input name="feedConsumed" type="number" step="0.1" placeholder="0.0" className="w-full px-6 py-4 rounded-[6px] bg-slate-50 border border-slate-100 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Água (Litros)</label>
              <input name="waterConsumed" type="number" step="0.1" placeholder="0.0" className="w-full px-6 py-4 rounded-[6px] bg-slate-50 border border-slate-100 text-xl font-black text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
            </div>
          </div>
        </div>

        {/* BLOCO 4: Sanidade (Bento 6x12) */}
        <div className="md:col-span-6 space-y-6 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[6px] bg-red-50 text-red-600">
              <Skull size={20} />
            </div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase tracking-widest text-[10px]">Sanidade</h2>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1">Mortalidade (Aves)</label>
            <div className="relative">
              <input name="mortality" type="number" placeholder="0" className="w-full px-6 py-4 rounded-[6px] bg-red-50/30 border border-red-100 text-xl font-black text-red-700 outline-none focus:ring-4 focus:ring-red-500/10 transition-all" />
              <Skull size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-red-200" />
            </div>
          </div>
        </div>

        {/* BLOCO 5: Notas (Bento 12x12) */}
        <div className="md:col-span-12 space-y-4 p-8 rounded-[40px] bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-slate-400" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observações Operacionais</label>
          </div>
          <textarea 
            name="notes"
            rows={2}
            placeholder="Ex: Início de vacinação, troca de lote de ração, comportamento estranho..."
            className="w-full bg-transparent text-slate-700 font-medium placeholder:text-slate-300 outline-none resize-none"
          />
        </div>

        <div className="md:col-span-12 flex items-center justify-end gap-6 pt-4">
          <Link href={`/flocks/${id}`} className="premium-button secondary">
            Descartar
          </Link>
          <button 
            type="submit"
            className="premium-button"
          >
            Confirmar Lançamento
          </button>
        </div>
      </form>
    </div>
  );
}
