import { BarChart3, FileText, Printer, Download, Calendar, PieChart, TrendingUp, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { getTenantDb } from "@/lib/tenant";

export default async function ReportsPage() {
  const db = await getTenantDb();
  
  // Dados básicos para os cards de relatório
  const [salesCount, expensesCount, flocksCount, customersCount] = await Promise.all([
    db.sale.count(),
    db.expense.count(),
    db.flock.count({ where: { status: 'ACTIVE' } }),
    db.customer.count()
  ]);

  const reportCategories = [
    {
      title: "Financeiro & Contábil",
      icon: DollarSign,
      color: "emerald",
      reports: [
        { name: "Fluxo de Caixa Consolidado", desc: "Entradas vs Saídas com projeções", href: "/reports/cash-flow" },
        { name: "Snapshot Patrimonial", desc: "Balanço entre ativos e passivos", href: "/reports/equity" },
        { name: "DRE Simplificado", desc: "Demonstrativo de resultados do exercício", href: "/reports/dre" }
      ]
    },
    {
      title: "Produção & Lotes",
      icon: TrendingUp,
      color: "indigo",
      reports: [
        { name: "Eficiência Produtiva", desc: "Conversão alimentar e produção de ovos", href: "/reports/production" },
        { name: "Resumo de Lotes Ativos", desc: "Performance técnica por galpão", href: "/reports/flocks" },
        { name: "Mapa de Sanidade", desc: "Histórico de vacinação e alertas", href: "/reports/health" }
      ]
    },
    {
      title: "Gestão Operacional",
      icon: Users,
      color: "orange",
      reports: [
        { name: "Inventário de Silos", desc: "Consumo de ração e previsões", href: "/reports/silos" },
        { name: "Desempenho de Funcionários", desc: "Tarefas concluídas e custos", href: "/reports/employees" },
        { name: "Ranking de Clientes", desc: "Volume de compras e recorrência", href: "/reports/customers" }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="mb-10 bento-card-elite">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Inteligência de Dados</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Central de Relatórios</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Elite <span className="text-primary italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Analytics</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Dados</p>
                <p className="text-xs font-bold text-slate-900">Atualizado em tempo real</p>
             </div>
             <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                <BarChart3 size={24} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reportCategories.map((category) => (
          <div key={category.title} className="flex flex-col h-full bento-card-elite">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100`}>
                  <category.icon size={20} />
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{category.title}</h2>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {category.reports.map((report) => (
                <Link 
                  key={report.name} 
                  href={report.href}
                  className="group block p-5 rounded-[18px] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{report.name}</h3>
                    <Printer size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {report.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 rounded-[24px] p-10 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight mb-3">Precisa de um Relatório <span className="text-indigo-400 italic">Sob Medida</span>?</h2>
          <p className="text-slate-400 text-sm max-w-xl mb-8 font-medium">
            Nossa inteligência artificial pode cruzar qualquer dado da sua fazenda para gerar relatórios táticos exclusivos. Entre em contato para ativar o módulo Custom Analytics.
          </p>
          <div className="inline-block px-8 py-3.5 bg-white text-slate-900 rounded-[14px] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
            Solicitar Customização
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
          <PieChart size={300} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
}
