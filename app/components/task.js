"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

      socketRef.current.on("receive-task-invitation", ({ taskId, from, githubId, slug }) => {
        toast.info(`📩 ${from} invited you to task: ${taskId}`);
        dispatch(addInvitation({
          taskId, from, githubId, slug, receivedAt: new Date().toISOString(),
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
  }, [session]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      title: task,
      creator: session.user.name,
      participants: selectedParticipants,
    };

    const res = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("✅ Task created successfully!");
      setTaskid(result.taskId);

      if (socketRef.current) {
        socketRef.current.emit("send-task-invitation", {
          taskId: result.taskId,
          participants: selectedParticipants,
          slug: result.slug,
          from: session.user.name,
        });
      }

      setTask("");
      setSelectedParticipants([]);
    } else {
      toast.error(result.message || "❌ Failed to create task.");
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border border-indigo-300 dark:border-gray-700  h-120 transition duration-500 ">
      <form onSubmit={handleOnSubmit} className="space-y-8">
        <h2 className="text-4xl font-extrabold text-indigo-800 dark:text-indigo-300 mb-4 text-center drop-shadow-md">
          🚀 Create Your Task
        </h2>

        <input
          type="text"
          placeholder="📝 Enter Your Task"
          value={task}
          name="title"
          onChange={(e) => setTask(e.target.value)}
          className="w-full p-4 rounded-xl border border-indigo-400 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500 dark:focus:ring-indigo-300 bg-white dark:bg-gray-800 shadow-sm transition placeholder-indigo-400 dark:placeholder-gray-400 text-indigo-900 dark:text-gray-200 font-medium"
          required
        />

        <label
          htmlFor="participants"
          className="block mb-3 font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide"
        >
          👥 Select your friends
        </label>

        {friends.length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto border border-indigo-300 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-inner">
            {friends.map((friend) => (
              <label
                key={friend._id}
                className="flex items-center space-x-3 cursor-pointer select-none transition hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md p-2"
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
                <span className="text-indigo-900 dark:text-gray-200 font-semibold">
                  {friend.githubId}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-red-500 dark:text-red-400 text-center italic font-medium">
            No friends to select
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-indigo-700 dark:bg-indigo-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-indigo-800 dark:hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-300"
        >
          🎯 Create Task
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Task;
