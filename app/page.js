"use client"
import Navbar from "./components/navbar";
import FriendsSelect from "./components/FriendsSelect";
import Task from "./components/task";
import { Invitation } from "./components/invitation";

export default function Homepage() {
  return (
    <div className="">
      <Navbar/>
      <div className=" min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 py-12 px-6 sm:px-10 lg:px-12  ">
      <div className=" flex">
     <FriendsSelect/>
      <Task/>
      </div>
      <div className="w-100 mx-15">
        <Invitation/>
      </div>
      </div>
    </div>
  );
}
