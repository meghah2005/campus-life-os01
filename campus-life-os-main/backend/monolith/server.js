import express from "express"
import cors from "cors"
import axios from "axios"

import { registerAuthServiceRoutes } from "../services/auth-service/routes/userRoutes.js"
import { registerStudentServiceRoutes } from "../services/student-service/routes/studentRoutes.js"
import { registerTasksServiceRoutes } from "../services/tasks-service/routes/taskRoutes.js"
import { registerNotificationServiceRoutes } from "../services/notification-service/routes/notificationRoutes.js"
import { registerCampusServiceRoutes } from "../services/campus-service/routes/campusRoutes.js"

const app = express()
const PORT = Number(process.env.PORT || 4000)
const baseUrl = `http://localhost:${PORT}`

app.use(cors())
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`[monolith] ${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

app.get("/health", (_req, res) => {
  res.json({ service: "campus-life-monolith", status: "ok" })
})

app.get("/", (_req, res) => {
  res.json({
    service: "campus-life-monolith",
    status: "ok",
    message: "Monolithic backend is running",
    endpoints: {
      health: "GET /health",
      servicesHealth: "GET /api/services/health",
      dashboardSummary: "GET /api/dashboard-summary",
    },
  })
})

app.get("/api/services/health", (_req, res) => {
  res.json({
    gateway: { service: "campus-life-monolith", status: "ok" },
    services: [
      { service: "auth-service", status: "ok", mode: "monolith" },
      { service: "student-service", status: "ok", mode: "monolith" },
      { service: "tasks-service", status: "ok", mode: "monolith" },
      { service: "notification-service", status: "ok", mode: "monolith" },
      { service: "campus-service", status: "ok", mode: "monolith" },
    ],
  })
})

// Notification controller builds reminders by calling tasks-service URL.
// In monolith mode, point it back to this same app.
if (!process.env.TASKS_SERVICE_URL) {
  process.env.TASKS_SERVICE_URL = baseUrl
}

registerAuthServiceRoutes(app)
registerStudentServiceRoutes(app)
registerTasksServiceRoutes(app)
registerNotificationServiceRoutes(app)
registerCampusServiceRoutes(app)

app.get("/api/dashboard-summary", async (_req, res) => {
  try {
    const [statsRes, deadlinesRes, remindersRes, profileRes, activityRes] = await Promise.all([
      axios.get(`${baseUrl}/api/students/stats`),
      axios.get(`${baseUrl}/api/tasks/deadlines`),
      axios.get(`${baseUrl}/api/notifications/reminders`),
      axios.get(`${baseUrl}/api/students/profile`),
      axios.get(`${baseUrl}/api/students/activity`),
    ])

    res.json({
      profile: profileRes.data,
      activityStats: statsRes.data,
      upcomingDeadlines: deadlinesRes.data,
      reminders: remindersRes.data,
      recentActivity: activityRes.data,
      source: "monolith",
    })
  } catch (error) {
    res.status(502).json({
      message: "Unable to fetch dashboard data in monolith mode",
      source: "monolith",
      reason: error?.message,
    })
  }
})

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
    availableAt: "GET /api/services/health",
  })
})

app.listen(PORT, () => {
  console.log(`campus-life-monolith running on port ${PORT}`)
})
