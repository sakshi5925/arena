import React, { useState, useEffect } from "react";

const Scoreboard = ({ participants }) => {
  const [completedtask, setcompletedtask] = useState([]);

  useEffect(() => {
    const completed = participants.filter((p) => p.progress === 100);
    setcompletedtask(completed);
  }, [participants]);

  const fastestFinisher = completedtask.length > 0 ? completedtask[0] : null;

  return (
    <div className="bg-gray-900 text-gray-100 w-full md:w-80 p-4 rounded-2xl shadow-lg border border-gray-800 h-[95vh] overflow-hidden flex flex-col">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4 text-center">
        📊 Scoreboard
      </h1>

  
      {fastestFinisher && (
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-4 rounded-xl mb-6 shadow animate-pulse">
          <h2 className="text-lg font-bold text-white mb-1">🏆 Fastest Finisher!</h2>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{fastestFinisher.githubId}</span>
          
          </div>
          <p className="text-sm text-gray-200 mt-2">Completed their task first 🎉</p>
        </div>
      )}

      
      <div className="mb-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-indigo-300 mb-2">
          ✅ Completed Tasks
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
          {completedtask.length > 0 ? (
            completedtask.map((complete, index) => (
              <div
                key={index}
                className="bg-gray-800 p-2 rounded-lg shadow flex items-center justify-between"
              >
                <span>{complete.githubId}</span>
                <span className="text-green-400 text-sm font-medium">100%</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No one has completed their work yet</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-indigo-300 mb-2">
          📝 In Progress
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
          {participants.length === 0 ? (
            <p className="text-gray-400">No participants yet</p>
          ) : participants.length !== completedtask.length ? (
            participants.map((participant, index) =>
              participant.progress < 100 ? (
                <div
                  key={index}
                  className="bg-gray-800 p-2 rounded-lg shadow flex items-center justify-between"
                >
                  <span>{participant.githubId}</span>
                  <span className="text-yellow-400 text-sm font-medium">
                    {participant.progress}%
                  </span>
                </div>
              ) : null
            )
          ) : (
            <p className="text-green-400">All have completed their tasks successfully 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
