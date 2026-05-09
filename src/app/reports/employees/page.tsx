import React from 'react';
import EmployeesReportClient from "./EmployeesReportClient";
import { getEmployeesReportData } from "./actions";

export default async function EmployeesReportPage() {
  const { kpis, tableData } = await getEmployeesReportData();

  return (
    <EmployeesReportClient 
      kpis={JSON.parse(JSON.stringify(kpis))} 
      tableData={JSON.parse(JSON.stringify(tableData))} 
    />
  );
}
