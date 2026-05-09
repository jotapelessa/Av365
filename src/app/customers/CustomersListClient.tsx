'use client';

import React from 'react';
import { Phone, Mail, MapPin, MoreHorizontal } from "lucide-react";
import { LuxuryTable } from "@/components/ui/LuxuryTable";

interface CustomersListClientProps {
  customers: any[];
}

export default function CustomersListClient({ customers }: CustomersListClientProps) {
  return (
    <LuxuryTable 
      columns={[
        {
          key: 'name',
          header: 'Cliente',
          render: (customer) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-slate-50 to-slate-100 text-primary flex items-center justify-center font-black text-[10px] border border-white shadow-sm">
                {customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{customer.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DOC: {customer.taxId || '---'}</p>
              </div>
            </div>
          )
        },
        {
          key: 'address',
          header: 'Localização',
          render: (customer) => (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={12} className="text-slate-400" />
              <span className="text-[11px] font-medium max-w-[180px] truncate">{customer.address || 'Não informado'}</span>
            </div>
          )
        },
        {
          key: 'contact',
          header: 'Contato',
          render: (customer) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={10} />
                <span className="text-[11px] font-medium">{customer.phone || '---'}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={10} />
                  <span className="text-[10px]">{customer.email}</span>
                </div>
              )}
            </div>
          )
        },
        {
          key: 'sales',
          header: 'Volume de Compras',
          render: (customer) => (
            <div>
              <p className="text-sm font-black text-slate-900">{customer._count.sales} Pedidos</p>
              <p className="text-[9px] font-bold text-success uppercase tracking-widest mt-0.5">Recorrente</p>
            </div>
          )
        },
        {
          key: 'status',
          header: 'Status',
          render: () => (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-[6px] uppercase tracking-widest border border-emerald-100/50">
              Ativo
            </span>
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
      data={customers}
    />
  );
}
