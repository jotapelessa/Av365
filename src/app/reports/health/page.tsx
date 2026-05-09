import React from 'react';
import HealthReportClient from "./HealthReportClient";
import { getHealthData } from "./actions";

export default async function HealthReportPage() {
  const { kpis, tableData } = await getHealthData();

  return (
    <HealthReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
