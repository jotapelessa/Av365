'use client';

import { 
  Plus, 
  Egg, 
  Skull, 
  DollarSign, 
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const actions = [
  { label: 'Registrar Ovos', icon: Egg, href: '/records/new', color: 'bg-emerald-500', auditId: 'eggs' },
  { label: 'Mortalidade', icon: Skull, href: '/records/new?type=mortality', color: 'bg-rose-500', auditId: 'mortality' },
  { label: 'Nova Venda', icon: DollarSign, href: '/sales/new', color: 'bg-indigo-600', auditId: 'sale' },
  { label: 'Despesa', icon: TrendingUp, href: '/expenses/new', color: 'bg-amber-500', auditId: 'expense' },
  { label: 'Novo Lote', icon: Plus, href: '/flocks/new', color: 'bg-slate-900', auditId: 'flock' },
];

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-audit="dashboard__section__quick-actions">
      {actions.map((action) => (
        <Link 
          key={action.auditId} 
          href={action.href}
          data-audit={`dashboard__action__${action.auditId}`}
          className="group relative flex flex-col p-6 rounded-[18px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
        >
          <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
            <action.icon size={20} />
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{action.label}</span>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
            <action.icon size={60} />
          </div>
        </Link>
      ))}
    </div>
  );
}
