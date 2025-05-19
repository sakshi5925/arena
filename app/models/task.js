import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  githubId: String,
  progress: { type: Number, default: 0 },
  status: { type: String, default: "pending" }, 
});
const taskSchema = new mongoose.Schema({
  title: String,
  creator: String,
  participants: [participantSchema],
  status: { type: String, default: "ongoing" },
});

export const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
