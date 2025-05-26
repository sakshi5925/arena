"use client"
import { useSelector, useDispatch } from "react-redux";
import { acceptInvitations, declineInvitation } from "../store/invitationSlice";
import { setRoom } from "../store/roomsSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSocket } from "../hooks/useSocket";

export const Invitation = () => {
  const invitations = useSelector((state) => state.invitations.receivedInvitations);
  const dispatch = useDispatch();
  const router = useRouter();
  const socket = useSocket();
  const handleAccept = async (invite) => {
    if (socket) {
      socket.emit("accept-task-invitation", {
        slug: invite.slug,
        taskId: invite.taskId,
        from: invite.from,
        githubId:invite.githubId,
        acceptedAt: new Date().toISOString(),
      });
    }

    const id = invite.githubId;
    console.log("participants", id);

    dispatch(acceptInvitations(invite));


    await fetch("/api/task/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({participant: id, taskId: invite.taskId }),
    });

    toast.success(`Accepted invitation to task ${invite.taskId}`);
  };

  const handleDecline = (invite) => {
    dispatch(declineInvitation(invite));
    toast.error(`Declined invitation to task ${invite.taskId}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg border border-gray-700 h-50">
      <h3 className="text-3xl font-bold mb-6 text-cyan-400 drop-shadow-md">Your Invitations</h3>
      {invitations.length === 0 ? (
        <p className="text-gray-400 text-center italic">No invitations yet!</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((invite) => (
            <li
              key={invite.taskId}
              className="p-4 border border-gray-700 rounded-xl flex justify-between items-center bg-gray-800 shadow-md hover:shadow-cyan-500/50 transition duration-300"
            >
              <div>
                <p className="font-semibold text-cyan-300">
                  {invite.from} invited you to task{" "}
                  <span className="text-cyan-500 font-bold">{invite.taskId}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Received at: {new Date(invite.receivedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAccept(invite)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg shadow-md transition duration-200"
                  aria-label={`Accept invitation from ${invite.from}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(invite)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-200"
                  aria-label={`Decline invitation from ${invite.from}`}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
