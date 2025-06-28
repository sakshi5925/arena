import { Task } from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
export async function POST(request) {

    await connectDb();
    const {slug ,githubId,tasks}=await request.json();   
    try {
    const taskDoc = await Task.findOne({ slug });
    const participant = taskDoc.participants.find(p => p.githubId === githubId);
    if (!participant) return res.status(404).json({ error: "Participant not found" });
    participant.tasks = tasks;
    await taskDoc.save();
    return NextResponse.json(
      { message:  "Tasks updated"},
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating Task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}