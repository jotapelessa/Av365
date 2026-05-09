import React from 'react';
import EquityReportClient from "./EquityReportClient";
import { getEquityData } from "./actions";

export default async function EquityReportPage() {
  const { kpis, tableData } = await getEquityData();

  return (
    <EquityReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
