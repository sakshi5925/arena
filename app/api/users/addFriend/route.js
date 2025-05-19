import { User } from "@/app/models/user";
import { connectDb } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, friendId } = await request.json();
    await connectDb();
    const user = await User.findOne({ githubId: userId })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const friendexist = await User.findById(friendId);
    if (!friendexist) {
      return NextResponse.json({ message: "Friend not found" }, { status: 404 });
    }
   

    await User.findOneAndUpdate(
      { githubId: userId },
      { $addToSet: { friends: friendexist._id } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: friendId },
      { $addToSet: { friends: user._id} },
      { new: true }
    );

    const friend = await User.findById(friendId);

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
