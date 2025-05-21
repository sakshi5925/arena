"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { useSession } from "next-auth/react";

const Rooms = () => {
  const [rooms, setrooms] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTasks = async () => {
      if (session && session.user) {
        const res = await fetch("/api/task");
        const result = await res.json();

        const myTasks = result.filter(
          (room) =>
            room.creator === session.user.name ||
            room.participants.some(
              (p) => p.status === "accepted" && p.githubId === session.user.name
            )
        );

        setrooms(myTasks);
      }
    };

    fetchTasks();
  }, [session]);

  const handleJoin = (slug) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-purple-700 p-6 rounded-lg shadow-lg h-120">
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center drop-shadow-lg">
        📋 Your Available Rooms
      </h2>

      {rooms.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto flex-wrap">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] p-5 bg-gray-800 rounded-xl shadow-md border border-purple-700 hover:shadow-purple-500/50 transition duration-300"
            >
              <h3 className="text-2xl font-bold text-purple-300 capitalize mb-2">
                {room.title}
              </h3>
              <p className="text-sm text-purple-500 mb-3">
                Task ID: {room._id}
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleJoin(room.slug)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
                >
                  <DoorOpen className="w-5 h-5" />
                  Join
                </button>
                <p className="text-sm text-gray-300">
                  Created by:{" "}
                  <span className="text-purple-400 font-medium">
                    {room.creator}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-purple-500 text-lg font-medium py-12 italic">
          No rooms available right now. 🚪✨
        </div>
      )}
    </div>
  );
};

export default Rooms;
