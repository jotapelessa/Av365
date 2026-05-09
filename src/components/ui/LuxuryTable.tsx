'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Column {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
  className?: string;
}

interface LuxuryTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  variant?: 'light' | 'dark';
}

export const LuxuryTable: React.FC<LuxuryTableProps> = ({
  columns,
  data,
  onRowClick,
  isLoading = false,
  variant = 'light'
}) => {
  const themes = {
    light: {
      container: 'bg-white border-slate-200 shadow-sm',
      header: 'bg-slate-50 border-slate-100',
      headerText: 'text-slate-400',
      row: 'hover:bg-indigo-50/50 border-slate-100',
      cellText: 'text-slate-600',
    },
    dark: {
      container: 'bg-slate-900/40 backdrop-blur-2xl border-slate-800 shadow-xl',
      header: 'bg-slate-900/60 border-slate-800/50',
      headerText: 'text-slate-500',
      row: 'hover:bg-slate-800/30 border-slate-800/30',
      cellText: 'text-slate-300',
    }
  };

  const theme = themes[variant];

  return (
    <div className={`w-full overflow-hidden rounded-[18px] border ${theme.container}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`${theme.header} border-b`}>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`p-6 text-[10px] font-black uppercase tracking-[0.2em] ${theme.headerText} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.row.split(' ')[1]}`}>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="p-6">
                      <div className="h-4 bg-slate-100 rounded-lg w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id || index}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    group transition-all ${theme.row}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`p-6 text-sm font-medium ${theme.cellText} ${col.className || ''}`}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="p-20 text-center text-slate-400 italic text-sm font-medium"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
