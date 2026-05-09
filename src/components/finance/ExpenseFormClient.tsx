'use client';

import { useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Receipt, 
  Calendar as CalendarIcon,
  DollarSign,
  Tag,
  Bird,
  ChevronDown,
  CheckCircle2,
  TrendingDown,
  CreditCard,
  Building2,
  Users,
  Info,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createEliteExpense } from "@/app/finance/actions";
import { ExpenseCategory, PaymentStatus } from "@prisma/client";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import LuxuryFileUpload from "@/components/ui/LuxuryFileUpload";

interface ExpenseFormClientProps {
  flocks: { id: string, name: string }[];
  suppliers: { id: string, name: string }[];
  employees: { id: string, name: string }[];
  accounts: { id: string, name: string }[];
}

export default function ExpenseFormClient({ 
  flocks, 
  suppliers, 
  employees, 
  accounts 
}: ExpenseFormClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>("PAID");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [invoiceUrl, setInvoiceUrl] = useState<string | undefined>();

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const totalAmount = parseFloat(formData.get("amount") as string);
      const firstDueDate = new Date(formData.get("date") as string);
      
      let installments = undefined;
      if (status === 'PENDING' && installmentCount > 1) {
        installments = Array.from({ length: installmentCount }).map((_, i) => {
          const dueDate = new Date(firstDueDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          return {
            amount: totalAmount / installmentCount,
            dueDate
          };
        });
      }

      const data = {
        category: formData.get("category") as ExpenseCategory,
        amount: totalAmount,
        date: firstDueDate,
        description: formData.get("description") as string,
        flockId: (formData.get("flockId") as string) || undefined,
        supplierId: (formData.get("supplierId") as string) || undefined,
        employeeId: (formData.get("employeeId") as string) || undefined,
        accountId: (formData.get("accountId") as string) || undefined,
        status,
        installments,
        invoiceUrl
      };

      await createEliteExpense(data);
      setSuccess(true);
      setTimeout(() => router.push('/finance'), 1800);
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar despesa.");
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
              className="text-center space-y-6 p-12 ui-card bg-white shadow-2xl border-rose-100"
            >
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-rose-100">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Custo <span className="text-rose-600 italic">Registrado</span></h2>
                <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest font-black">Atualizando balanço de despesas</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardItem className="mb-10">
        <div className="flex items-center gap-5">
          <Link 
            href="/finance" 
            className="p-3 rounded-[12px] bg-white border border-slate-100 text-slate-400 shadow-sm hover:text-rose-600 hover:border-rose-100 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Fluxo de Saída</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingDown size={10} /> Nova Despesa
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Registrar <span className="text-rose-600 italic text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">Despesa</span>
            </h1>
          </div>
        </div>
      </DashboardItem>

      <DashboardItem>
        <form action={handleAction} className="ui-card space-y-10 bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag size={14} className="text-rose-500" /> Categoria
              </label>
              <div className="relative group">
                <select 
                  name="category" 
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all cursor-pointer hover:border-rose-100"
                >
                  <option value="FEED">Ração</option>
                  <option value="MEDICINE">Medicamentos</option>
                  <option value="ENERGY">Energia / Água</option>
                  <option value="LABOR">Mão de Obra / Salários</option>
                  <option value="MAINTENANCE">Manutenção</option>
                  <option value="OTHER">Outros</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <DollarSign size={14} className="text-rose-500" /> Valor Total (R$)
              </label>
              <div className="relative">
                <input 
                  name="amount"
                  type="number" 
                  placeholder="0,00"
                  step="0.01"
                  required
                  className="w-full h-14 pl-12 pr-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all hover:border-rose-100" 
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm tracking-tighter">R$</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <CalendarIcon size={14} className="text-rose-500" /> Data {status === 'PAID' ? 'do Pagamento' : 'de Vencimento'}
              </label>
              <input 
                name="date"
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all hover:border-rose-100" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <CreditCard size={14} className="text-rose-500" /> Condição
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-[18px] h-14">
                <button
                  type="button"
                  onClick={() => setStatus('PAID')}
                  className={`rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    status === 'PAID' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400'
                  }`}
                >
                  À Vista
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('PENDING')}
                  className={`rounded-[12px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    status === 'PENDING' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400'
                  }`}
                >
                  A Prazo
                </button>
              </div>
            </div>

            <AnimatePresence>
              {status === 'PENDING' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden col-span-full md:col-span-1"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ArrowLeft size={14} className="rotate-180 text-rose-500" /> Parcelamento
                  </label>
                  <div className="relative group">
                    <select 
                      value={installmentCount}
                      onChange={(e) => setInstallmentCount(Number(e.target.value))}
                      className="w-full h-14 px-6 bg-rose-50/30 border border-rose-100 rounded-[18px] font-bold text-rose-900 appearance-none focus:outline-none transition-all cursor-pointer hover:bg-rose-50/50"
                    >
                      {[1, 2, 3, 4, 5, 6, 12, 24].map(n => (
                        <option key={n} value={n}>{n}x {n === 1 ? '(Sem parcelas)' : ''}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Building2 size={14} className="text-rose-500" /> Conta {status === 'PAID' ? 'de Saída' : 'Provisionada'}
              </label>
              <div className="relative group">
                <select 
                  name="accountId" 
                  required={status === 'PAID'}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 appearance-none focus:outline-none transition-all hover:border-rose-100"
                >
                  <option value="">{status === 'PAID' ? 'Selecione a conta' : 'Nenhuma conta (Apenas provisão)'}</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Bird size={14} className="text-rose-500" /> Lote Relacionado
              </label>
              <div className="relative group">
                <select 
                  name="flockId" 
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 appearance-none focus:outline-none transition-all hover:border-rose-100"
                >
                  <option value="">Geral (Fazenda)</option>
                  {flocks.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users size={14} className="text-rose-500" /> Fornecedor / Favorecido
              </label>
              <div className="relative group">
                <select 
                  name="supplierId" 
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 appearance-none focus:outline-none transition-all hover:border-rose-100"
                >
                  <option value="">Selecione um Fornecedor</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all group-hover:text-rose-600" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users size={14} className="text-rose-500" /> Colaborador (Gasto pessoal/viagem)
              </label>
              <div className="relative group">
                <select 
                  name="employeeId" 
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-bold text-slate-900 appearance-none focus:outline-none transition-all hover:border-rose-100"
                >
                  <option value="">Nenhum Colaborador</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-rose-600 transition-all" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição / Finalidade</label>
              <textarea 
                name="description"
                placeholder="Detalhes sobre a despesa, fornecedor ou nota fiscal..."
                rows={4}
                className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-[18px] font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-500/5 transition-all resize-none hover:border-rose-100"
              />
            </div>
            <LuxuryFileUpload onUpload={setInvoiceUrl} />
          </div>

          {status === 'PENDING' && (
            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-[18px] flex gap-4 items-start backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                <Info size={16} />
              </div>
              <p className="text-xs font-medium text-indigo-900 leading-relaxed">
                Ao registrar como <strong>A Prazo</strong>, o sistema criará {installmentCount} parcela(s) no módulo de Contas a Pagar. O saldo da conta bancária só será debitado na liquidação de cada parcela.
              </p>
            </div>
          )}

          <div className="pt-10 border-t border-slate-50 flex items-center justify-between gap-4">
            <Link 
              href="/finance"
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancelar
            </Link>
            
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-12 py-5 bg-rose-600 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-100 hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] group disabled:bg-slate-200 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} className="group-hover:rotate-12 transition-transform" />
                  Efetivar Despesa
                </>
              )}
            </button>
          </div>

        </form>
      </DashboardItem>

      </div>
    </DashboardContainer>
  );
}
