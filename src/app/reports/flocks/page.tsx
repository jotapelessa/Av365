import React from 'react';
import FlocksReportClient from "./FlocksReportClient";
import { getFlocksReportData } from "./actions";

export default async function FlocksReportPage() {
  const { kpis, tableData } = await getFlocksReportData();

  return (
    <FlocksReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
