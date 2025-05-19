"use client"
import { useSelector, useDispatch } from "react-redux";
import { removeInvitation } from "../store/invitationSlice";
import { useRouter } from "next/navigation";

export const Invitation = ({ socket }) => {
  const invitations = useSelector((state) => state.invitations.receivedInvitations);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleAccept = (invite, index) => {
    // Emit via passed socket
    if (socket) {
      socket.emit("accept-task-invitation", {
        taskId: invite.taskId,
        from: invite.from,
        acceptedAt: new Date().toISOString(),
      });
    }

    // Remove from local state
    dispatch(removeInvitation(index));

    // Optionally redirect to task page
    router.push(`/task/${invite.taskId}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg border border-indigo-200">
      <h3 className="text-3xl font-bold mb-6 text-indigo-800">Your Invitations</h3>
      {invitations.length === 0 ? (
        <p className="text-gray-500 text-center italic">No invitations yet!</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((invite, index) => (
            <li key={index} className="p-4 border border-indigo-300 rounded-xl flex justify-between items-center bg-white shadow hover:shadow-lg transition duration-300">
              <div>
                <p className="font-semibold text-indigo-900">{invite.from} invited you to task <span className="text-indigo-700 font-bold">{invite.taskId}</span></p>
                <p className="text-gray-400 text-sm">Received at: {new Date(invite.receivedAt).toLocaleString()}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAccept(invite, index)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition duration-200"
                >
                  Accept
                </button>
                <button
                  onClick={() => dispatch(removeInvitation(index))}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition duration-200"
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
