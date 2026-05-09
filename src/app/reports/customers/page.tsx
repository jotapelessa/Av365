import React from 'react';
import CustomersReportClient from "./CustomersReportClient";
import { getCustomersReportData } from "./actions";

export default async function CustomersReportPage() {
  const { kpis, tableData } = await getCustomersReportData();

  return (
    <CustomersReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
