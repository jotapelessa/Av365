import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const producerId = orgId || userId;

  const [tasks, houses, flocks, employees, customers, suppliers, inventoryItems] = await Promise.all([
    prisma.task.findMany({
      where: { producerId },
      include: {
        assignedTo: true,
        house: true,
        flock: true,
        customer: true,
        supplier: true,
        inventoryItem: true
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.house.findMany({ where: { producerId } }),
    prisma.flock.findMany({ where: { producerId, status: 'ACTIVE' } }),
    prisma.user.findMany({ 
      where: { 
        producerId,
        role: { in: ['EMPLOYEE', 'PRODUCER', 'VETERINARIAN', 'TECHNICAL_ASSISTANT'] } 
      } 
    }),
    prisma.customer.findMany({ where: { producerId } }),
    prisma.supplier.findMany({ where: { producerId } }),
    prisma.inventoryItem.findMany({ where: { producerId } })
  ]);

  return (
    <div className="p-10">
      <TasksClient 
        initialTasks={JSON.parse(JSON.stringify(tasks))}
        houses={JSON.parse(JSON.stringify(houses))}
        flocks={JSON.parse(JSON.stringify(flocks))}
        employees={JSON.parse(JSON.stringify(employees))}
        customers={JSON.parse(JSON.stringify(customers))}
        suppliers={JSON.parse(JSON.stringify(suppliers))}
        inventoryItems={JSON.parse(JSON.stringify(inventoryItems))}
        producerId={producerId}
      />
    </div>
  );
}
