import { getHouseById, getTasksByHouseId, getAmbianceRecordsByHouseId } from "../actions";
import { notFound } from "next/navigation";
import { HouseDetailsHeader } from "../../../components/houses/HouseDetailsHeader";
import { HouseQuickActions } from "../../../components/houses/HouseQuickActions";
import { HouseTaskList } from "../../../components/houses/HouseTaskList";
import { HouseAmbianceChart } from "../../../components/houses/HouseAmbianceChart";
import { DashboardGrid, DashboardCard } from "@/components/dashboard/DashboardGrid";
import { Activity, Thermometer, Wind, Gauge, Users, History } from "lucide-react";

interface HouseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function HouseDetailsPage({ params }: HouseDetailsPageProps) {
  const { id } = await params;
  const house = await getHouseById(id);

  if (!house) {
    notFound();
  }

  // Busca tarefas e registros de ambiência
  const tasks = await getTasksByHouseId(id);
  const ambianceRecords = await getAmbianceRecordsByHouseId(id);

  // Serialização para o cliente
  const serializedHouse = JSON.parse(JSON.stringify(house));
  const serializedTasks = JSON.parse(JSON.stringify(tasks));
  const serializedAmbiance = JSON.parse(JSON.stringify(ambianceRecords));

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pt-4 px-6">
      <HouseDetailsHeader house={serializedHouse} />
      
      <DashboardGrid cols={12}>
        {/* Lado Esquerdo - KPIs e Operação */}
        <div className="lg:col-span-8 space-y-8">
          <DashboardGrid cols={3}>
            {/* ... KPIs existing ... */}
            <DashboardCard span={1} className="p-10 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden relative group">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-[6px] bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform duration-500">
                    <Thermometer size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase">Temperatura</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">24.5<span className="text-lg text-slate-400 ml-1">°C</span></h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Status: Conforto Térmico</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard span={1} className="p-10 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden relative group">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-[6px] bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                    <Wind size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">Umidade</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">65<span className="text-lg text-slate-400 ml-1">%</span></h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Ideal para aves em postura</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard span={1} className="p-10 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden relative group">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-[6px] bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                    <Gauge size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase">Ventilação</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">1.2<span className="text-lg text-slate-400 ml-1">m/s</span></h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Exaustores em 40%</p>
                </div>
              </div>
            </DashboardCard>
          </DashboardGrid>

          {/* Checklist Operacional */}
          <HouseTaskList tasks={serializedTasks} />
          
          {/* Gráfico de Ambiência REAL */}
          <DashboardCard span={12} className="p-10 rounded-[6px] bg-white border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-[6px] bg-slate-900 text-white shadow-lg">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic text-slate-800 tracking-tight">Telemetria de Ambiência</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Histórico dos últimos 14 dias</p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-[6px] bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                Real-Time Data
              </div>
            </div>
            
            {serializedAmbiance.length > 0 ? (
              <HouseAmbianceChart records={serializedAmbiance} />
            ) : (
              <div className="h-48 w-full bg-slate-50/50 rounded-[6px] border-2 border-dashed border-slate-100 flex items-center justify-center">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Aguardando telemetria dos primeiros registros diários...</span>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Lado Direito - Ações e Lote Atual */}
        <div className="lg:col-span-4 space-y-6">
          <HouseQuickActions house={serializedHouse} />
          
          <DashboardCard span={12} className="p-8 rounded-[6px] bg-slate-900 text-white border-none shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
              <Users size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Lote Alojado</h4>
              {house.flock ? (
                <div>
                  <h3 className="text-2xl font-black italic tracking-tight">{house.flock.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">{house.flock.breed} • {house.flock.lineageStandard?.breedName || 'Linhagem Técnica'}</p>
                  
                  <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">População</p>
                      <p className="text-xl font-black italic">{(house.flock as any).currentQuantity?.toLocaleString('pt-BR') || '0'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Idade Atual</p>
                      <p className="text-xl font-black italic">34 <span className="text-xs font-bold not-italic">sem</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-[6px] bg-white/5">
                  <p className="text-sm text-slate-500 italic font-medium">Nenhum lote ativo no momento</p>
                  <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                    Alojar Novo Lote
                  </button>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard span={12} className="p-8 rounded-[6px] bg-white border-slate-100 shadow-sm overflow-hidden group">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-[6px] bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <History size={18} />
                </div>
                <h4 className="font-bold text-slate-900 tracking-tight">Vazio Sanitário</h4>
             </div>
             
             <div className="relative pt-1">
                <div className="flex mb-3 items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black inline-block py-1 px-2.5 uppercase rounded-lg text-indigo-600 bg-indigo-50 border border-indigo-100">
                      Progresso do Ciclo
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600">
                      0%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100">
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 w-0 transition-all duration-1000"></div>
                </div>
                <div className="p-4 rounded-[6px] bg-slate-50/50 border border-slate-100">
                  <p className="text-[10px] text-slate-500 text-center font-bold italic leading-relaxed">
                    Galpão ocupado. O período de vazio iniciará automaticamente após o encerramento do lote atual.
                  </p>
                </div>
              </div>
          </DashboardCard>
        </div>
      </DashboardGrid>
    </div>
  );
}
