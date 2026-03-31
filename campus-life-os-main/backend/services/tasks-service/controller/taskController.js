
import { State } from "../models/stateModel.js"

export const registerTasksServiceController = (app) => {
const defaultTasks = [
]
let tasks = [...defaultTasks]

const tasksStateKey = "tasks:items"
const tasksReady = (async () => {
  const existing = await State.findOne({ key: tasksStateKey })
  if (!existing) {
    await State.create({ key: tasksStateKey, value: defaultTasks })
    return
  }
  tasks = Array.isArray(existing.value) ? existing.value : [...defaultTasks]
})()

const persistTasks = async () => {
  await State.findOneAndUpdate(
    { key: tasksStateKey },
    { value: tasks },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

const getNextTaskId = () => {
  const maxId = tasks.reduce((acc, task) => Math.max(acc, Number(task.id) || 0), 0)
  return maxId + 1
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ service: "tasks-service", status: "ok" })
})

// GET /api/tasks            — list all tasks (optional ?priority=high filter)
app.get("/api/tasks", async (req, res) => {
  await tasksReady
  const { priority, completed } = req.query
  let result = tasks
  if (priority) result = result.filter((t) => t.priority === priority)
  if (completed !== undefined) result = result.filter((t) => String(t.completed) === completed)
  res.json(result)
})

// GET /api/tasks/deadlines  — upcoming tasks (not completed)
app.get("/api/tasks/deadlines", async (_req, res) => {
  await tasksReady
  res.json(tasks.filter((t) => !t.completed))
})

// GET /api/tasks/:id
app.get("/api/tasks/:id", async (req, res) => {
  await tasksReady
  const task = tasks.find((t) => t.id === Number(req.params.id))
  if (!task) return res.status(404).json({ message: "Task not found" })
  return res.json(task)
})

// POST /api/tasks           — create a task
app.post("/api/tasks", async (req, res) => {
  await tasksReady
  const { title, date, priority = "medium" } = req.body || {}
  if (!title || !date) return res.status(400).json({ message: "title and date are required" })
  const task = { id: getNextTaskId(), title, date, priority, completed: false }
  tasks.push(task)
  await persistTasks()
  return res.status(201).json(task)
})

// PUT /api/tasks/:id        — update a task
app.put("/api/tasks/:id", async (req, res) => {
  await tasksReady
  const index = tasks.findIndex((t) => t.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Task not found" })
  tasks[index] = { ...tasks[index], ...req.body, id: tasks[index].id }
  await persistTasks()
  return res.json(tasks[index])
})

// PATCH /api/tasks/:id/complete  — mark complete/incomplete
app.patch("/api/tasks/:id/complete", async (req, res) => {
  await tasksReady
  const task = tasks.find((t) => t.id === Number(req.params.id))
  if (!task) return res.status(404).json({ message: "Task not found" })
  task.completed = req.body.completed ?? !task.completed
  await persistTasks()
  return res.json(task)
})

// DELETE /api/tasks/:id     — remove a task
app.delete("/api/tasks/:id", async (req, res) => {
  await tasksReady
  const index = tasks.findIndex((t) => t.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Task not found" })
  tasks.splice(index, 1)
  await persistTasks()
  return res.status(204).send()
})

// ─── Start ────────────────────────────────────────────────────────────────────
}
