"use client"
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyFriends, setNonFriends, addFriend } from "../store/friendSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Task from "./task";

const FriendsSelect = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const myFriends = useSelector((state) => state.friends.myFriends);
  const nonFriends = useSelector((state) => state.friends.nonFriends);

  useEffect(() => {
    if (session) {
      dispatch(fetchMyFriends(session.user.name));
    }
  }, [session, dispatch]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data && session) {
        const filtered = data.filter(
          (user) =>
            user.githubId !== session.user.name &&
            !myFriends.some((friend) => friend._id === user._id)
        );
        dispatch(setNonFriends(filtered));
      }
    }
    fetchUsers();
  }, [myFriends, session, dispatch]);

  const handleAddFriend = async (userId, friendId) => {
    const res = await fetch("/api/users/addFriend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId }),
    });
    const result = await res.json();
    if (res.ok) {
      dispatch(addFriend(result));
      toast.success(`${result.githubId} added to your friends! 🎉`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } else {
      toast.error(result.message || "Failed to add friend.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 py-12 px-6 sm:px-10 lg:px-12 ">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-indigo-300">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 border-b border-gray-300 pb-4 drop-shadow-md">
          Invite Your Friends
        </h2>

        {nonFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {nonFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center p-5 border border-gray-300 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-xl mr-5 select-none drop-shadow-lg">
                  {getInitials(friend.githubId)}
                </div>
                <div className="flex-grow">
                  <p className="text-xl font-semibold text-gray-800 tracking-wide">
                    {friend.githubId}
                  </p>
                </div>
                <button
                  onClick={() => handleAddFriend(session.user.name, friend._id)}
                  className="ml-6 inline-flex items-center px-5 py-2 bg-green-600 rounded-xl shadow-lg text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300"
                  aria-label={`Add ${friend.githubId} as friend`}
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-12 text-center text-lg italic font-medium">
            No users available to add as friend.
          </p>
        )}

        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b border-gray-300 pb-4 drop-shadow-md">
          Your Friends
        </h2>
        {myFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center p-5 border border-green-300 rounded-2xl bg-green-50 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center text-xl mr-5 select-none drop-shadow-md">
                  {getInitials(friend.githubId)}
                </div>
                <div>
                  <p className="text-green-900 font-semibold text-xl tracking-wide">
                    {friend.githubId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg italic font-medium">No friends yet.</p>
        )}
      </div>

      <ToastContainer />
      
    </div>
  );
};

export default FriendsSelect;
