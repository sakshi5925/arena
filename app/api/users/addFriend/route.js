import { User } from "@/app/models/user";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, friendId } = await request.json();
    await connectDb();

    await User.findOneAndUpdate(
      { githubId: userId },
      { $addToSet: { friends: friendId } },
      { new: true }
    );

    const friend = await User.findById(friendId);  // <-- change here

    if (!friend) {
      return NextResponse.json({ message: "Friend not found" }, { status: 404 });
    }

    console.log("Friend detail:", friend);
    return NextResponse.json(
      {
        _id: friend._id,
        githubId: friend.githubId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in adding friend:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
