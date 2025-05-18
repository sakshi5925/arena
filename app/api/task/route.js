import {Task} from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
   
    const { title, creator,participants} = await request.json();
     console.log( "title, creator,participants", title, creator,participants);
    await connectDb();

    await Task.create({
      title,
      creator,
      participants,
      progress: [], 
      status:"ongoing"
    });

    return NextResponse.json({ message: "New Task is created" }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating Task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

