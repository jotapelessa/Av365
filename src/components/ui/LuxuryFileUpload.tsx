'use client';

import { useState, useRef } from "react";
import { Upload, FileText, X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LuxuryFileUploadProps {
  onUpload?: (url: string) => void;
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  accept?: string;
  maxSize?: number;
}

export default function LuxuryFileUpload({ 
  onUpload, 
  onFilesSelected,
  label = "Comprovante / NF",
  accept = "image/*,application/pdf",
  maxSize
}: LuxuryFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (maxSize && selected.size > maxSize) {
        alert("Arquivo muito grande");
        return;
      }
      setFile(selected);
      if (onFilesSelected) {
        onFilesSelected(Array.from(e.target.files || []));
      } else {
        simulateUpload();
      }
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    // Simulação de elite
    setTimeout(() => {
      setUploading(false);
      setDone(true);
      onUpload?.("https://simulated-storage.av365.com/nf-" + Math.random().toString(36).substring(7));
    }, 2500);
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
        <Upload size={14} className="text-rose-500" /> {label}
      </label>
      
      <div 
        onClick={() => !file && inputRef.current?.click()}
        className={`relative h-24 border-2 border-dashed rounded-[24px] transition-all flex items-center justify-center cursor-pointer group overflow-hidden ${
          done ? 'border-emerald-200 bg-emerald-50/30' : 
          uploading ? 'border-indigo-100 bg-indigo-50/10' : 
          'border-slate-100 bg-slate-50/30 hover:border-rose-200 hover:bg-rose-50/10'
        }`}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept={accept}
        />

        <AnimatePresence mode="wait">
          {!file && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <Upload size={20} className="text-slate-300 group-hover:text-rose-500 group-hover:scale-110 transition-all" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clique para anexar</p>
            </motion.div>
          )}

          {uploading && (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <Loader2 size={24} className="text-indigo-500 animate-spin" />
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] animate-pulse">Sincronizando com a Nuvem...</p>
            </motion.div>
          )}

          {done && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 px-6 w-full"
            >
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-md flex items-center justify-center shadow-lg shadow-emerald-100">
                <Check size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate tracking-tight">{file?.name}</p>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  <FileText size={10} /> Arquivo Segurado
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="p-2 hover:bg-white rounded-md text-slate-400 hover:text-rose-600 transition-all shadow-sm"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 bg-indigo-500"
            style={{ width: '100%' }}
          />
        )}
      </div>
    </div>
  );
}
