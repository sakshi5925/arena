import React, { useState } from "react";
import { CodeSquare, Plus, X } from "lucide-react";

const ParticipantCard = ({ participant, isCurrentUser, tasks, onAddTask, onRemoveTask, onComplete }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState("");

  const participantTasks = isCurrentUser ? tasks : participant.tasks || [];
console.log("usertask",participantTasks);
  return (
    <div className={`mb-6 p-6 rounded-2xl border shadow-lg transition duration-300
      ${isCurrentUser 
        ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-900 border-indigo-300 dark:border-indigo-500" 
        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"}`
    }>
     
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-extrabold tracking-tight 
          ${isCurrentUser ? "text-indigo-800 dark:text-indigo-300" : "text-gray-800 dark:text-gray-200"}`}>
          {participant.githubId} {isCurrentUser && "(You)"}
        </h2>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{participant.progress}% done</span>
      </div>

    
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className={`h-3 transition-all duration-500 rounded-full
          ${isCurrentUser ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-indigo-600"}`}
          style={{ width: `${participant.progress}%` }}
        />
      </div>

      {isCurrentUser && (
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow transition duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      )}

     
      {showAddTask && (
        <div className="mt-3 flex items-center space-x-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            placeholder="Enter new task..."
          />
          <button
            onClick={() => { onAddTask(newTask); setNewTask(""); setShowAddTask(false); }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition"
          >
            Add
          </button>
          <button
            onClick={() => { setShowAddTask(false); setNewTask(""); }}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    
      <ul className="mt-5 space-y-3">
        {participantTasks.map((task) => (
            
          <li key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm">
            <span className={`flex-1 font-medium ${task.completed ? "line-through opacity-60 text-gray-500" : "text-gray-800 dark:text-gray-200"}`}>
              {task.title}
            
            </span>
            {isCurrentUser ? (
              <div className="flex gap-3.5">
                
                <input type="checkbox" disabled checked={task.completed} className="w-4 h-4 accent-indigo-600" />
                 <button
                onClick={() => onRemoveTask(task.id)}
                className="text-red-500 hover:text-red-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
              </div>
             
            ) : (
            <div>
              
            </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantCard;
