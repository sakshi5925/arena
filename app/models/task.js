import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  creator: String,
  participants: [String],
  progress: Array,
  status: { type: String, default: "ongoing" },
});

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
