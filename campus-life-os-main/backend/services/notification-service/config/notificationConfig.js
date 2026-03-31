export const notificationConfig = {
  port: Number(process.env.PORT || 4004),
  tasksServiceUrl: process.env.TASKS_SERVICE_URL || "http://localhost:4002",
}
