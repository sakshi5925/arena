"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const handleUser=async()=>{
     if(session.user.email){
        const res=await fetch("/api/users",{
            method:"POST",
            headers: {
        "Content-Type": "application/json",
      },
        body:JSON.stringify({
            email:session.user.email,
            githubId:session.user.name
        }),
        })
        const data = await res.json();
        console.log(data);
     }
  }
  useEffect(() => {
    handleUser()
  },[])
  

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">🎯 Task Arena</h1>
        </Link>

        <div className="space-x-6 hidden md:flex items-center">
          <Link href="/dashboard">
            <span className="hover:text-yellow-400 cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/arena/123">
            <span className="hover:text-yellow-400 cursor-pointer">Arena</span>
          </Link>
          <Link href="/ranking">
            <span className="hover:text-yellow-400 cursor-pointer">Leaderboard</span>
          </Link>

          {session ? (
            <>
              <img
                src={session.user.image}
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-yellow-400"
              />
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition" 
            >
              Login
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
