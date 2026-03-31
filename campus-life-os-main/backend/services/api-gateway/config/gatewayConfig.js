export const gatewayConfig = {
  port: Number(process.env.PORT || 4000),
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || "https://student-service-aszb.onrender.com",
  tasksServiceUrl: process.env.TASKS_SERVICE_URL || "https://darsha-tasks-service.onrender.com",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "https://auth-service-cj6i.onrender.com",
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || "https://darsha-notification-service.onrender.com",
  campusServiceUrl: process.env.CAMPUS_SERVICE_URL || "https://darsha-campus-service.onrender.com",
}
