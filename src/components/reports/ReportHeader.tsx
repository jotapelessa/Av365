import React from 'react';
import { Zap } from 'lucide-react';

interface ReportHeaderProps {
  title: string;
  subtitle: string;
}

export default function ReportHeader({ title, subtitle }: ReportHeaderProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const today = mounted ? new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : "";

  return (
    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-8 mb-10">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <Zap size={32} className="fill-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">EggTrack <span className="text-primary italic">Elite</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Sistemas de Alta Performance</p>
        </div>
      </div>
      
      <div className="text-right">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 italic">{subtitle}</p>
        {mounted ? (
          <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Gerado em: {today}</p>
        ) : (
          <div className="h-3 w-40 bg-slate-100 animate-pulse mt-4 ml-auto rounded"></div>
        )}
      </div>
    </div>
  );
}
