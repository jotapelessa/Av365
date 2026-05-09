'use client';

import React from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  ClipboardList, 
  ArrowRight,
  TrendingDown,
  ArrowLeft,
  Zap
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { FlockVitalStatsHub } from "@/components/flocks/FlockVitalStatsHub";
import { ReplacementTimerCard } from "@/components/flocks/ReplacementTimerCard";
import { PredictiveProductionChart } from "@/components/flocks/PredictiveProductionChart";
import { ProductionInsights } from "@/components/flocks/ProductionInsights";
import { DashboardContainer, DashboardItem } from "@/components/dashboard/DashboardClient";
import { DashboardCard } from "@/components/dashboard/DashboardGrid";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { LuxuryTable } from "@/components/ui/LuxuryTable";
import { seedSingleFlockHistory } from '@/app/finance/actions';

interface FlockDetailsClientProps {
  flock: any;
  stats: any;
  prediction: any;
  ageWeeks: number;
  realRate: number;
  idealRate: number;
}

export default function FlockDetailsClient({
  flock,
  stats,
  prediction,
  ageWeeks,
  realRate,
  idealRate
}: FlockDetailsClientProps) {
  const latestRecord = flock.records[0];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <DashboardContainer>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-6">
            <Link 
              href="/flocks" 
              className="p-4 rounded-[20px] bg-white shadow-sm text-slate-400 hover:text-primary hover:shadow-md transition-all active:scale-95 border border-slate-100"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
                  {flock.name}
                </h1>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest border border-emerald-200">
                  {flock.status}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {flock.breed} • {flock.houses[0]?.name || 'Sem Galpão'} • Linhagem {flock.lineageStandard?.breedName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LuxuryButton 
              variant="outline"
              icon="plus"
              onClick={async () => {
                if (confirm("Deseja povoar este lote com 1 ano de dados históricos? (Pode levar alguns segundos)")) {
                  await seedSingleFlockHistory(flock.id);
                  window.location.reload();
                }
              }}
            >
              Povoar 1 Ano
            </LuxuryButton>
            <LuxuryButton 
              variant="outline"
              icon="pencil"
            >
              Editar Lote
            </LuxuryButton>
            <LuxuryButton 
              href={`/flocks/${flock.id}/record`}
              variant="primary"
              icon="plus"
            >
              Novo Registro
            </LuxuryButton>
          </div>
        </div>

        {/* Alerta de Queda de Produção */}
        {prediction?.productionDrop && (
          <div className="mb-8 p-6 rounded-[22px] bg-rose-50 border border-rose-100 flex items-center gap-6 text-rose-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-3 rounded-md bg-rose-100">
              <TrendingDown size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Alerta Bio-Técnico: Queda de Produção Detectada</h4>
              <p className="text-xs font-bold opacity-80 italic">Produção caiu {prediction.dropValue}% nos últimos 3 dias em relação à semana anterior.</p>
            </div>
            <button className="ml-auto px-4 py-2 rounded-md bg-rose-100 hover:bg-rose-200 text-[9px] font-black uppercase tracking-widest transition-colors">
              Analisar Causas
            </button>
          </div>
        )}

        <div className="mb-8">
          <FlockVitalStatsHub stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <PredictiveProductionChart 
              records={flock.records}
              flockQuantity={flock.currentQuantity}
              lineageStandard={flock.lineageStandard}
              birthDate={flock.birthDate || flock.acquisitionDate}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ProductionInsights 
                 realRate={realRate}
                 idealRate={idealRate}
                 breedName={flock.lineageStandard?.breedName || 'N/A'}
                 week={ageWeeks}
               />
               <ReplacementTimerCard prediction={prediction} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <DashboardCard className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-none shadow-2xl shadow-indigo-200/50 text-white relative overflow-hidden group !p-10">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Thermometer size={140} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4">Temperatura Interna</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-7xl font-black italic tracking-tighter">
                    {latestRecord?.temperature ? latestRecord.temperature.toFixed(1) : '--'}
                  </span>
                  <span className="text-2xl font-black text-indigo-200 tracking-tighter">ºC</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 w-fit">
                  <div className={`h-2 w-2 rounded-full ${latestRecord?.temperature && latestRecord.temperature > 28 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {latestRecord?.temperature && latestRecord.temperature > 28 ? 'Estresse Térmico' : 'Conforto Ideal'}
                  </span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="relative overflow-hidden group !p-10">
              <div className="absolute -right-4 -top-4 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-700">
                <Droplets size={140} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Umidade Relativa</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-7xl font-black italic tracking-tighter text-slate-800">
                    {latestRecord?.humidity ? latestRecord.humidity.toFixed(1) : '--'}
                  </span>
                  <span className="text-2xl font-black text-slate-300 tracking-tighter">%</span>
                </div>
                <p className="text-xs font-bold text-slate-400 italic leading-relaxed">
                  Padrão genético exige umidade entre 50% e 70% para otimizar conversão.
                </p>
              </div>
            </DashboardCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <DashboardCard className="!p-0 overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-md bg-slate-100 text-slate-500">
                    <ClipboardList size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 italic">Livro de Campo</h3>
                </div>
                <Link href={`/flocks/${flock.id}/history`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Histórico Completo</Link>
              </div>

              <LuxuryTable 
                columns={[
                  {
                    key: 'date',
                    header: 'Data / Idade',
                    render: (record) => {
                      const recDate = new Date(record.date);
                      const birthDate = new Date(flock.birthDate || flock.acquisitionDate);
                      const ageDays = differenceInDays(recDate, birthDate);
                      const ageWeeks = Math.floor(ageDays / 7);
                      return (
                        <div className="px-2">
                          <p className="text-sm font-black text-slate-700">{format(recDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
                          <p className="text-[9px] font-bold text-slate-400 italic uppercase">
                            Semana {ageWeeks} <span className="mx-1">•</span> Dia {ageDays % 7}
                          </p>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'production',
                    header: 'Produção & Qualidade',
                    render: (record) => {
                      const postureRate = (record.eggsTotal / flock.currentQuantity) * 100;
                      return (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{record.eggsTotal.toLocaleString('pt-BR')}</span>
                            <span className={`text-[10px] font-black ${postureRate >= 95 ? 'text-emerald-500' : 'text-amber-500'}`}>
                              ({postureRate.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Quebrados: {record.eggsBroken}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Sujos: {record.eggsDirty}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'mortality',
                    header: 'Mortalidade',
                    render: (record) => {
                      const mortalityRate = (record.mortality / flock.currentQuantity) * 100;
                      return (
                        <div className="flex flex-col">
                          <span className={`text-sm font-black ${record.mortality > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {record.mortality} aves
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            {mortalityRate.toFixed(3)}% do lote
                          </span>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'nutrition',
                    header: 'Nutrição & Hidratação',
                    render: (record) => {
                      const feedPerBird = (record.feedConsumed * 1000) / flock.currentQuantity;
                      return (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Zap size={10} className="text-amber-500" />
                            <span className="text-sm font-black text-slate-700">{feedPerBird.toFixed(1)} g/ave</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets size={10} className="text-indigo-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Água: {record.waterConsumed?.toFixed(1) || '--'} L
                            </span>
                          </div>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'ambiance',
                    header: 'Ambiência',
                    render: (record) => (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Thermometer size={12} className="text-rose-400" />
                          <span className="text-xs font-black text-slate-600">{record.temperature?.toFixed(1) || '--'}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind size={12} className="text-indigo-400" />
                          <span className="text-xs font-black text-slate-600">{record.humidity?.toFixed(0) || '--'}%</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'actions',
                    header: '',
                    className: 'text-right',
                    render: (record) => (
                      <Link 
                        href={`/flocks/${flock.id}/record/${record.id}`}
                        className="p-2.5 rounded-md bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all inline-block"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    )
                  }
                ]}
                data={flock.records.slice(0, 10)}
              />
            </DashboardCard>
          </div>
        </div>
      </DashboardContainer>
    </div>
  );
}
