'use client';

import React from 'react';
import { ShieldCheck } from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";

interface AdminUsersListClientProps {
  users: any[];
}

export default function AdminUsersListClient({ users }: AdminUsersListClientProps) {
  return (
    <LuxuryTable 
      variant="light"
      columns={[
        {
          key: 'identity',
          header: 'Identidade / Email',
          render: (user) => (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 group-hover:scale-110 transition-all shadow-sm">
                {user.name?.substring(0, 2).toUpperCase() || '??'}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 italic">{user.name || 'Sem nome'}</p>
                <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user.email}</p>
              </div>
            </div>
          )
        },
        {
          key: 'role',
          header: 'Atribuição',
          render: (user) => (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-tighter ${
              user.role === 'SUPER_ADMIN' 
                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              {user.role}
            </span>
          )
        },
        {
          key: 'tenant',
          header: 'Tenant Associado',
          render: (user) => (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {user.producer?.name || 'Global / Staff'}
              </span>
            </div>
          )
        },
        {
          key: 'actions',
          header: '',
          className: 'text-right',
          render: () => (
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
              <ShieldCheck size={18} />
            </button>
          )
        }
      ]}
      data={users}
    />
  );
}
