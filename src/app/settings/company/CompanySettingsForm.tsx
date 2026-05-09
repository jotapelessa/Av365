'use client';

import { useState } from "react";
import { Save, Building2, Phone, Mail, MapPin, Hash, Loader2, Globe, CheckCircle2 } from "lucide-react";
import { updateCompanySettings } from "@/app/settings/company/actions";
import { toast } from "sonner";
import LuxuryFileUpload from "@/components/ui/LuxuryFileUpload";
import ImageCropperModal from "@/components/ui/ImageCropperModal";

interface CompanySettingsFormProps {
  initialData: any;
}

export default function CompanySettingsForm({ initialData }: CompanySettingsFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [cnpj, setCnpj] = useState(initialData.cnpj || initialData.cpf || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || '');
  
  // States para o Cropper
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onFilesSelected = (files: File[]) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    // Simulação de upload do blob
    const simulatedUrl = "https://simulated-storage.av365.com/logo-" + Math.random().toString(36).substring(7) + ".jpg";
    setLogoUrl(simulatedUrl);
    toast.success("Logotipo processado e pronto para salvar.");
  };

  const maskCnpjCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 14);
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cleanValue
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  const maskPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 11);
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return cleanValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      // Adiciona o logoUrl ao formData
      formData.set("logoUrl", logoUrl);
      
      const result = await updateCompanySettings(formData);
      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error(result.error || "Erro ao salvar configurações.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NOME DA EMPRESA */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <Building2 size={12} /> Razão Social / Nome Fantasia
          </label>
          <input 
            name="name"
            type="text" 
            defaultValue={initialData.name}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
          />
        </div>

        {/* CNPJ / CPF */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <Hash size={12} /> CNPJ ou CPF
          </label>
          <input 
            name="cnpj"
            type="text" 
            value={cnpj}
            onChange={(e) => setCnpj(maskCnpjCpf(e.target.value))}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
            placeholder="00.000.000/0000-00"
          />
        </div>

        {/* EMAIL DE CONTATO */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <Mail size={12} /> E-mail Institucional
          </label>
          <input 
            name="email"
            type="email" 
            defaultValue={initialData.email || ''}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
            placeholder="contato@granja.com.br"
          />
        </div>

        {/* TELEFONE */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <Phone size={12} /> Telefone / WhatsApp
          </label>
          <input 
            name="phone"
            type="text" 
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
            placeholder="(00) 0 0000-0000"
          />
        </div>

        {/* LOGO UPLOAD */}
        <div className="space-y-3 md:col-span-2">
          <LuxuryFileUpload 
            label="Logotipo da Empresa" 
            onFilesSelected={onFilesSelected}
            accept="image/*"
          />
          {logoUrl && (
            <div className="mt-4 flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Preview do Logo</p>
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                  <CheckCircle2 size={10} /> Sincronizado para salvamento
                </p>
              </div>
            </div>
          )}
        </div>


        {/* ENDEREÇO / LOCALIZAÇÃO */}
        <div className="space-y-3 md:col-span-2">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            <MapPin size={12} /> Localização da Unidade Produtiva
          </label>
          <input 
            name="location"
            type="text" 
            defaultValue={initialData.location || ''}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm"
            placeholder="Rodovia BR-..., Km ..., Zona Rural"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[18px] text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 italic"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>Salvar Identidade</span>
        </button>
      </div>

      {selectedImage && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          image={selectedImage}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={1} // Quadrado para logos geralmente é melhor
        />
      )}
    </form>
  );
}

