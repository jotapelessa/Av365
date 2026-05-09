'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Users, 
  CreditCard, 
  ShieldAlert, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Database,
  ArrowLeft,
  LogOut,
  Receipt,
  Palette,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton } from "@clerk/nextjs";

const adminMenuItems = [
  { icon: BarChart3, label: "Cockpit Global", href: "/admin" },
  { icon: Monitor, label: "Auditoria UI", href: "/admin/audit" },
  { icon: Globe, label: "Marketing Homepage", href: "/admin/site" },
  { icon: Building2, label: "Clientes (Tenants)", href: "/admin/producers" },
  { icon: Receipt, label: "Faturamento Global", href: "/admin/billing" },
  { icon: Users, label: "Usuários SaaS", href: "/admin/users" },
  { icon: CreditCard, label: "Planos & Assinaturas", href: "/admin/plans" },
  { icon: Database, label: "Webhooks Stripe", href: "/admin/webhooks", status: "soon" },
  { icon: ShieldAlert, label: "Logs de Segurança", href: "/admin/security" },
  { icon: Palette, label: "Design System", href: "/admin/design" },
  { icon: Settings, label: "Configurações SaaS", href: "/admin/settings" },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 260 }}
      className="fixed left-0 top-0 h-screen bg-white/70 backdrop-blur-3xl border-r border-slate-200/60 z-50 flex flex-col transition-all duration-500 overflow-hidden no-print"
    >
      {/* ADMIN LOGO SECTION */}
      <div className="p-6 mb-2 flex items-center justify-between h-20 border-b border-slate-100">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 border border-indigo-500/20 shrink-0">
                <Globe className="text-white" size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xl font-black text-slate-900 tracking-tighter italic leading-none whitespace-nowrap">EggTrack</span>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.4em] leading-none mt-2 ml-0.5 whitespace-nowrap">Control</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={onToggle}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-white text-slate-400 hover:text-indigo-600 transition-all border border-slate-200/60 shadow-sm active:scale-95 shrink-0"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ADMIN NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const isSoon = item.status === "soon";

          return (
            <Link key={item.href} href={isSoon ? "#" : item.href} className={isSoon ? "cursor-not-allowed" : ""}>
              <div className={`
                relative flex items-center gap-3 p-2.5 rounded-[16px] transition-all duration-500 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : isSoon 
                    ? 'opacity-20 grayscale pointer-events-none' 
                    : 'text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-600'}
              `}>
                {isActive && (
                  <motion.div 
                    layoutId="adminActiveTab"
                    className="absolute inset-0 bg-indigo-600 rounded-[16px] z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
                <item.icon size={18} className={`${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-3 group-hover:text-indigo-600'} transition-all duration-500 shrink-0`} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap italic overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER - BACK TO DASHBOARD & LOGOUT */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <Link href="/dashboard">
          <button className={`
            flex items-center gap-3 w-full p-2.5 rounded-[16px] text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all group border border-transparent hover:border-emerald-100
            ${isCollapsed ? 'justify-center px-0' : ''}
          `}>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
            {!isCollapsed && (
              <span className="text-[9px] font-black uppercase tracking-[0.1em] whitespace-nowrap italic overflow-hidden text-ellipsis">
                Painel Operativo
              </span>
            )}
          </button>
        </Link>

        <SignOutButton>
          <button className={`
            flex items-center gap-3 w-full p-2.5 rounded-[16px] bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all group border border-rose-100 hover:border-rose-600 shadow-sm hover:shadow-rose-200
            ${isCollapsed ? 'justify-center px-0' : ''}
          `}>
            <LogOut size={18} className="group-hover:rotate-12 transition-transform shrink-0" />
            {!isCollapsed && (
              <span className="text-[9px] font-black uppercase tracking-[0.1em] whitespace-nowrap italic overflow-hidden text-ellipsis">
                Sair do Sistema
              </span>
            )}
          </button>
        </SignOutButton>
      </div>
    </motion.aside>
  );
}
