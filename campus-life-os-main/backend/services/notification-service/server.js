import express from "express"
import cors from "cors"
import { notificationServiceConfig } from "./config/serviceConfig.js"
import { connectDb } from "./config/db.js"
import { registerNotificationServiceRoutes } from "./routes/notificationRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerNotificationServiceRoutes(app)

const start = async () => {
  try {
    await connectDb()
    app.listen(notificationServiceConfig.port, () => {
      console.log(`notification-service running on port ${notificationServiceConfig.port}`)
    })
  } catch (error) {
    console.error("notification-service failed to connect to MongoDB", error)
    process.exit(1)
  }
}

start()
