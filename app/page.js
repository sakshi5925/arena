"use client"
import Navbar from "./components/navbar";
import FriendsSelect from "./components/FriendsSelect";
import Task from "./components/task";

export default function Homepage() {
  return (
    <div>
      <Navbar/>
      <div className=" min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 py-12 px-6 sm:px-10 lg:px-12  flex">
     <FriendsSelect/>
      <Task/>
      </div>
      
    </div>
  );
}
