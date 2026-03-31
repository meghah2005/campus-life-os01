import mongoose from "mongoose"

const defaultMongoUri = "mongodb://localhost:27017/"

export const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return { connected: true, mode: "mongodb", db: mongoose.connection.name }
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || defaultMongoUri
  const dbName = process.env.MONGODB_DB || "campus_life_os"

  await mongoose.connect(uri, { dbName })

  return {
    connected: true,
    mode: "mongodb",
    db: mongoose.connection.name,
    host: mongoose.connection.host,
  }
}
