import { Task } from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { slug} = await request.json();

    await connectDb();

   
    const task = await Task.findOne({ slug });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

  
    const allComplete = task.participants.every((p) => p.progress === 100);

    if(allComplete){
        await Task.findOneAndUpdate(
              { slug},
              { $set: { "status": "complete" } },
              { new: true }
            );
return NextResponse.json(
        { status: true, message: "Task completed successfully" },
        { status: 200 }
      );    }
    

     return NextResponse.json(
      { status: false, message: "Task is ongoing" },
      { status: 201 }
    );


  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
