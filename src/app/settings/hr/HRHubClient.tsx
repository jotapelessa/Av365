'use client';

import { useState } from "react";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Phone, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  FileText,
  Building2,
  Trash2,
  Save,
  X,
  Plus,
  CheckCircle2
} from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { upsertEmployee, deleteEmployee } from "@/app/settings/hr/actions";
import LuxuryFileUpload from "@/components/ui/LuxuryFileUpload";

interface HRHubClientProps {
  initialEmployees: any[];
}

export default function HRHubClient({ initialEmployees }: HRHubClientProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [tempContractUrl, setTempContractUrl] = useState("");

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (emp: any = null) => {
    setEditingEmployee(emp || {
      name: "",
      cpf: "",
      phone: "",
      position: "Colaborador",
      baseSalary: 0,
      veterinaryLicense: "",
      taxInfo: { inss: 0, fgts: 0 },
      bankDetails: { bank: "", agency: "", account: "" }
    });
    setTempContractUrl(emp?.contractUrl || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingEmployee(null);
    setTempContractUrl("");
    setIsModalOpen(false);
  };

  async function handleSave(formData: FormData) {
    setIsPending(true);
    try {
      const data = {
        id: editingEmployee?.id,
        name: formData.get("name") as string,
        cpf: formData.get("cpf") as string,
        phone: formData.get("phone") as string,
        position: formData.get("position") as string,
        baseSalary: Number(formData.get("baseSalary")),
        veterinaryLicense: formData.get("veterinaryLicense") as string,
        contractUrl: tempContractUrl,
        bankDetails: {
          bank: formData.get("bank") as string,
          agency: formData.get("agency") as string,
          account: formData.get("account") as string,
        },
        taxInfo: {
          inss: Number(formData.get("inss")),
          fgts: Number(formData.get("fgts")),
        }
      };


      const result = await upsertEmployee(data);
      if (result.success) {
        toast.success("Funcionário salvo com sucesso!");
        // Refresh list (simulado para brevidade, ideal é revalidate)
        if (editingEmployee?.id) {
          setEmployees(employees.map(e => e.id === result.data.id ? result.data : e));
        } else {
          setEmployees([...employees, result.data]);
        }
        closeModal();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este colaborador?")) return;
    
    try {
      const result = await deleteEmployee(id);
      if (result.success) {
        setEmployees(employees.filter(e => e.id !== id));
        toast.success("Colaborador removido.");
      }
    } catch (error) {
      toast.error("Erro ao deletar.");
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* FILTROS E BUSCA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou cargo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-400 transition-all shadow-inner-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100 italic"
          >
            <UserPlus size={16} />
            Contratar Elite
          </button>
        </div>
      </div>

      {/* TABELA DE ELITE */}
      <LuxuryTable 
        columns={[
          {
            key: 'employee',
            header: 'Colaborador',
            render: (emp) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-indigo-600 font-black text-xs uppercase italic border border-white shadow-sm">
                  {emp.name.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-none mb-1 italic">{emp.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{emp.cpf || '---'}</p>
                </div>
              </div>
            )
          },
          {
            key: 'role',
            header: 'Especialização',
            render: (emp) => (
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  emp.position === 'Veterinário' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  emp.position === 'Gerente' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                  {emp.position || 'Geral'}
                </span>
                {emp.veterinaryLicense && (
                  <span className="p-1 rounded-md bg-indigo-50 text-indigo-600" title={`CRMV: ${emp.veterinaryLicense}`}>
                    <GraduationCap size={12} />
                  </span>
                )}
              </div>
            )
          },
          {
            key: 'finance',
            header: 'Financeiro',
            render: (emp) => (
              <div>
                <p className="text-sm font-black text-slate-900 leading-none mb-1 italic">
                  R$ {Number(emp.baseSalary || 0).toLocaleString('pt-BR')}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Salário Base</p>
              </div>
            )
          },
          {
            key: 'docs',
            header: 'Status Docs',
            render: (emp) => (
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${emp.contractUrl ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${emp.contractUrl ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {emp.contractUrl ? 'Completo' : 'Pendência'}
                </span>
              </div>
            )
          },
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (emp) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => openModal(emp)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Briefcase size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(emp.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          }
        ]}
        data={filteredEmployees}
      />

      {/* MODAL AVANÇADO DE CONTRATAÇÃO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white text-indigo-600 shadow-sm border border-slate-100">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 italic leading-none">
                      {editingEmployee?.id ? 'Atualizar Colaborador' : 'Nova Contratação Elite'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Dossiê Completo de Funcionário</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form action={handleSave} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DADOS BÁSICOS */}
                  <div className="md:col-span-2">
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-indigo-200" /> Identificação
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input name="name" defaultValue={editingEmployee?.name} required className="luxury-input-elite w-full" placeholder="Ex: João da Silva" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                    <input name="cpf" defaultValue={editingEmployee?.cpf} className="luxury-input-elite w-full" placeholder="000.000.000-00" />
                  </div>

                  {/* CARGO E SALÁRIO */}
                  <div className="md:col-span-2 pt-4">
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-indigo-200" /> Atribuições & Financeiro
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo / Especialização</label>
                    <select name="position" defaultValue={editingEmployee?.position || "Colaborador"} className="luxury-input-elite w-full appearance-none">
                      <option value="Colaborador">Colaborador</option>
                      <option value="Gerente">Gerente de Granja</option>
                      <option value="Veterinário">Veterinário Responsável</option>
                      <option value="Técnico">Assistente Técnico</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salário Base (R$)</label>
                    <input name="baseSalary" type="number" step="0.01" defaultValue={editingEmployee?.baseSalary} className="luxury-input-elite w-full" placeholder="0.00" />
                  </div>

                  {/* CAMPOS CONDICIONAIS OU AVANÇADOS */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Licença Profissional (CRMV)</label>
                    <input name="veterinaryLicense" defaultValue={editingEmployee?.veterinaryLicense} className="luxury-input-elite w-full" placeholder="Opcional para Veterinários" />
                  </div>

                  <div className="md:col-span-2">
                    <LuxuryFileUpload 
                      label="Contrato de Trabalho (PDF)" 
                      onUpload={(url) => setTempContractUrl(url)} 
                    />
                    {tempContractUrl && (
                      <p className="mt-2 text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={10} /> Arquivo vinculado com sucesso
                      </p>
                    )}
                  </div>


                  {/* IMPOSTOS E BANCO */}
                  <div className="md:col-span-2 pt-4">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-emerald-200" /> Dados de Pagamento & Encargos
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banco</label>
                    <input name="bank" defaultValue={editingEmployee?.bankDetails?.bank} className="luxury-input-elite w-full" placeholder="Ex: Banco do Brasil" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agência</label>
                      <input name="agency" defaultValue={editingEmployee?.bankDetails?.agency} className="luxury-input-elite w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta</label>
                      <input name="account" defaultValue={editingEmployee?.bankDetails?.account} className="luxury-input-elite w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">INSS (%)</label>
                      <input name="inss" type="number" step="0.1" defaultValue={editingEmployee?.taxInfo?.inss} className="luxury-input-elite w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FGTS (%)</label>
                      <input name="fgts" type="number" step="0.1" defaultValue={editingEmployee?.taxInfo?.fgts} className="luxury-input-elite w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-10">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 italic"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Salvar Colaborador
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .luxury-input-elite {
          @apply px-5 py-4 bg-slate-50 border border-slate-200 rounded-[18px] text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner-sm;
        }
      `}</style>
    </div>
  );
}

function Loader2({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
