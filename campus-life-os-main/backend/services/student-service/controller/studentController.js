
import { State } from "../models/stateModel.js"

export const registerStudentServiceController = (app) => {
const defaultProfile = {
  id: 1,
  name: "",
  email: "",
  level: "",
  department: "",
  gpa: 0,
  enrolledCourses: [],
}

const defaultStats = [
]

const defaultActivityLog = [
]

const defaultGpaCourses = [
]

const defaultAttendanceCourses = [
]

const defaultMealPlan = {
  mealSwipes: 0,
  mealSwipesUsed: 0,
  diningDollars: 0,
  diningDollarsUsed: 0,
  daysRemaining: 0,
  history: [],
}

let profile = { ...defaultProfile }
let stats = [...defaultStats]
let activityLog = [...defaultActivityLog]
let gpaCourses = [...defaultGpaCourses]
let attendanceCourses = [...defaultAttendanceCourses]
let mealPlan = { ...defaultMealPlan }

const keys = {
  profile: "student:profile",
  stats: "student:stats",
  activityLog: "student:activity",
  gpaCourses: "student:gpa-courses",
  attendanceCourses: "student:attendance",
  mealPlan: "student:meal-plan",
}

const loadValue = async (key, defaultValue) => {
  const existing = await State.findOne({ key })
  if (!existing) {
    await State.create({ key, value: defaultValue })
    return defaultValue
  }
  return existing.value
}

const saveValue = async (key, value) => {
  await State.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

const ready = (async () => {
  profile = await loadValue(keys.profile, defaultProfile)
  stats = await loadValue(keys.stats, defaultStats)
  activityLog = await loadValue(keys.activityLog, defaultActivityLog)
  gpaCourses = await loadValue(keys.gpaCourses, defaultGpaCourses)
  attendanceCourses = await loadValue(keys.attendanceCourses, defaultAttendanceCourses)
  mealPlan = await loadValue(keys.mealPlan, defaultMealPlan)
})()

const nextCourseId = () => {
  const maxId = gpaCourses.reduce((acc, course) => Math.max(acc, Number(course.id) || 0), 0)
  return maxId + 1
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ service: "student-service", status: "ok" })
})

// GET /api/students/profile
app.get("/api/students/profile", async (_req, res) => {
  await ready
  res.json(profile)
})

// PUT /api/students/profile   — update name, department, gpa, etc.
app.put("/api/students/profile", async (req, res) => {
  await ready
  const { id, email, ...updates } = req.body || {}   // id/email immutable
  profile = { ...profile, ...updates }
  await saveValue(keys.profile, profile)
  res.json(profile)
})

// GET /api/students/stats
app.get("/api/students/stats", async (_req, res) => {
  await ready
  res.json(stats)
})

// PATCH /api/students/stats/:label  — increment a stat counter
app.patch("/api/students/stats/:label", async (req, res) => {
  await ready
  const stat = stats.find((s) => s.label.toLowerCase().replace(/ /g, "-") === req.params.label)
  if (!stat) return res.status(404).json({ message: "Stat not found" })
  stat.value = req.body.value ?? stat.value + 1
  await saveValue(keys.stats, stats)
  return res.json(stat)
})

// GET /api/students/activity
app.get("/api/students/activity", async (_req, res) => {
  await ready
  res.json(activityLog)
})

// POST /api/students/activity   — log a new recent action
app.post("/api/students/activity", async (req, res) => {
  await ready
  const { action, time = "Just now" } = req.body || {}
  if (!action) return res.status(400).json({ message: "action is required" })
  activityLog.unshift({ action, time })
  await saveValue(keys.activityLog, activityLog)
  return res.status(201).json({ action, time })
})

app.get("/api/students/gpa/courses", async (_req, res) => {
  await ready
  res.json(gpaCourses)
})

app.post("/api/students/gpa/courses", async (req, res) => {
  await ready
  const { name, credits, grade } = req.body || {}
  if (!name || !credits || !grade) {
    return res.status(400).json({ message: "name, credits and grade are required" })
  }

  const course = { id: nextCourseId(), name, credits, grade }
  gpaCourses.push(course)
  await saveValue(keys.gpaCourses, gpaCourses)
  return res.status(201).json(course)
})

app.delete("/api/students/gpa/courses/:id", async (req, res) => {
  await ready
  gpaCourses = gpaCourses.filter((course) => course.id !== Number(req.params.id))
  await saveValue(keys.gpaCourses, gpaCourses)
  return res.status(204).send()
})

app.get("/api/students/attendance", async (_req, res) => {
  await ready
  res.json(attendanceCourses)
})

app.patch("/api/students/attendance/:id", async (req, res) => {
  await ready
  const course = attendanceCourses.find((item) => item.id === Number(req.params.id))
  if (!course) {
    return res.status(404).json({ message: "Attendance course not found" })
  }

  const present = Boolean(req.body?.present)
  course.totalClasses += 1
  if (present) {
    course.attended += 1
  }

  await saveValue(keys.attendanceCourses, attendanceCourses)
  return res.json(course)
})

app.get("/api/students/meal-plan", async (_req, res) => {
  await ready
  res.json(mealPlan)
})

app.post("/api/students/meal-plan/swipe", async (_req, res) => {
  await ready
  if (mealPlan.mealSwipesUsed < mealPlan.mealSwipes) {
    mealPlan.mealSwipesUsed += 1
    mealPlan.history.unshift({
      date: "Today",
      location: "Main Cafeteria",
      type: "Meal Swipe",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })
  }

  await saveValue(keys.mealPlan, mealPlan)
  return res.json(mealPlan)
})

app.post("/api/students/meal-plan/dining-dollars", async (req, res) => {
  await ready
  const amount = Number(req.body?.amount || 0)
  if (!amount || mealPlan.diningDollarsUsed + amount > mealPlan.diningDollars) {
    return res.status(400).json({ message: "Invalid dining rupee amount" })
  }

  mealPlan.diningDollarsUsed += amount
  mealPlan.history.unshift({
    date: "Today",
    location: "Campus Dining",
    type: "Dining Rupees",
    amount: `₹${amount.toFixed(2)}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  })

  await saveValue(keys.mealPlan, mealPlan)
  return res.json(mealPlan)
})

// ─── Start ────────────────────────────────────────────────────────────────────
}
