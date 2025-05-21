import { Task } from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { slug, githubId, progress } = await request.json();

    await connectDb();

   
    const task = await Task.findOne({ slug });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    
    const participant = task.participants.find(
      (p) => p.githubId === githubId
    );

    if (!participant) {
      return NextResponse.json(
        { message: "Participant not found in this task" },
        { status: 404 }
      );
    }

   
    await Task.findOneAndUpdate(
      { slug, "participants.githubId": githubId },
      { $set: { "participants.$.progress": progress } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Progress updated successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
