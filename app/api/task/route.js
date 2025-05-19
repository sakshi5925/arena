import {Task} from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Github from "next-auth/providers/github";

export async function POST(request) {
  try {
   
    const { title, creator,participants} = await request.json();
    console.log( "title, creator,participants", title, creator,participants);
    await connectDb();
    const participantObjects=participants.map((id)=>({
      githubId:id,
      progress:0,
      status:"pending",
    }))
     participantObjects.push({
      githubId: creator,
      progress: 0,
      status: "accepted",
    });
      const newTask =await Task.create({
      title,
      creator,
      participants: participantObjects, 
      status:"ongoing",
    });

    
    return NextResponse.json(
      { message: "New Task is created", taskId: newTask._id },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating Task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

