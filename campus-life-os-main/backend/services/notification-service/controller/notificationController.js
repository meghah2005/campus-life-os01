import axios from "axios"
import { State } from "../models/stateModel.js"

export const registerNotificationServiceController = (app) => {
const tasksServiceUrl = process.env.TASKS_SERVICE_URL || "http://localhost:4002"

app.get("/health", (_req, res) => {
  res.json({ service: "notification-service", status: "ok" })
})

app.get("/api/notifications/reminders", async (_req, res) => {
  try {
    const deadlinesResponse = await axios.get(`${tasksServiceUrl}/api/tasks/deadlines`)

    const reminders = deadlinesResponse.data.map((deadline, index) => ({
      id: index + 1,
      type: deadline.priority === "high" ? "warning" : "info",
      message: `${deadline.title} is due on ${deadline.date}`,
      priority: deadline.priority,
    }))

    return res.json(reminders)
  } catch {
    return res.status(502).json({ message: "Failed to load reminders from tasks service" })
  }
})

const defaultNotifications = []
let notifications = [...defaultNotifications]

const notificationsStateKey = "notifications:items"
const notificationsReady = (async () => {
  const existing = await State.findOne({ key: notificationsStateKey })
  if (!existing) {
    await State.create({ key: notificationsStateKey, value: defaultNotifications })
    return
  }
  notifications = Array.isArray(existing.value) ? existing.value : [...defaultNotifications]
})()

const persistNotifications = async () => {
  await State.findOneAndUpdate(
    { key: notificationsStateKey },
    { value: notifications },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

app.post("/api/notifications/alert", async (req, res) => {
  await notificationsReady
  const { title, message } = req.body || {}
  if (!title || !message) {
    return res.status(400).json({ message: "title and message are required" })
  }
  const notification = { id: Date.now(), title, message, read: false, createdAt: new Date().toISOString() }
  notifications.unshift(notification)
  await persistNotifications()
  return res.status(201).json({ status: "queued", notification })
})

// GET /api/notifications         — all queued notifications
app.get("/api/notifications", async (_req, res) => {
  await notificationsReady
  res.json(notifications)
})

// PATCH /api/notifications/:id/read  — mark one as read
app.patch("/api/notifications/:id/read", async (req, res) => {
  await notificationsReady
  const n = notifications.find((x) => x.id === Number(req.params.id))
  if (!n) return res.status(404).json({ message: "Notification not found" })
  n.read = true
  await persistNotifications()
  return res.json(n)
})

// DELETE /api/notifications/:id  — dismiss one
app.delete("/api/notifications/:id", async (req, res) => {
  await notificationsReady
  const index = notifications.findIndex((x) => x.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Notification not found" })
  notifications.splice(index, 1)
  await persistNotifications()
  return res.status(204).send()
})

// ─── Start ────────────────────────────────────────────────────────────────────
}
