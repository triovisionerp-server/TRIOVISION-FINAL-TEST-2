'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Clock, Users, 
  Plus, MoreVertical, Search, Filter, AlertCircle 
} from 'lucide-react';

// --- MOCK DATA FOR ALL MODULES ---
const MODULE_DATA: Record<string, any> = {
  stockbuilding: { 
    title: "Stock Building", 
    tasks: [
      { id: 1, name: "Cut PU Blocks for Hull #42", status: "In Progress", due: "Today", assignee: "Rajesh" },
      { id: 2, name: "Prepare Wood Inserts", status: "Pending", due: "Tomorrow", assignee: "Amit" }
    ]
  },
  machining: { 
    title: "Machining Department", 
    tasks: [
      { id: 1, name: "CNC Route Deck Mold", status: "Completed", due: "Yesterday", assignee: "Sarah" },
      { id: 2, name: "Drill Mounting Holes", status: "In Progress", due: "Today", assignee: "Mike" }
    ]
  },
  // Fallback for others to prevent errors
  default: { title: "Department View", tasks: [] }
};

export default function ToolingModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleKey = params.module as string;
  
  const data = MODULE_DATA[moduleKey] || { 
    title: moduleKey ? moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1) : "Module",
    tasks: [] 
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{data.title}</h1>
            <p className="text-zinc-400">Task Management & Schedule</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
           <Plus className="w-4 h-4" /> New Task
        </button>
      </motion.div>

      {/* Task List */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl min-h-[500px]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-400" /> Active Tasks
          </h2>
          
          <div className="space-y-3">
            {data.tasks.length > 0 ? data.tasks.map((task: any) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-zinc-800/80 transition-all cursor-pointer"
              >
                 <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${task.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : task.status === 'Completed' ? 'bg-green-500' : 'bg-zinc-600'}`} />
                    <div>
                       <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">{task.name}</h3>
                       <p className="text-xs text-zinc-400 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.due}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {task.assignee}</span>
                       </p>
                    </div>
                 </div>
                 <span className={`px-3 py-1 rounded-lg text-xs font-bold ${task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' : task.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-zinc-400'}`}>
                    {task.status}
                 </span>
              </motion.div>
            )) : (
              <div className="text-center py-20 text-zinc-500 flex flex-col items-center">
                 <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                 <p>No active tasks for {data.title}.</p>
                 <button className="text-purple-400 text-sm mt-2 hover:underline">Create one now</button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}