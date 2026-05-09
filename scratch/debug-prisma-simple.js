
const prismaExports = require('@prisma/client');
console.log("Prisma Exports:", Object.keys(prismaExports));
if (prismaExports.TaskStatus) {
  console.log("TaskStatus Keys:", Object.keys(prismaExports.TaskStatus));
} else {
  console.log("TaskStatus NOT FOUND");
}
if (prismaExports.TaskPriority) {
  console.log("TaskPriority Keys:", Object.keys(prismaExports.TaskPriority));
} else {
  console.log("TaskPriority NOT FOUND");
}
