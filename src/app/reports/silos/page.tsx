import React from 'react';
import SilosReportClient from "./SilosReportClient";
import { getSilosReportData } from "./actions";

export default async function SilosReportPage() {
  const { kpis, tableData } = await getSilosReportData();

  return (
    <SilosReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
