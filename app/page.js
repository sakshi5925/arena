"use client";
import Navbar from "./components/navbar";
import FriendsSelect from "./components/FriendsSelect";
import Task from "./components/task";
import { Invitation } from "./components/invitation";
import Rooms from "./components/rooms";

export default function Homepage() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200">
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Section */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-[40%] min-w-[240px] overflow-y-auto   h-116">
             <Rooms />
           
          </div>

          {/* Center */}
          <div className="w-[30%] overflow-y-auto ">
             <FriendsSelect />
           
          </div>

          {/* Right Sidebar */}
          <div className="w-[30%] min-w-[240px] overflow-y-auto">
            <Task />
          </div>
        </div>

        {/* Bottom Section (Footer Rooms) */}
        <div className="h-[200px] overflow-y-auto">
          <Invitation />
        </div>
      </div>
    </div>
  );
}
