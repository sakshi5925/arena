"use client";

import React, { useEffect, useRef, useState, use } from "react";
import { Users, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";

const Room = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const { slug } = params;
  const { data: session } = useSession();
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server", socketRef.current.id);
      socketRef.current.emit("join-room", {
        room: slug,
        githubId: session.user.name,
      });
    });

    socketRef.current.on("progressUpdated", (data) => {
      if (data.slug === slug) {
        setParticipants((prev) =>
          prev
            .map((p) =>
              p.githubId === data.githubId
                ? { ...p, progress: data.progress }
                : p
            )
            .sort((a, b) => b.progress - a.progress)
        );
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [slug]);

  const fetchParticipants = async () => {
    if (session && session.user) {
      const res = await fetch("/api/task");
      const result = await res.json();
      const task = result.find((room) => room.slug === slug);
      if (task) {
        const sorted = task.participants.sort(
          (a, b) => b.progress - a.progress
        );
        setParticipants(sorted);
      }
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [session, slug]);

  const handleProgressUpdated = (githubId, newProgress) => {
    socketRef.current.emit("updateProgress", {
      slug,
      githubId,
      progress: newProgress,
    });
  };

  const increaseProgress = async (githubId, currentProgress) => {
    const newProgress = Math.min(currentProgress + 20, 100);

    setParticipants((prev) =>
      prev
        .map((p) =>
          p.githubId === githubId ? { ...p, progress: newProgress } : p
        )
        .sort((a, b) => b.progress - a.progress)
    );

    handleProgressUpdated(githubId, newProgress);

    await fetch("/api/task/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, githubId, progress: newProgress }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 dark:from-gray-900 to-indigo-50 dark:to-gray-800 flex flex-col items-center justify-start p-8">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-indigo-300 dark:border-gray-700 p-10">
        <h1 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-8 text-center drop-shadow-sm">
          📌 Task: <span className="text-black dark:text-white">{slug}</span>
        </h1>

        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">
          Participants Progress
        </h2>

        {participants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="p-5 bg-indigo-50 dark:bg-gray-800 rounded-2xl shadow-md border border-indigo-200 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-700 transition duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-full shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {participant.githubId}
                    </h3>
                  </div>
                </div>

                <div className="w-full bg-indigo-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-4 transition-all duration-500"
                    style={{ width: `${participant.progress}%` }}
                  />
                </div>

                <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                  {participant.progress}% completed
                </div>

                <div
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    participant.status === "accepted"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : participant.status === "pending"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                >
                  {participant.status}
                </div>
                <button
                  onClick={() =>
                    increaseProgress(participant.githubId, participant.progress)
                  }
                  disabled={participant.progress >= 100}
                  className={`mt-4 px-4 py-2 rounded-full ${
                    participant.progress >= 100
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {participant.progress >= 100 ? "Complete" : "+20% Progress"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-red-500 dark:text-red-400 text-lg font-medium">
            <Loader className="animate-spin h-6 w-6 mb-2" />
            No participants joined yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
