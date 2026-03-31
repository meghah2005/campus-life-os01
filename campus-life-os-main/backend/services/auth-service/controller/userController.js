import jwt from "jsonwebtoken"
import { State } from "../models/stateModel.js"

export const registerAuthServiceController = (app) => {
const JWT_SECRET = process.env.JWT_SECRET || "campus-life-secret"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h"
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

const defaultUsers = [
  { id: 1, email: "demo@university.edu",  password: "demo123",  name: "Demo Student", role: "student" },
  { id: 2, email: "admin@university.edu", password: "admin123", name: "Campus Admin",  role: "admin"   },
]
let users = [...defaultUsers]

const usersStateKey = "auth:users"
const usersReady = (async () => {
  const existing = await State.findOne({ key: usersStateKey })
  if (!existing) {
    await State.create({ key: usersStateKey, value: defaultUsers })
    return
  }
  users = Array.isArray(existing.value) ? existing.value : [...defaultUsers]
})()

const persistUsers = async () => {
  await State.findOneAndUpdate(
    { key: usersStateKey },
    { value: users },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

const getNextUserId = () => {
  const maxId = users.reduce((acc, user) => Math.max(acc, Number(user.id) || 0), 0)
  return maxId + 1
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

const signRefreshToken = (user) =>
  jwt.sign(
    { sub: user.id, type: "refresh" },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  )

const safeUser = (user) => ({
  id:    user.id,
  email: user.email,
  name:  user.name,
  role:  user.role,
})

// ─── JWT middleware (reuse in any route) ─────────────────────────────────────

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed Authorization header" })
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET)
    return next()
  } catch (err) {
    return res.status(401).json({ message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" })
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/health", (_req, res) => {
  res.json({ service: "auth-service", status: "ok" })
})

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 * Creates a new student account (role defaults to "student").
 */
app.post("/api/auth/register", async (req, res) => {
  try {
  await usersReady
  const { name, email, password, role = "student" } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" })
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email is already registered" })
  }

  // NOTE: hash passwords with bcrypt in production — kept plain for student demo
  const newUser = { id: getNextUserId(), email, password, name, role }
  users.push(newUser)
  await persistUsers()

  const token        = signAccessToken(newUser)
  const refreshToken = signRefreshToken(newUser)

  return res.status(201).json({
    message: "Account created",
    token,
    refreshToken,
    user: safeUser(newUser),
  })
  } catch {
    return res.status(500).json({ message: "Failed to register user" })
  }
})

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns access token + refresh token on success.
 */
app.post("/api/auth/login", async (req, res) => {
  await usersReady
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" })
  }

  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token        = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  return res.json({ token, refreshToken, user: safeUser(user) })
})

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Issues a new access token without requiring re-login.
 */
app.post("/api/auth/refresh", async (req, res) => {
  await usersReady
  const { refreshToken } = req.body || {}

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" })
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET)
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token type" })
    }

    const user = users.find((u) => u.id === decoded.sub)
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    return res.json({ token: signAccessToken(user), user: safeUser(user) })
  } catch (err) {
    return res.status(401).json({ message: err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token" })
  }
})

/**
 * GET /api/auth/verify
 * Header: Authorization: Bearer <token>
 * Validates an access token and returns the decoded payload.
 */
app.get("/api/auth/verify", (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token" })
  }

  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET)
    return res.json({ valid: true, user: decoded })
  } catch (err) {
    return res.status(401).json({ valid: false, message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" })
  }
})

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Returns the authenticated user's profile (protected route example).
 */
app.get("/api/auth/me", requireAuth, async (req, res) => {
  await usersReady
  const user = users.find((u) => u.id === req.user.sub)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  return res.json(safeUser(user))
})

// ─── Start ────────────────────────────────────────────────────────────────────
}
