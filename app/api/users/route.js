import { User } from "@/app/models/user";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, githubId } = await request.json();
    await connectDb();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    }

    await User.create({
      email,
      githubId
    });

    return NextResponse.json({ message: "New user created" }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating new user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(){
      try {
        await connectDb();
        const alluser=await User.find();
     
        if(alluser){
            return NextResponse.json(alluser,{status:200});
        }
        else{
            return NextResponse.json({message:"no user is present"},{status:600});
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }
}