import { Task } from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { participant } = await request.json();
    console.log("participants  aree",participant);
    await connectDb();

    const task = await Task.findOne({ "participants.githubId": participant });
    if (!task) {
      return NextResponse.json({ message: "User not found in any task" }, { status: 404 });
    }

    await Task.findOneAndUpdate(
      { "participants.githubId": participant },
      { $set: { "participants.$.status": "accepted" } },
      { new: true }
    );

    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating participant status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
