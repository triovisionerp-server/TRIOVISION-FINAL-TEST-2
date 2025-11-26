'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LogOut, Users, TrendingUp, Factory, BarChart3, ExternalLink, CheckCircle,
  Clock, AlertCircle, Package
} from 'lucide-react';

export default function MDDashboard() {
  const [user, setUser] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [productions, setProductions] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser || currentUser !== 'md') {
      router.push('/login');
    } else {
      setUser('MD');
      loadData();
    }
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [router]);
  const loadData = () => {
    const savedEmployees = localStorage.getItem('employees');
    const savedTasks = localStorage.getItem('productionTasks');
    const savedProductions = localStorage.getItem('productions');
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProductions) setProductions(JSON.parse(savedProductions));
  };
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };
  const openEmployeeDetails = () => {
    window.open('/employees', '_blank');
  };
  const today = new Date().toISOString().split('T')[0];
  const todayProductions = productions.filter(p => p.completionDate === today);
  const partsCompletedToday = todayProductions.reduce((sum, p) => sum + (p.partsCompleted || 0), 0);
  const gelcoatToday = todayProductions.reduce((sum, p) => sum + (p.materialsUsed?.gelcoatUsed || 0), 0);
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => !e.status || e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    totalProduction: productions.length,
    inProgress: productions.filter(p => p.status === 'In Progress').length,
    completedProduction: productions.filter(p => p.status === 'Completed').length,
    avgTEI: tasks.length > 0 ? (tasks.reduce((s, t) => s + t.tei, 0) / tasks.length).toFixed(1) : '0'
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="relative z-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">MD Dashboard</h1>
                  <p className="text-zinc-400 text-sm mt-1">Executive Overview</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300 font-medium">Live Updates</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Managing Director</p>
                  <p className="text-sm font-semibold text-purple-300">{user}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Employees */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onClick={openEmployeeDetails}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <ExternalLink className="w-5 h-5 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-4xl font-bold text-white">{stats.totalEmployees}</h3>
              <p className="text-sm text-zinc-400 mt-2">Total Employees</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Active: <strong className="text-green-300">{stats.activeEmployees}</strong></span>
                  <span>On Leave: <strong className="text-yellow-300">{stats.onLeave}</strong></span>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-300 font-medium flex items-center gap-2">
                <span>Click to view details</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </motion.div>

            {/* TOOLING (replace BOMs) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => router.push('/md/Tooling')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                  <Factory className="w-6 h-6 text-yellow-300" />
                </div>
                <span className="text-xs font-medium text-yellow-300 uppercase">Tooling</span>
              </div>
              <h3 className="text-4xl font-bold text-white">Open</h3>
              <p className="text-sm text-zinc-400 mt-2">Molds, Teams, Tasks</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-zinc-400">
                <span>Modules: <strong className="text-yellow-300">11</strong></span>
                <span>Click to view</span>
              </div>
            </motion.div>

            {/* Production Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <Factory className="w-6 h-6 text-green-300" />
                </div>
                <span className="text-xs font-medium text-green-300 uppercase">Production</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{stats.totalProduction}</h3>
              <p className="text-sm text-zinc-400 mt-2">Total Productions</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Active: <strong className="text-blue-300">{stats.inProgress}</strong></span>
                  <span>Done: <strong className="text-green-300">{stats.completedProduction}</strong></span>
                </div>
              </div>
            </motion.div>

            {/* Parts Completed Today */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center border border-green-500/40">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                </div>
                <span className="text-xs font-medium text-green-300 uppercase">Today</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{partsCompletedToday}</h3>
              <p className="text-sm text-zinc-400 mt-2">Parts Completed Today</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-zinc-400">Gelcoat Used: <strong className="text-green-300">{gelcoatToday.toFixed(1)} kg</strong></p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
