import { db } from "@/lib/prisma";
import { Zap, Palette } from "lucide-react";
import DesignEditorClient from "./DesignEditorClient";

export default async function DesignSystemPage() {
  const config = await db.globalConfig.findUnique({
    where: { id: "default" }
  });

  const designConfig = (config as any)?.designConfig ? JSON.parse(JSON.stringify((config as any).designConfig)) : null;

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Palette size={12} /> Design Architect
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1 italic">Elite Design Engine</h1>
          <p className="text-slate-500 text-sm font-medium">Orquestração estética e padronização visual do ecossistema AV365.</p>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 rotate-3">
            <Zap size={20} fill="white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UI Framework</p>
            <p className="text-sm font-black text-slate-900 leading-none italic">Agrotech v4.0</p>
          </div>
        </div>
      </header>

      <DesignEditorClient initialConfig={designConfig} />
    </div>
  );
}
