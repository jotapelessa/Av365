import { db, getProducerId } from "@/lib/tenant";
import { Building2, Globe, Phone, Mail, MapPin, Hash, Palette, ShieldCheck } from "lucide-react";
import CompanySettingsForm from "@/app/settings/company/CompanySettingsForm";

export default async function CompanySettingsPage() {
  const producerId = await getProducerId();

  if (!producerId) {
    return (
      <div className="p-12 text-center bg-white rounded-[18px] border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-2">Acesso Negado</h2>
        <p className="text-slate-500">Você precisa estar vinculado a uma granja para acessar estas configurações.</p>
      </div>
    );
  }

  const producer = await db.producer.findUnique({
    where: { id: producerId },
    include: {
      settings: true
    }
  });

  if (!producer) {
    return (
      <div className="p-12 text-center bg-white rounded-[18px] border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-2">Erro de Sincronização</h2>
        <p className="text-slate-500">Não conseguimos localizar os dados da sua granja no sistema.</p>
      </div>
    );
  }

  // Sanitização para o cliente
  const initialData = JSON.parse(JSON.stringify(producer));

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO ESQUERDO: INFOS GERAIS */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bento-card-elite !p-0 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white text-primary border border-slate-200 shadow-sm">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 italic leading-none">Dados Corporativos</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Identidade Jurídica e Operacional</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <CompanySettingsForm initialData={initialData} />
            </div>
          </section>

          {/* ASSETS DE MARCA */}
          <section className="bento-card-elite">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 italic leading-none">Assets de Marca</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Branding e Visual da Plataforma</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-600">Visualização do Logo Atual</p>
                <div className="aspect-video rounded-[18px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                  {(producer as any).logoUrl ? (
                    <img src={(producer as any).logoUrl} alt="Logo Empresa" className="max-h-32 object-contain" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400">
                        <Building2 size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum logo enviado</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="p-6 rounded-[18px] bg-indigo-50/50 border border-indigo-100/50">
                  <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Dica do Especialista</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    "Um logo bem definido na plataforma AV365 ajuda na identificação rápida em relatórios de pesagem e faturas de venda. Recomendamos fundos transparentes (PNG) ou cores sólidas."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* LADO DIREITO: SUMMARY & STATUS */}
        <div className="space-y-8">
          <div className="p-8 rounded-[22px] bg-slate-900 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-500/30">
                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" /> Empresa Validada
              </div>
              <h3 className="text-xl font-black italic tracking-tight mb-2">{producer.name}</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                Sua granja está operando sob o plano <span className="text-indigo-400 font-black">{producer.plan}</span>.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ativo</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID do Sistema</span>
                  <span className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">#{producer.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[18px] bg-white border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                 <Hash size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CNPJ / CPF</p>
                 <p className="text-sm font-black text-slate-900 italic">{producer.cnpj || producer.cpf || 'Não informado'}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                 <MapPin size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Localização</p>
                 <p className="text-sm font-black text-slate-900 italic">{producer.location || 'Brasil'}</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
