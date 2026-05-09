'use server';

import { getTenantDb } from "@/lib/tenant";

export async function getEmployeesReportData() {
  const db = await getTenantDb();

  const users = await db.user.findMany({
    where: { role: 'EMPLOYEE' },
    include: {
      tasks: true
    }
  });

  const totalEmployees = users.length;
  const totalTasks = users.reduce((acc, u) => acc + u.tasks.length, 0);
  const completedTasks = users.reduce((acc, u) => acc + u.tasks.filter(t => t.status === 'COMPLETED').length, 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tableData = users.map(u => {
    const userTasks = u.tasks;
    const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
    const pending = userTasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
    const rate = userTasks.length > 0 ? (completed / userTasks.length) * 100 : 0;

    return {
      id: u.id,
      name: u.name || "Sem Nome",
      email: u.email,
      total: userTasks.length,
      completed,
      pending,
      rate
    };
  }).sort((a, b) => b.rate - a.rate);

  return {
    kpis: [
      { title: "Mão de Obra Ativa", value: totalEmployees.toString(), icon: "users" },
      { title: "Total de Tarefas", value: totalTasks.toString(), icon: "package" },
      { title: "Taxa de Conclusão", value: `${completionRate.toFixed(1)}%`, icon: "trending-up" },
      { title: "Pendências Críticas", value: (totalTasks - completedTasks).toString(), icon: "alert-triangle", trend: "Atenção" }
    ],
    tableData
  };
}
