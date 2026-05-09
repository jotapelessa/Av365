import React from 'react';
import ProductionReportClient from "./ProductionReportClient";
import { getProductionData } from "./actions";

export default async function ProductionReportPage() {
  const { kpis, tableData } = await getProductionData();

  return (
    <ProductionReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
