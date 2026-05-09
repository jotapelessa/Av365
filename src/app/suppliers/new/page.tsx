'use client';

import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Truck,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

import { createSupplier } from "../actions";

export default function NewSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const data = {
        name: formData.get("name") as string,
        cnpj: formData.get("cnpj") as string,
        phone: formData.get("phone") as string,
        category: formData.get("category") as string,
        address: formData.get("address") as string,
      };
      
      const result = await createSupplier(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/suppliers'), 1800);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <div className="max-w-3xl mx-auto">
      
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center space-y-6 p-12 ui-card bg-white shadow-2xl border-amber-100 rounded-[18px]"
            >
              <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-amber-100">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Parceiro <span className="text-amber-600 italic">Homologado</span></h2>
                <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest font-black">Cadeia de suprimentos fortalecida</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardItem className="mb-10">
        <div className="flex items-center gap-5">
          <Link 
            href="/suppliers" 
            className="p-3 rounded-[12px] bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-amber-600 hover:border-amber-100 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Cadeia de Suprimentos</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Truck size={10} /> Novo Fornecedor
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Cadastrar <span className="text-amber-600 italic text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Fornecedor</span>
            </h1>
          </div>
        </div>
      </DashboardItem>

      <DashboardItem>
        <form action={handleAction} className="ui-card space-y-10 bg-white p-10 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Building2 size={14} className="text-amber-500" /> Razão Social / Nome
              </label>
              <input 
                name="name"
                required
                placeholder="Ex: Nutrição Animal Elite S.A."
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-200 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Briefcase size={14} className="text-amber-500" /> Categoria de Insumos
              </label>
              <select 
                name="category"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-200 transition-all appearance-none cursor-pointer shadow-inner-sm"
              >
                <option value="FEED">Ração e Nutrição</option>
                <option value="MEDICINE">Medicamentos e Vacinas</option>
                <option value="EQUIPMENT">Equipamentos e Peças</option>
                <option value="SERVICES">Serviços Técnicos</option>
                <option value="OTHER">Outros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={14} className="text-amber-500" /> CNPJ
              </label>
              <input 
                name="cnpj"
                placeholder="00.000.000/0000-00"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-200 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={14} className="text-amber-500" /> Telefone / WhatsApp
              </label>
              <input 
                name="phone"
                placeholder="(00) 00000-0000"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-200 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

          </div>

          <div className="space-y-2 mt-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={14} className="text-amber-500" /> Localização / Sede
            </label>
            <input 
              name="address"
              placeholder="Cidade - UF"
              className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-200 transition-all placeholder:text-slate-300 shadow-inner-sm" 
            />
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
            <Link 
              href="/suppliers"
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar
            </Link>
            
            <LuxuryButton 
              type="submit"
              isLoading={loading}
              variant="primary"
              icon="save"
              className="px-12 py-4 shadow-lg shadow-amber-200/50"
            >
              Homologar Fornecedor
            </LuxuryButton>
          </div>

        </form>
      </DashboardItem>

      </div>
    </DashboardContainer>
  );
}
