'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users2, ShieldCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const settingsTabs = [
  { id: 'company', label: 'Empresa', href: '/settings/company', icon: Building2 },
  { id: 'hr', label: 'Recursos Humanos', href: '/settings/hr', icon: Users2 },
  { id: 'security', label: 'Segurança', href: '/settings/security', icon: ShieldCheck },
  { id: 'billing', label: 'Assinatura', href: '/settings/billing', icon: CreditCard },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER ESTRUTURAL */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-8 bg-indigo-600 rounded-full" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Centro de Governança</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
          Configurações da <span className="text-primary underline decoration-indigo-200 decoration-8 underline-offset-4">Granja</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-2">Gerencie a identidade corporativa, equipe e conformidade da sua operação.</p>
      </header>

      {/* TABS NAVEGAÇÃO LUXURY */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-[22px] border border-slate-200/60 w-fit">
        {settingsTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.id} href={tab.href}>
              <div className={`
                relative flex items-center gap-2.5 px-6 py-3 rounded-[18px] transition-all duration-300 group
                ${isActive ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-slate-900'}
              `}>
                <tab.icon size={18} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                <span className="text-[11px] font-black uppercase tracking-wider">{tab.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeSettingTab"
                    className="absolute inset-0 bg-white rounded-[18px] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <main className="mt-8">
        {children}
      </main>
    </div>
  );
}
