'use client';

import React from 'react';
import { Contact, MoreVertical } from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";

interface FinanceEmployeesListClientProps {
  employees: any[];
}

export default function FinanceEmployeesListClient({ employees }: FinanceEmployeesListClientProps) {
  return (
    <LuxuryTable 
      columns={[
        {
          key: 'employee',
          header: 'Colaborador',
          render: (emp) => (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[6px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                <Contact size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">{emp.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{emp.position || 'Não Definido'}</p>
              </div>
            </div>
          )
        },
        {
          key: 'cpf',
          header: 'Documento',
          render: (emp) => (
            <span className="text-xs font-medium text-slate-500 font-mono">{emp.cpf || '---'}</span>
          )
        },
        {
          key: 'salary',
          header: 'Salário Base',
          render: (emp) => (
            <span className="text-sm font-bold text-slate-700">R$ {Number(emp.baseSalary || 0).toLocaleString('pt-BR')}</span>
          )
        },
        {
          key: 'status',
          header: 'Status',
          render: (emp) => (
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              emp.status === 'ACTIVE' 
                ? 'bg-success/5 text-success border-success/10' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {emp.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
            </span>
          )
        },
        {
          key: 'actions',
          header: '',
          className: 'w-20',
          render: () => (
            <div className="flex justify-end">
              <button className="p-2 hover:bg-slate-50 rounded-[6px] text-slate-400 hover:text-primary transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          )
        }
      ]}
      data={employees}
    />
  );
}
