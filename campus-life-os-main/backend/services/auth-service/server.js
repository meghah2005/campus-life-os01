import express from "express"
import cors from "cors"
import { authServiceConfig } from "./config/serviceConfig.js"
import { connectDb } from "./config/db.js"
import { registerAuthServiceRoutes } from "./routes/userRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerAuthServiceRoutes(app)

const start = async () => {
  try {
    await connectDb()
    app.listen(authServiceConfig.port, () => {
      console.log(`auth-service running on port ${authServiceConfig.port}`)
    })
  } catch (error) {
    console.error("auth-service failed to connect to MongoDB", error)
    process.exit(1)
  }
}

start()
