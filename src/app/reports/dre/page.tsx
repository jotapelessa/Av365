import React from 'react';
import DreReportClient from "./DreReportClient";
import { getDreData } from "./actions";

export default async function DreReportPage() {
  const { kpis, tableData } = await getDreData();

  return (
    <DreReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
