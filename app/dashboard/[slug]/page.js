"use client";

import React, { useEffect, useState } from "react";
import { Users, Loader, Crown, Plus, X, Edit3 } from "lucide-react";
import ParticipantCard from "@/app/components/ParticipantCard";
import { useSession } from "next-auth/react";
import Scoreboard from "@/app/components/scoreboard";
import Taskstatus from "@/app/components/taskstatus";

const Room = ({ params }) => {
  
 const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const { data: session } = useSession();
  console.log("data",session);
  const [participants, setParticipants] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

 const fetchParticipants = async () => {
    if (session?.user) {
      const res = await fetch("/api/task");
      const result = await res.json();
      const task = result.find((room) => room.slug === slug);
      if (task) {
        setParticipants(task.participants);
        const currentUser = task.participants.find(p => p.githubId === session.user.name);
        if (currentUser?.tasks) setUserTasks(currentUser.tasks);
      }
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [session, slug]);
  
const increaseProgress = async (githubId, currentProgress, increment) => {
    const newProgress = Math.min(currentProgress + increment, 100);
    setParticipants(prev =>
      prev.map(p => p.githubId === githubId ? { ...p, progress: newProgress } : p)
    );
    await fetch("/api/task/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, githubId, progress: newProgress }),
    });
  };
 const addTask = async (taskTitle) => {
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...userTasks, newTask];
    setUserTasks(updatedTasks);
    await fetch("/api/task/user-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, githubId: session.user.name, tasks: updatedTasks }),
    });
  };
  const removeTask = async (taskId) => {
    const updatedTasks = userTasks.filter(task => task.id !== taskId);
    setUserTasks(updatedTasks);
    await fetch("/api/task/user-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, githubId: session.user.name, tasks: updatedTasks }),
    });
  };

  const handleComplete = (taskId, participantId, participantProgress, totalTasks) => {
    const increment = Math.floor(100 / totalTasks);
    increaseProgress(participantId, participantProgress, increment);
  };

  const currentUser = participants.find(p => p.githubId === session?.user?.name);
  const otherParticipants = participants.filter(p => p.githubId !== session?.user?.name);

    return (
     <div className="min-h-screen flex p-8 bg-gray-50 dark:bg-gray-900">
      <Taskstatus slug={slug} />
      <div className="max-w-6xl w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800 dark:text-indigo-300">
          📌 Task: {slug}
        </h1>

        {participants.length > 0 ? (
          <>
            {currentUser && (
              <ParticipantCard
                participant={currentUser}
                isCurrentUser
                tasks={userTasks}
                onAddTask={addTask}
                onRemoveTask={removeTask}
                onComplete={handleComplete}
              />
            )}
            {otherParticipants.map((p) => (
              <ParticipantCard
                key={p.githubId}
                participant={p}
                isCurrentUser={false}
                onComplete={handleComplete}
              />
            ))}
          </>
        ) : (
          <div className="text-center text-red-500 font-medium">No participants joined yet.</div>
        )}
      </div>
      <Scoreboard participants={participants} />
    </div>
    );
  };




export default Room;