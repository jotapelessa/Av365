'use client';

import React, { useState, useTransition } from 'react';
import { 
  Package, 
  Plus, 
  Upload, 
  AlertTriangle, 
  TrendingUp, 
  History,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuxuryTable } from '@/components/ui/LuxuryTable';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import LuxuryFileUpload from '@/components/ui/LuxuryFileUpload';
import LuxuryKpiCard from '@/components/ui/LuxuryKpiCard';
import { toast } from 'sonner';
import { processNFeUpload, conciliateAndFinalize } from './actions';
import InventoryItemModal from './InventoryItemModal';

interface InventoryClientProps {
  initialItems: any[];
  categories: any[];
  metrics: {
    totalValue: number;
    totalBirds: number;
    costPerBird: number;
    criticalItems: number;
    totalItems: number;
  };
  producerId: string;
}

export default function InventoryClient({ 
  initialItems, 
  categories, 
  metrics,
  producerId 
}: InventoryClientProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [conciliationData, setConciliationData] = useState<any>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const xmlContent = e.target?.result as string;
      
      startTransition(async () => {
        try {
          const result = await processNFeUpload(xmlContent);
          if (result.success) {
            setConciliationData(result);
            setUploadModalOpen(false);
            toast.success("NF-e processada! Verifique o mapeamento de produtos.");
          }
        } catch (error: any) {
          toast.error(`Erro ao processar XML: ${error.message}`);
        }
      });
    };
    
    reader.readAsText(file);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Produto',
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-900">{item.name}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.category?.name || 'Sem Categoria'}</span>
        </div>
      )
    },
    { 
      key: 'currentStock', 
      header: 'Estoque',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <span className={`font-black ${item.currentStock <= item.minStock ? 'text-rose-500' : 'text-slate-900'}`}>
            {item.currentStock} {item.unit}
          </span>
          {item.currentStock <= item.minStock && <AlertTriangle size={14} className="text-rose-500" />}
        </div>
      )
    },
    { 
      key: 'averageCost', 
      header: 'Custo Médio',
      render: (item: any) => (
        <span className="font-bold text-slate-600">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.averageCost))}
        </span>
      )
    },
    {
      key: 'totalValue',
      header: 'Valor Total',
      render: (item: any) => (
        <span className="font-black text-indigo-600">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.currentStock) * Number(item.averageCost))}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header Operational */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <Package size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900">Estoque Inteligente</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gestão de Insumos e Automação de NF-e</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LuxuryButton 
            onClick={() => setUploadModalOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <Upload size={18} strokeWidth={3} />
            Importar NF-e
          </LuxuryButton>
          <LuxuryButton 
            onClick={() => {
              setSelectedItem(null);
              setItemModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            Novo Item
          </LuxuryButton>
        </div>
      </div>

      {/* KPIs Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <LuxuryKpiCard 
          title="Patrimônio em Estoque"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalValue)}
          icon="trending-up"
          trend={{ value: "+12%", label: "vs mês ant." }}
        />
        <LuxuryKpiCard 
          title="Custo Diário / Ave"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.costPerBird)}
          icon="trending-up"
          description={`Baseado em ${metrics.totalBirds} aves`}
          variant={metrics.costPerBird > 0.5 ? "secondary" : "primary"}
        />
        <LuxuryKpiCard 
          title="Itens Críticos"
          value={metrics.criticalItems.toString()}
          icon="alert-triangle"
          variant={metrics.criticalItems > 0 ? "secondary" : "primary"}
        />
        <LuxuryKpiCard 
          title="Total de Items"
          value={metrics.totalItems.toString()}
          icon="package"
        />
      </div>

      {/* Tabela Principal */}
      <div className="bento-card-elite !p-0 overflow-hidden border-none shadow-2xl rounded-[18px]">
        <LuxuryTable 
          columns={columns}
          data={items}
          isLoading={isPending}
        />
      </div>

      {/* Modal de Upload */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[18px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black italic tracking-tighter">Importar XML de NF-e</h3>
                <button onClick={() => setUploadModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-10">
                <LuxuryFileUpload 
                  onFilesSelected={handleFileUpload}
                  accept=".xml"
                  maxSize={5 * 1024 * 1024}
                />
                <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Arraste o arquivo .xml da sua nota fiscal para iniciar o mapeamento.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {conciliationData && (
          <ConciliationModal 
            data={conciliationData} 
            categories={categories}
            internalItems={items}
            producerId={producerId}
            onClose={() => setConciliationData(null)}
          />
        )}
      </AnimatePresence>

      <InventoryItemModal 
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        item={selectedItem}
        categories={categories}
      />
    </div>
  );
}

interface ConciliationModalProps {
  data: any;
  categories: any[];
  internalItems: any[];
  producerId: string;
  onClose: () => void;
}

// Subcomponente de Conciliação
function ConciliationModal({ data, categories, internalItems, producerId, onClose }: ConciliationModalProps) {
  const [mappings, setMappings] = useState<any[]>(
    data.mappingResults.map((m: any) => ({
      nfeProdName: m.nfeProduct.name,
      internalItemId: m.mappedItem?.id || '',
      quantity: m.nfeProduct.quantity,
      unitCost: m.nfeProduct.unitValue,
      code: m.nfeProduct.code,
      batchNumber: m.nfeProduct.batch || '',
      expiryDate: m.nfeProduct.expiryDate || ''
    }))
  );
  const [isFinishing, startFinish] = useTransition();

  const handleFinish = async () => {
    const unmapped = mappings.some(m => !m.internalItemId);
    if (unmapped) {
      toast.error("Por favor, vincule todos os produtos da nota fiscal.");
      return;
    }

    startFinish(async () => {
      try {
        await conciliateAndFinalize(producerId, data.supplierId, mappings);
        toast.success("Estoque atualizado com sucesso!");
        onClose();
      } catch (err: any) {
        toast.error(`Erro ao finalizar: ${err.message}`);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-[24px] flex flex-col shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/20"
      >
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
          <div>
            <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">Conciliação de Nota Fiscal</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mt-1">Fornecedor: {data.nfeData.issuer.name}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="space-y-6">
            {mappings.map((m, idx) => (
              <div key={idx} className="p-8 rounded-[24px] border border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black bg-slate-50 px-2 py-1 border border-slate-100 rounded-[6px] text-slate-400">{m.code}</span>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{m.nfeProdName}</h4>
                  </div>
                  <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Qtd: <span className="text-slate-900">{m.quantity}</span></span>
                    <span>Custo: <span className="text-emerald-600">R$ {m.unitCost.toFixed(2)}</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-[2]">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Item Interno</label>
                    <select 
                      className="w-full h-12 px-4 rounded-[14px] border border-slate-100 bg-slate-50/50 font-bold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none cursor-pointer shadow-inner-sm"
                      value={m.internalItemId}
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        newMappings[idx].internalItemId = e.target.value;
                        setMappings(newMappings);
                      }}
                    >
                      <option value="">Vincular Produto...</option>
                      {internalItems.map((ii: any) => (
                        <option key={ii.id} value={ii.id}>{ii.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Lote</label>
                    <input 
                      type="text"
                      className="w-full h-12 px-4 rounded-[14px] border border-slate-100 bg-slate-50/50 font-bold text-slate-700 focus:border-indigo-500 outline-none shadow-inner-sm"
                      value={m.batchNumber}
                      placeholder="N/A"
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        newMappings[idx].batchNumber = e.target.value;
                        setMappings(newMappings);
                      }}
                    />
                  </div>

                  <div className="w-44">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Validade</label>
                    <input 
                      type="date"
                      className="w-full h-12 px-4 rounded-[14px] border border-slate-100 bg-slate-50/50 font-bold text-slate-700 focus:border-indigo-500 outline-none shadow-inner-sm"
                      value={m.expiryDate}
                      onChange={(e) => {
                        const newMappings = [...mappings];
                        newMappings[idx].expiryDate = e.target.value;
                        setMappings(newMappings);
                      }}
                    />
                  </div>
                </div>

                <div className="ml-2">
                  {m.internalItemId ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : (
                    <AlertTriangle className="text-amber-500" size={24} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-sm font-bold text-slate-500">
            Total da Nota: <span className="text-xl font-black text-slate-900 ml-2">R$ {data.nfeData.totalValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-4">
            <LuxuryButton onClick={onClose} variant="secondary">Cancelar</LuxuryButton>
            <LuxuryButton onClick={handleFinish} isLoading={isFinishing}>Finalizar Entrada</LuxuryButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
