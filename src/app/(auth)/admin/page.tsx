'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Settings, BarChart3, Package, TrendingUp, 
  CheckCircle, Plus, Search, Filter, Eye, Edit2, 
  Trash2, UserPlus, Shield, Activity, LogOut
} from 'lucide-react';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { signOut } from '@/lib/firebase/auth';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time Firebase data
  useEffect(() => {
    setLoading(true);

    // Listen to employees collection
    const employeesUnsubscribe = onSnapshot(
      collection(db, 'employees'),
      (snapshot) => {
        const employeesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading employees:', error);
        setLoading(false);
      }
    );

    // Listen to tasks collection
    const tasksUnsubscribe = onSnapshot(
      collection(db, 'tasks'),
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );

    // Cleanup subscriptions
    return () => {
      employeesUnsubscribe();
      tasksUnsubscribe();
    };
  }, []);

  // Calculate real-time stats
  const systemStats = {
    totalUsers: employees.length,
    activeUsers: employees.filter(e => e.status === 'active').length,
    todayLogins: employees.filter(e => {
      const lastActive = new Date(e.lastActive || 0);
      const today = new Date();
      return lastActive.toDateString() === today.toDateString();
    }).length,
    newThisMonth: employees.filter(e => {
      const joinDate = new Date(e.createdAt || e.joinDate);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && 
             joinDate.getFullYear() === now.getFullYear();
    }).length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
  };

  // Department options
  const departments = ['all', 'Production', 'Sales', 'Quality Control', 'Design', 'Purchase', 'Store', 'Dispatch', 'Human Resources', 'IT'];

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.designation?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: BarChart3 },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'settings', name: 'System Settings', icon: Settings },
  ];

  // Logout handler
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Logout */}
      <div className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Shield className="w-7 h-7" />
                System Administrator
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Triovision Composite ERP - Admin Control Panel
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-green-400 font-semibold text-sm">System Online</span>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Logged in as:</p>
                <p className="text-white font-semibold">admin@triovisioninternational.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-4">Loading data from Firebase...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* TAB 1: System Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Real-time KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Users className="w-10 h-10 text-blue-200 opacity-50" />
                  </div>
                  <h3 className="text-4xl font-bold">{systemStats.totalUsers}</h3>
                  <p className="text-blue-100 text-sm mt-1">Total Users</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-100 text-xs">{systemStats.activeUsers} active</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Package className="w-10 h-10 text-green-200 opacity-50" />
                  </div>
                  <h3 className="text-4xl font-bold">{systemStats.totalTasks}</h3>
                  <p className="text-green-100 text-sm mt-1">Total Tasks</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-green-100 text-xs">{systemStats.completedTasks} completed</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <TrendingUp className="w-10 h-10 text-purple-200 opacity-50" />
                  </div>
                  <h3 className="text-4xl font-bold">
                    {tasks.length > 0 ? ((systemStats.completedTasks / tasks.length) * 100).toFixed(1) : 0}%
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">Completion Rate</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <UserPlus className="w-10 h-10 text-orange-200 opacity-50" />
                  </div>
                  <h3 className="text-4xl font-bold">{systemStats.newThisMonth}</h3>
                  <p className="text-orange-100 text-sm mt-1">New Users This Month</p>
                </motion.div>
              </div>

              {/* Live Tasks Feed */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Recent Tasks (Live)
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {tasks.slice(0, 10).map((task, index) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <Package className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold">{task.supervisorName || 'Supervisor'}</span> - {task.partName}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {task.quantity} units • TEI: {task.tei}% • {new Date(task.timestamp || task.createdAt?.toDate()).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        task.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-slate-400 text-center py-8">No tasks recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: User Management - Using Real Firebase Data */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                    />
                  </div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </button>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{employees.length}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Active</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Inactive</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">
                    {employees.filter(e => e.status === 'inactive').length}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Filtered Results</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{filteredEmployees.length}</p>
                </div>
              </div>

              {/* Users Table - Real Firebase Data */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-slate-300 font-semibold text-sm">User</th>
                        <th className="text-left px-6 py-4 text-slate-300 font-semibold text-sm">Role</th>
                        <th className="text-left px-6 py-4 text-slate-300 font-semibold text-sm">Department</th>
                        <th className="text-left px-6 py-4 text-slate-300 font-semibold text-sm">Status</th>
                        <th className="text-left px-6 py-4 text-slate-300 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp) => (
                        <motion.tr 
                          key={emp.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {(emp.name || emp.email || 'U').substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">{emp.name || 'No Name'}</p>
                                <p className="text-slate-400 text-sm">{emp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold">
                              {emp.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{emp.department || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                              emp.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {emp.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredEmployees.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Settings (unchanged) */}
          {activeTab === 'settings' && (
            <div className="text-white">Settings tab content...</div>
          )}
        </div>
      )}
    </div>
  );
}
