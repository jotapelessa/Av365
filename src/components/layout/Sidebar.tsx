'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bird, 
  Package, 
  DollarSign, 
  Calendar, 
  Settings,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Home,
  LogOut,
  Users,
  Handshake,
  Briefcase,
  Receipt,
  Heart,
  Layers,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton, useUser } from "@clerk/nextjs";

type MenuItem = {
  icon: any;
  label: string;
  href: string;
  status?: string;
};

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bird, label: "Lotes", href: "/flocks" },
  { icon: Heart, label: "Saúde", href: "/health" },
  { icon: Home, label: "Galpões", href: "/houses" },
  { icon: Users, label: "Funcionários", href: "/employees" },
  { icon: Handshake, label: "Clientes", href: "/customers" },
  { icon: Briefcase, label: "Fornecedores", href: "/suppliers" },
  { icon: Package, label: "Estoque", href: "/inventory" },
  { icon: Layers, label: "Silos", href: "/inventory/silos" },
  { icon: BarChart3, label: "Relatórios", href: "/reports" },
  { icon: DollarSign, label: "Financeiro", href: "/finance" },
  { icon: Receipt, label: "Contas e Bancos", href: "/finance/accounts" },
  { icon: Calendar, label: "Agenda", href: "/tasks" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata as any)?.role;

  const currentMenuItems = [...menuItems];
  
  if (role === 'SUPER_ADMIN') {
    currentMenuItems.push({ icon: ShieldCheck, label: "Admin SaaS", href: "/admin" });
  }

  return (
    <>
      {/* BOTÃO HAMBÚRGUER (MOBILE) */}
      <div className="fixed top-4 left-4 z-[60] lg:hidden">
        <button 
          onClick={onToggle}
          className="p-3 rounded-[12px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg text-slate-600 active:scale-95 transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <motion.aside 
        id="sidebar"
        initial={false}
        animate={{ 
          width: isCollapsed ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 72) : 260,
          x: isCollapsed && (typeof window !== 'undefined' && window.innerWidth < 1024) ? -260 : 0
        }}
        className="fixed left-0 top-0 h-screen bg-white/40 backdrop-blur-3xl border-r border-white/20 z-50 flex flex-col transition-all duration-500 ease-[0.25, 0.1, 0.25, 1] overflow-hidden no-print shadow-2xl shadow-slate-200/20"
      >
        {/* LOGO SECTION */}
        <div className="p-6 mb-2 flex items-center justify-between h-20">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2.5 overflow-hidden"
              >
                <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <Zap className="text-white fill-white" size={18} />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tighter italic leading-none whitespace-nowrap">EggTrack</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={onToggle}
            className="hidden lg:block p-2 rounded-md hover:bg-slate-100/50 text-slate-400 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {currentMenuItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/dashboard' && item.href !== '/finance' && pathname.startsWith(item.href));
            
            const isSoon = item.status === "soon";

            return (
              <Link key={item.href} href={isSoon ? "#" : item.href} className={isSoon ? "cursor-not-allowed" : ""}>
                <div className={`
                  relative flex items-center gap-3 p-2 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200/50' 
                    : isSoon 
                      ? 'opacity-30 grayscale pointer-events-none' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}>
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0
                    ${isActive ? 'bg-indigo-600 shadow-lg ring-2 ring-indigo-500/20' : 'bg-slate-100/50 group-hover:bg-white group-hover:text-indigo-600'}
                  `}>
                    <item.icon size={18} className={`${isActive ? 'scale-110 text-white' : 'group-hover:scale-110'} transition-transform duration-300`} />
                  </div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center justify-between flex-1 overflow-hidden"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                        {isSoon && (
                          <span className="text-[7px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                            Soon
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isActive && !isCollapsed && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER - STATUS & LOGOUT */}
        <div className="p-6 border-t border-white/10 space-y-4 min-w-[260px]">
          <SignOutButton>
            <button className={`
              flex items-center gap-3 w-full p-3 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all group
              ${isCollapsed ? 'lg:justify-center' : ''}
            `}>
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {!isCollapsed && (
                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                  Sair do Sistema
                </span>
              )}
            </button>
          </SignOutButton>

          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest leading-none">Online</p>
                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">v1.2.4 Elite</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
