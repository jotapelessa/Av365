'use client';

import React from 'react';
import { Phone, MoreHorizontal } from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";

interface EmployeesListClientProps {
  employees: any[];
}

export default function EmployeesListClient({ employees }: EmployeesListClientProps) {
  return (
    <LuxuryTable 
      columns={[
        {
          key: 'name',
          header: 'Colaborador',
          render: (employee) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase tracking-tighter border border-white shadow-sm">
                {employee.name.substring(0, 2)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{employee.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">CPF: {employee.cpf || '---'}</p>
              </div>
            </div>
          )
        },
        {
          key: 'position',
          header: 'Cargo / Função',
          render: (employee) => (
            <span className="px-3 py-1 bg-indigo-50 text-primary text-[10px] font-black rounded-[6px] uppercase tracking-widest border border-indigo-100/50">
              {employee.position || 'Geral'}
            </span>
          )
        },
        {
          key: 'contact',
          header: 'Contato',
          render: (employee) => (
            <div className="flex items-center gap-2 text-slate-500">
              <Phone size={10} />
              <span className="text-[11px] font-medium">{employee.phone || '---'}</span>
            </div>
          )
        },
        {
          key: 'salary',
          header: 'Salário Base',
          render: (employee) => (
            <div>
              <p className="text-sm font-black text-slate-900">R$ {Number(employee.baseSalary || 0).toLocaleString('pt-BR')}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mês vigente</p>
            </div>
          )
        },
        {
          key: 'status',
          header: 'Status',
          render: () => (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Ativo</span>
            </div>
          )
        },
        {
          key: 'actions',
          header: '',
          className: 'text-right',
          render: () => (
            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          )
        }
      ]}
      data={employees}
    />
  );
}
