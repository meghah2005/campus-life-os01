import express from "express"
import cors from "cors"
import { campusServiceConfig } from "./config/serviceConfig.js"
import { connectDb } from "./config/db.js"
import { registerCampusServiceRoutes } from "./routes/campusRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerCampusServiceRoutes(app)

const start = async () => {
  try {
    await connectDb()
    app.listen(campusServiceConfig.port, () => {
      console.log(`campus-service running on port ${campusServiceConfig.port}`)
    })
  } catch (error) {
    console.error("campus-service failed to connect to MongoDB", error)
    process.exit(1)
  }
}

start()
