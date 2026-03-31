import express from "express"
import cors from "cors"
import { tasksServiceConfig } from "./config/serviceConfig.js"
import { connectDb } from "./config/db.js"
import { registerTasksServiceRoutes } from "./routes/taskRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerTasksServiceRoutes(app)

const start = async () => {
  try {
    await connectDb()
    app.listen(tasksServiceConfig.port, () => {
      console.log(`tasks-service running on port ${tasksServiceConfig.port}`)
    })
  } catch (error) {
    console.error("tasks-service failed to connect to MongoDB", error)
    process.exit(1)
  }
}

start()
