import express from "express"
import cors from "cors"
import { studentServiceConfig } from "./config/serviceConfig.js"
import { connectDb } from "./config/db.js"
import { registerStudentServiceRoutes } from "./routes/studentRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerStudentServiceRoutes(app)

const start = async () => {
  try {
    await connectDb()
    app.listen(studentServiceConfig.port, () => {
      console.log(`student-service running on port ${studentServiceConfig.port}`)
    })
  } catch (error) {
    console.error("student-service failed to connect to MongoDB", error)
    process.exit(1)
  }
}

start()
