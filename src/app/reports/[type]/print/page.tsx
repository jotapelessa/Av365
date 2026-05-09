import React from 'react';
import { notFound } from 'next/navigation';
import PrintReportViewer from "@/components/reports/PrintReportViewer";
import { getTenantDb } from "@/lib/tenant";

// Importações das Actions
import { getDreData } from "../../dre/actions";
import { getEquityData } from "../../equity/actions";
import { getProductionData } from "../../production/actions";
import { getHealthData } from "../../health/actions";
import { getSilosReportData } from "../../silos/actions";
import { getCustomersReportData } from "../../customers/actions";
import { getFlocksReportData } from "../../flocks/actions";
import { getEmployeesReportData } from "../../employees/actions";

// Formatação
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PrintPageProps {
  params: {
    type: string;
  };
}

export default async function ReportPrintPage({ params }: PrintPageProps) {
  const { type } = await params;
  console.log(`[PRINT_ENGINE] Generating report for type: ${type}`);

  let reportData: any = null;
  let columns: any[] = [];
  let title = "";
  let subtitle = "";

  let chartConfig: any = undefined;

  try {
    // Mapeamento de Relatórios
    switch (type) {
      case 'dre':
        reportData = await getDreData();
        title = "DRE Simplificado";
        subtitle = "Demonstrativo de Resultados";
        chartConfig = {
          type: 'bar',
          dataKey: 'profit',
          categoryKey: 'period',
          title: 'Evolução do Resultado Líquido',
          color: '#10b981'
        };
        break;

      case 'production':
        reportData = await getProductionData();
        title = "Eficiência Produtiva";
        subtitle = "Performance de Plantel";
        chartConfig = {
          type: 'line',
          dataKey: 'layRate',
          categoryKey: 'name',
          title: 'Taxa de Postura por Lote (%)',
          color: '#4f46e5'
        };
        break;

      case 'flocks':
        reportData = await getFlocksReportData();
        title = "Resumo de Lotes";
        subtitle = "Plantel Ativo";
        chartConfig = {
          type: 'bar',
          dataKey: 'quantity',
          categoryKey: 'name',
          title: 'Distribuição de Aves por Lote',
          color: '#818cf8'
        };
        break;

      case 'health':
        reportData = await getHealthData();
        title = "Mapa de Sanidade";
        subtitle = "Alertas e Vacinação";
        break;

      case 'silos':
        reportData = await getSilosReportData();
        title = "Inventário de Silos";
        subtitle = "Controle de Insumos";
        chartConfig = {
          type: 'bar',
          dataKey: 'currentStock',
          categoryKey: 'name',
          title: 'Nível de Estoque por Silo (t)',
          color: '#f59e0b'
        };
        break;

      case 'equity':
        reportData = await getEquityData();
        title = "Snapshot Patrimonial";
        subtitle = "Balanço de Ativos";
        break;

      case 'customers':
        reportData = await getCustomersReportData();
        title = "Ranking de Clientes";
        subtitle = "Análise Comercial";
        break;

      case 'employees':
        reportData = await getEmployeesReportData();
        title = "Desempenho de Equipe";
        subtitle = "Produtividade Operacional";
        break;

      case 'cash-flow':
        const db = await getTenantDb();
        const sales = await db.sale.findMany({ take: 50, orderBy: { date: 'desc' } });
        const expenses = await db.expense.findMany({ take: 50, orderBy: { date: 'desc' } });
        const totalIn = sales.reduce((acc: number, s: any) => acc + Number(s.amount), 0);
        const totalOut = expenses.reduce((acc: number, e: any) => acc + Number(e.amount), 0);
        
        reportData = {
          kpis: [
            { title: "Entradas", value: `R$ ${totalIn.toLocaleString('pt-BR')}` },
            { title: "Saídas", value: `R$ ${totalOut.toLocaleString('pt-BR')}` },
            { title: "Fluxo Líquido", value: `R$ ${(totalIn - totalOut).toLocaleString('pt-BR')}` }
          ],
          tableData: [
            ...sales.map((s: any) => ({ ...s, type: 'Receita', val: Number(s.amount), displayDate: format(new Date(s.date), "dd/MM") })),
            ...expenses.map((e: any) => ({ ...e, type: 'Despesa', val: Number(e.amount), displayDate: format(new Date(e.date), "dd/MM") }))
          ].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        };
        title = "Fluxo de Caixa";
        subtitle = "Análise Consolidada";
        chartConfig = {
          type: 'area',
          dataKey: 'val',
          categoryKey: 'displayDate',
          title: 'Histórico de Transações (R$)',
          color: '#4f46e5'
        };
        break;

      default:
        notFound();
    }

    return (
      <PrintReportViewer 
        title={title}
        subtitle={subtitle}
        type={type}
        kpis={JSON.parse(JSON.stringify(reportData.kpis))}
        data={JSON.parse(JSON.stringify(reportData.tableData))}
        chartConfig={chartConfig}
      />
    );
  } catch (error) {
    console.error("Error generating print report:", error);
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-black text-rose-600 uppercase mb-4">Erro ao Gerar Impressão</h1>
        <p className="text-sm text-slate-500">Ocorreu um problema ao carregar os dados do relatório. Por favor, tente novamente.</p>
        <pre className="mt-4 p-4 bg-slate-50 rounded text-[10px] text-left overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
