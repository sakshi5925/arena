"use client";

import React, { useEffect, useState ,use} from "react";
import { Users, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Scoreboard from "@/app/components/scoreboard";
import Taskstatus from "@/app/components/taskstatus";

const Room = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const { slug } = params;
  const { data: session } = useSession();
  const [participants, setParticipants] = useState([]);
  const [disabledCheckboxes, setDisabledCheckboxes] = useState(new Set());

  const fetchParticipants = async () => {
    if (session && session.user) {
      const res = await fetch("/api/task");
      const result = await res.json();
      console.log("participants are ",result)
      const task = result.find((room) => room.slug === slug);
      if (task) {
        setParticipants(task.participants);
      }
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [session, slug]);

const handleClick = (q,participantid,participantprogress) => {
    increaseProgress(participantid, participantprogress);
    setDisabledCheckboxes((prev) => new Set(prev).add(q));
  };
  const increaseProgress = async (githubId, currentProgress) => {
    const newProgress = Math.min(currentProgress + 25, 100);

setParticipants((prev) =>
  prev.map((p) =>
    p.githubId === githubId ? { ...p, progress: newProgress } : p
  )
);

    await fetch("/api/task/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, githubId, progress: newProgress }),
    });
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 dark:from-gray-900 to-indigo-50 dark:to-gray-800 flex  items-center justify-end gap-8 p-8">
     
        <Taskstatus slug={slug}/>
      <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-indigo-300 dark:border-gray-700 p-10 mb-20">
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
               key={participant.githubId}

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

                <div>
                  <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                    Complete All The Task
                  </h3>
                  <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
  {[1, 2, 3, 4].map((q) => (
    <li
      key={q}
      className="w-full border-b border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center ps-3">
        <input
          type="checkbox"
          disabled={participant.progress >= 100 ||  disabledCheckboxes.has(q)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          onClick={() =>handleClick(q,participant.githubId,participant.progress)
            // increaseProgress(participant.githubId, participant.progress)
          }
        />
        <label className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Question {q}
        </label>
      </div>
    </li>
  ))}
</ul>

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
      <div>
      <Scoreboard participants={participants}/>
      </div>
    
    </div>
  );
};

export default Room;
