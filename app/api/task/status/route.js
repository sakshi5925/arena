import { Task } from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { participant ,taskId} = await request.json();
    console.log("participant:", participant, "taskId:", taskId);

    await connectDb();

    const task = await Task.findOne({
      _id: taskId,
      "participants.githubId": participant,
    });
    if (!task) {
      return NextResponse.json({ message: "User not found in any task" }, { status: 404 });
    }

     await Task.updateOne(
      { _id: taskId, "participants.githubId": participant },
      {
        $set: {
          "participants.$.status": "accepted",
          isActive: true,
        },
      }
    );

    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating participant status:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
