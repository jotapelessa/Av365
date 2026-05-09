'use client';

import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  Search,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  const router = useRouter();
  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setFetchingAddress(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
      if (response.ok) {
        const data = await response.json();
        setAddressData({
          cep: cleanCep,
          street: data.street || "",
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          state: data.state || ""
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const fullAddress = `${addressData.street}, ${addressData.neighborhood}, ${addressData.city} - ${addressData.state} (${addressData.cep})`;
      
      const data = {
        name: formData.get("name") as string,
        taxId: formData.get("taxId") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        address: fullAddress,
      };
      
      const result = await createCustomer(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/customers'), 1800);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar cliente.");
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
              className="text-center space-y-6 p-12 ui-card bg-white shadow-2xl border-emerald-100 rounded-[18px]"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cliente <span className="text-emerald-600 italic">Cadastrado</span></h2>
                <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest font-black">Expandindo sua rede de mercado</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardItem className="mb-10">
        <div className="flex items-center gap-5">
          <Link 
            href="/customers" 
            className="p-3 rounded-[12px] bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-primary hover:border-primary/10 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Mercado & Vendas</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <UserPlus size={10} /> Novo Cliente
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Adicionar <span className="text-primary italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Comprador</span>
            </h1>
          </div>
        </div>
      </DashboardItem>

      <DashboardItem>
        <form action={handleAction} className="ui-card space-y-10 bg-white p-10 rounded-[18px] border border-slate-100 shadow-xl shadow-slate-200/20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User size={14} className="text-primary" /> Nome do Cliente / Empresa
              </label>
              <input 
                name="name"
                required
                placeholder="Ex: Granja Alvorada Ltda"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> CPF ou CNPJ
              </label>
              <input 
                name="taxId"
                placeholder="00.000.000/0000-00"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={14} className="text-primary" /> Telefone de Contato
              </label>
              <input 
                name="phone"
                placeholder="(00) 00000-0000"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={14} className="text-primary" /> E-mail (Opcional)
              </label>
              <input 
                name="email"
                type="email"
                placeholder="cliente@exemplo.com"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300 shadow-inner-sm" 
              />
            </div>

          </div>

          <div className="space-y-6 pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-primary" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Endereço de Faturamento</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEP</label>
                <div className="relative">
                  <input 
                    name="cep"
                    placeholder="00000-000"
                    value={addressData.cep}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setAddressData(prev => ({ ...prev, cep: val }));
                      if (val.length === 8) fetchAddress(val);
                    }}
                    className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner-sm" 
                  />
                  {fetchingAddress && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 size={18} className="text-primary animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logradouro / Rua</label>
                <input 
                  name="street"
                  placeholder="Rua, Avenida..."
                  value={addressData.street}
                  onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner-sm" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bairro</label>
                <input 
                  name="neighborhood"
                  placeholder="Bairro"
                  value={addressData.neighborhood}
                  onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner-sm" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cidade</label>
                <input 
                  name="city"
                  placeholder="Cidade"
                  value={addressData.city}
                  onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner-sm" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UF / Estado</label>
                <input 
                  name="state"
                  placeholder="UF"
                  maxLength={2}
                  value={addressData.state}
                  onChange={(e) => setAddressData(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner-sm" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
            <Link 
              href="/customers"
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar
            </Link>
            
            <LuxuryButton 
              type="submit"
              isLoading={loading}
              variant="primary"
              icon="save"
              className="px-12 py-4"
            >
              Confirmar Cadastro
            </LuxuryButton>
          </div>

        </form>
      </DashboardItem>

      </div>
    </DashboardContainer>
  );
}
