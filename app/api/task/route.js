import {Task} from "@/app/models/task";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Github from "next-auth/providers/github";
import slugify from "slugify";

export async function POST(request) {
  try {
   
    const { title, creator,participants} = await request.json();
    console.log( "title, creator,participants", title, creator,participants);
     
     
    await connectDb();
    const slug =  `${slugify(title, { lower: true, strict: true })}`;
  
   
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
      slug,
      participants: participantObjects, 
      status:"ongoing",
    });
   

   
    return NextResponse.json(
      { message: "New Task is created", taskId: newTask._id , slug: newTask.slug },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating Task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(){
  try {
     await connectDb();
      const allrooms=await Task.find();
      if(allrooms){
        return NextResponse.json(allrooms,{status:200});
      }
   else{
            return NextResponse.json({message:"no user is present"},{status:600});
        }

  } catch (error) {
       console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
