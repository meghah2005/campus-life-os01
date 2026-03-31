import mongoose from "mongoose"

const stateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const State = mongoose.models.State || mongoose.model("State", stateSchema)
