'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

const Taskstatus = ({ slug }) => {
  const [task, setTask] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchStatus = async () => {
        const res = await fetch("/api/task/status/taskstatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const result = await res.json();
        setTask(result.status);
        setLoading(false);
      };

      fetchStatus();
    }
  }, [slug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 mt-6 rounded-2xl text-center text-lg font-semibold bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white shadow-2xl border border-gray-700 backdrop-blur-lg relative overflow-hidden h-180 "
    >
   
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent animate-pulse blur-2xl opacity-20 pointer-events-none" />

      <div className="mb-4 text-sm font-mono text-gray-400 tracking-widest uppercase border-b border-gray-700 pb-2">
        🚀 Task Status Terminal
      </div>

    
      {loading ? (
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <Loader2 className="animate-spin w-8 h-8 text-indigo-400" />
          <p className="text-indigo-400 font-mono">Checking Status...</p>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 animate-gradient-x"></div>
          </div>
        </div>
      ) : task ? (
        <div className="flex flex-col items-center gap-3 mb-3 ">
          <CheckCircle className="text-green-400 w-10 h-10 animate-bounce" />
          <p className="text-green-400 font-mono text-xl drop-shadow">✅ Task Completed 🎉</p>
          <span className="text-xs text-gray-400 font-mono">Awesome job, you crushed it!</span>
          <div className="mt-4 text-green-300 font-mono text-xs">All participants reached 100% progress</div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mb-3">
          <Clock className="text-yellow-400 w-10 h-10 animate-pulse" />
          <p className="text-yellow-400 font-mono text-xl drop-shadow">📝 Ongoing Task</p>
          <span className="text-xs text-gray-400 font-mono">Keep hustling, coder!</span>
          <div className="mt-4 text-yellow-300 font-mono text-xs"> Some participants are still working...</div>
        </div>
      )}

      {/* Decorative terminal footer */}
      <div className="mt-6 text-gray-500 font-mono text-xs border-t border-gray-700 pt-2">
        [ System Logs Active · {new Date().toLocaleTimeString()} ]
      </div>
    </motion.div>
  );
};

export default Taskstatus;
