'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Syringe, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Info,
  Calendar,
  Thermometer,
  Droplets,
  Bird,
  Plus,
  History,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import LuxuryKpiCard from '@/components/ui/LuxuryKpiCard';
import { DashboardGrid } from '@/components/dashboard/DashboardGridContainer';
import { DashboardCard } from '@/components/dashboard/DashboardGrid';
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calculateFlockAge } from '@/lib/poultry-health';
import { generateVaccinationSchedule } from './actions';
import { toast } from 'sonner';
import { MortalityChart } from './HealthCharts';

interface HealthClientProps {
  flocks: any[];
  vaccinations: any[];
  vaccines: any[];
  tasks: any[];
  dailyRecords: any[];
  producerId: string;
}

export default function HealthClient({ 
  flocks, 
  vaccinations, 
  vaccines,
  tasks,
  dailyRecords,
  producerId 
}: HealthClientProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerateSchedule = async (flockId: string) => {
    setIsGenerating(flockId);
    try {
      await generateVaccinationSchedule(flockId);
      toast.success("Cronograma vacinal gerado com sucesso!");
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setIsGenerating(null);
    }
  };
  
  const calculateHealthScore = (flock: any) => {
    const lastRecord = flock.records[0];
    if (!lastRecord) return 100;
    const dailyMortalityRate = (lastRecord.mortality / flock.currentQuantity) * 100;
    let score = 100;
    if (dailyMortalityRate > 0.1) score -= 20;
    if (dailyMortalityRate > 0.5) score -= 40;
    if ((flock.healthAlerts?.length || 0) > 0) score -= 15 * (flock.healthAlerts?.length || 0);
    return Math.max(0, score);
  };

  return (
    <div className="space-y-10" data-audit="health__root">
      {/* Header Operacional */}
      <div className="flex items-center justify-between" data-audit="health__header">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm" data-audit="health__header__icon">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900" data-audit="health__header__title">Health Hub</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" data-audit="health__header__subtitle">Vigor do Plantel e Biosseguridade</p>
          </div>
        </div>

        <div className="flex items-center gap-4" data-audit="health__header__actions">
          <LuxuryButton variant="secondary" className="gap-2" data-audit="health__action__checkup">
            <Activity size={18} strokeWidth={3} />
            Check-up Geral
          </LuxuryButton>
          <LuxuryButton className="gap-2" data-audit="health__action__register-vaccine">
            <Plus size={18} strokeWidth={3} />
            Registrar Vacinação
          </LuxuryButton>
        </div>
      </div>

      {/* KPI Row */}
      <DashboardGrid className="gap-6" auditId="health__grid__kpis">
        <DashboardCard span={3} auditId="health__kpi__vigor-medio" noPadding className="!bg-transparent !border-none !shadow-none">
          <LuxuryKpiCard 
            title="Vigor Médio"
            value={`${Math.round(flocks.reduce((acc: number, f: any) => acc + calculateHealthScore(f), 0) / (flocks.length || 1))}%`}
            icon="trending-up"
            trend="+2.5%"
            className="w-full h-full"
          />
        </DashboardCard>
        <DashboardCard span={3} auditId="health__kpi__biosseguridade" noPadding className="!bg-transparent !border-none !shadow-none">
          <LuxuryKpiCard 
            title="Biosseguridade"
            value="Seguro"
            icon="history"
            className="w-full h-full"
          />
        </DashboardCard>
        <DashboardCard span={3} auditId="health__kpi__alertas-ativos" noPadding className="!bg-transparent !border-none !shadow-none">
          <LuxuryKpiCard 
            title="Alertas Ativos"
            value={flocks.reduce((acc: number, f: any) => acc + (f.healthAlerts?.length || 0), 0).toString()}
            icon="alert-triangle"
            className="w-full h-full"
          />
        </DashboardCard>
        <DashboardCard span={3} auditId="health__kpi__vacinas-proximas" noPadding className="!bg-transparent !border-none !shadow-none">
          <LuxuryKpiCard 
            title="Vacinas Próximas"
            value="3"
            icon="plus"
            className="w-full h-full"
          />
        </DashboardCard>
      </DashboardGrid>

      {/* Flock Health Grid */}
      <DashboardGrid className="gap-8" auditId="health__grid__main">
        <DashboardCard span={8} noPadding className="space-y-6 !bg-transparent !border-none !shadow-none" auditId="health__section__flocks">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2" data-audit="health__flocks__title">Monitoramento por Lote</h2>
          {flocks.map((flock: any) => {
            const score = calculateHealthScore(flock);
            return (
              <div 
                key={flock.id} 
                data-audit={`health__flock-card__${flock.id}`}
                className="bg-white rounded-[18px] border border-slate-50 p-8 shadow-sm group hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div 
                      data-audit={`health__flock-card__icon-${flock.id}`}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${score > 80 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}
                    >
                      <Bird size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase" data-audit={`health__flock-card__name-${flock.id}`}>
                        {flock.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1" data-audit={`health__flock-card__meta-${flock.id}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flock.breed}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{flock.houses?.[0]?.name || 'Sem Galpão'}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          {calculateFlockAge(flock.arrivalDate)} Dias de Vida
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div 
                      data-audit={`health__flock-card__score-${flock.id}`}
                      className={`text-4xl font-black italic tracking-tighter ${score > 80 ? 'text-emerald-500' : 'text-rose-500'}`}
                    >
                      {score}%
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Health Score</p>
                  </div>
                </div>

                {/* Progress Bar Luxury */}
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden mb-8 border border-slate-100" data-audit={`health__flock-card__progress-${flock.id}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className={`h-full ${score > 80 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}
                  />
                </div>

                {/* Mortality Analysis Chart */}
                <div className="mb-8 p-6 rounded-2xl bg-slate-50/50 border border-slate-100" data-audit={`health__flock-card__chart-${flock.id}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mortalidade Acumulada</h4>
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded">Real vs Padrão</span>
                  </div>
                  <MortalityChart data={dailyRecords.filter(r => r.flockId === flock.id)} />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8" data-audit={`health__flock-card__footer-${flock.id}`}>
                  <div className="space-y-1" data-audit={`health__flock-card__temp-${flock.id}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ambiência</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Thermometer size={14} className="text-rose-400" />
                      24.5°C
                    </div>
                  </div>
                  <div className="space-y-1" data-audit={`health__flock-card__humidity-${flock.id}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Umidade</p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Droplets size={14} className="text-indigo-400" />
                      65%
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleGenerateSchedule(flock.id)}
                      disabled={isGenerating === flock.id}
                      data-audit={`health__flock-card__action-auto-vaccine-${flock.id}`}
                      className="flex items-center gap-2 text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      <Zap size={12} className="fill-indigo-600" />
                      {isGenerating === flock.id ? 'Gerando...' : 'Auto-Vacinas'}
                    </button>
                    <button 
                      data-audit={`health__flock-card__action-details-${flock.id}`}
                      className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:translate-x-1 transition-transform"
                    >
                      Detalhes <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </DashboardCard>

        {/* Sidebar Health Alerts */}
        <DashboardCard span={4} noPadding className="space-y-8 !bg-transparent !border-none !shadow-none" auditId="health__section__sidebar">
          <div className="bg-slate-900 text-white rounded-[18px] p-6 shadow-lg border border-slate-800" data-audit="health__sidebar__vaccines">
            <div className="flex items-center gap-3 mb-6">
              <Syringe size={20} className="text-indigo-400" />
              <h2 className="text-xs font-black uppercase tracking-widest">Próximas Vacinas</h2>
            </div>
            <div className="space-y-4">
              {tasks.length > 0 ? tasks.slice(0, 4).map((task: any) => (
                <div 
                  key={task.id} 
                  data-audit={`health__sidebar__vaccine-item-${task.id}`}
                  className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">
                      {task.title.replace('Vacinação: ', '')}
                    </span>
                    <span className="text-[9px] font-black uppercase text-slate-500">
                      {differenceInDays(new Date(task.dueDate), new Date()) <= 0 ? 'Hoje' : `Em ${differenceInDays(new Date(task.dueDate), new Date())} dias`}
                    </span>
                  </div>
                  <p className="text-sm font-black italic tracking-tight">{task.flock?.name}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/20 border-2 border-slate-800 flex items-center justify-center">
                        <Activity size={10} className="text-indigo-400" />
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-slate-700 text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                      Pendente
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center" data-audit="health__sidebar__vaccines-empty">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nenhuma vacina agendada</p>
                </div>
              )}
            </div>
            <LuxuryButton 
              data-audit="health__sidebar__action-view-calendar"
              className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-100"
            >
              Ver Calendário
            </LuxuryButton>
          </div>

          <div className="bg-white rounded-[18px] border border-slate-50 p-6 shadow-sm" data-audit="health__sidebar__alerts">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={20} className="text-rose-500" />
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Alertas Ativos</h2>
            </div>
            <div className="space-y-4">
              {flocks.flatMap(f => f.healthAlerts || []).slice(0, 3).map((alert: any) => (
                <div 
                  key={alert.id} 
                  data-audit={`health__sidebar__alert-item-${alert.id}`}
                  className="p-4 rounded-xl bg-rose-50/50 border border-rose-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest">{alert.type}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{alert.description}</p>
                </div>
              ))}
              {flocks.flatMap(f => f.healthAlerts || []).length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center" data-audit="health__sidebar__alerts-empty">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                    <ShieldCheck size={24} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum alerta ativo</p>
                </div>
              )}
            </div>
          </div>
        </DashboardCard>
      </DashboardGrid>
    </div>
  );
}
