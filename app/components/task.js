"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { addInvitation } from "../store/invitationSlice";

const Task = () => {
  const socketRef = useRef(null);
  const [task, setTask] = useState("");
  const [TaskId, setTaskid] = useState("");
  const friends = useSelector((state) => state.friends.myFriends);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session || !session.user) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket.io server", socketRef.current.id);
      });

      // Show toast when receiving a task invitation
      socketRef.current.on("receive-task-invitation", ({ taskId, from }) => {
        toast.info(`📩 ${from} invited you to task: ${taskId}`);
        console.log(`You got a task invitation from ${from} for task ${taskId}`);
      dispatch(addInvitation({
      taskId,
      from,
    receivedAt: new Date().toISOString(),
  }));
      
      });
    }

    socketRef.current.emit(
      "join-room",
      {
        room: session.user.name,
        githubId: session.user.name,
      },
      [session]
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [session]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      title: task,
      creator: session.user.name,
      participants: selectedParticipants,
    };

    console.log("data to send", dataToSend);

    const res = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const result = await res.json();
    if (res.ok) {
      toast.success("Task created successfully!");
      setTaskid(result.taskId);

      if (socketRef.current) {
        socketRef.current.emit("send-task-invitation", {
          taskId: result.taskId,
          participants: selectedParticipants,
          from: session.user.name,
        });
      } else {
        console.warn("Socket not connected yet.");
      }

      setTask("");
      setSelectedParticipants([]);
    } else {
      toast.error(result.message || "❌ Failed to create task.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl shadow-2xl border border-indigo-300">
      <form onSubmit={handleOnSubmit} className="space-y-8">
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center drop-shadow-md">
          Create Your Task
        </h2>

        <input
          type="text"
          placeholder="Enter Your Task"
          value={task}
          name="title"
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-4 rounded-xl border border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-sm transition duration-300 placeholder-indigo-400 text-indigo-900 font-medium"
          required
        />

        <label
          htmlFor="participants"
          className="block mb-3 font-semibold text-indigo-700 tracking-wide"
        >
          Select your friends
        </label>

        {friends.length > 0 ? (
          <div className="space-y-3 max-h-40 overflow-y-auto border border-indigo-300 rounded-xl p-4 bg-white shadow-inner">
            {friends.map((friend) => (
              <label
                key={friend._id}
                className="flex items-center space-x-3 cursor-pointer select-none transition hover:bg-indigo-50 rounded-md p-2"
              >
                <input
                  type="checkbox"
                  value={friend.githubId}
                  checked={selectedParticipants.includes(friend.githubId)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedParticipants((prev) =>
                      e.target.checked
                        ? [...prev, val]
                        : prev.filter((id) => id !== val)
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 transition duration-200"
                />
                <span className="text-indigo-900 font-semibold">
                  {friend.githubId}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-red-500 text-center italic font-medium">
            No friends to select
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-indigo-700 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
        >
          Create
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Task;
