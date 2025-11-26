'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, TrendingUp, Save, Factory, Users, LogOut, AlertCircle, Trash2 } from 'lucide-react';

export default function SupervisorDashboard() {
  const [user, setUser] = useState('');
  const router = useRouter();
  
  const [projectId, setProjectId] = useState('');
  const [partType, setPartType] = useState('');
  const [partName, setPartName] = useState('');
  const [manufacturingProcess, setManufacturingProcess] = useState('');
  const [quantity, setQuantity] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [standardTime, setStandardTime] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [machineId, setMachineId] = useState('');
  const [resinType, setResinType] = useState('');
  const [resinUsed, setResinUsed] = useState('');
  const [fiberType, setFiberType] = useState('');
  const [fiberUsed, setFiberUsed] = useState('');
  const [gelcoatColor, setGelcoatColor] = useState('');
  const [gelcoatUsed, setGelcoatUsed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const partTypes = ['FRP Tooling', 'FRP Sheets', 'Composite Pipe', 'Gelcoat Sheet', 'Resin Tank', 'Carbon Composite', 'SMC Part', 'BMC Component', 'Engineering Composites'];
  const manufacturingProcesses = ['Hand Lay-up', 'Spray-up', 'RTM (Resin Transfer Molding)', 'Compression Molding', 'Vacuum Bagging', 'Pultrusion', 'Filament Winding', 'Robotic Machining'];
  const resinTypes = ['Polyester Resin', 'Vinyl Ester Resin', 'Epoxy Resin', 'Phenolic Resin', 'Isophthalic Resin', 'Orthophthalic Resin'];
  const fiberTypes = ['E-Glass Fiber (CSM)', 'E-Glass Fiber (WR)', 'S-Glass Fiber', 'Carbon Fiber', 'Aramid Fiber (Kevlar)', 'Basalt Fiber'];
  const gelcoatColors = ['White', 'Black', 'Red', 'Blue', 'Green', 'Gray', 'Clear', 'Custom'];

  // Load data from localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      const savedTasks = localStorage.getItem('productionTasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
  }, [router]);

  const calculateTEI = () => {
    if (!quantity || !startTime || !endTime || !standardTime) return '0.0';
    // Create Date objects for time calculation (date part doesn't matter, just time)
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    // Check if end time is before start time (e.g., crossing midnight)
    let actualMilliseconds = end.getTime() - start.getTime();
    if (actualMilliseconds < 0) {
        // If end time is earlier, assume it crossed midnight (add 24 hours)
        actualMilliseconds += 24 * 60 * 60 * 1000;
    }

    const actualMinutes = actualMilliseconds / 60000;
    
    const standardMinutes = parseFloat(standardTime) * parseInt(quantity);
    
    if (actualMinutes <= 0 || standardMinutes <= 0) return '0.0';
    
    // Calculate TEI: (Standard Time / Actual Time) * 100
    return Math.min((standardMinutes / actualMinutes) * 100, 999).toFixed(1);
  };

  const tei = calculateTEI();

  // Save data to localStorage
  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const newTask = {
        id: Date.now(),
        projectId,
        partType,
        partName,
        manufacturingProcess,
        quantity: parseInt(quantity),
        startTime,
        endTime,
        standardTime: parseFloat(standardTime),
        operatorName,
        machineId,
        materials: {
          resin: { type: resinType, quantity: parseFloat(resinUsed) || 0 },
          fiber: { type: fiberType, quantity: parseFloat(fiberUsed) || 0 },
          gelcoat: { color: gelcoatColor, quantity: parseFloat(gelcoatUsed) || 0 }
        },
        tei: parseFloat(tei),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      
      // Save to localStorage for admin and other dashboards
      localStorage.setItem('productionTasks', JSON.stringify(updatedTasks));
      
      setMessage('Data saved successfully');
      
      // Clear form fields
      setProjectId('');
      setPartType('');
      setPartName('');
      setManufacturingProcess('');
      setQuantity('');
      setStartTime('');
      setEndTime('');
      setStandardTime('');
      setOperatorName('');
      setMachineId('');
      setResinType('');
      setResinUsed('');
      setFiberType('');
      setFiberUsed('');
      setGelcoatColor('');
      setGelcoatUsed('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving data');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form without saving
  const handleClearForm = () => {
    setProjectId('');
    setPartType('');
    setPartName('');
    setManufacturingProcess('');
    setQuantity('');
    setStartTime('');
    setEndTime('');
    setStandardTime('');
    setOperatorName('');
    setMachineId('');
    setResinType('');
    setResinUsed('');
    setFiberType('');
    setFiberUsed('');
    setGelcoatColor('');
    setGelcoatUsed('');
    setMessage('');
  };

  // Delete a task
  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('productionTasks', JSON.stringify(updatedTasks));
    setMessage('Task deleted');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  // Calculate KPIs
  const avgTEI = tasks.length > 0 ? (tasks.reduce((s, t) => s + t.tei, 0) / tasks.length).toFixed(1) : '0.0';
  const totalUnits = tasks.reduce((s, t) => s + (t.quantity || 0), 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Production Dashboard</h1>
                  <p className="text-zinc-400 text-sm mt-1">Supervisor Control Panel</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Logged in as</p>
                  <p className="text-sm font-semibold text-blue-300">{user}</p>
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <Package className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-xs font-medium text-blue-300 uppercase">Total</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{tasks.length}</h3>
              <p className="text-sm text-zinc-400 mt-2">Tasks Saved</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <TrendingUp className="w-6 h-6 text-green-300" />
                </div>
                <span className="text-xs font-medium text-green-300 uppercase">Average</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{avgTEI}%</h3>
              <p className="text-sm text-zinc-400 mt-2">Task Efficiency (TEI)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <Factory className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-xs font-medium text-purple-300 uppercase">Total</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{totalUnits}</h3>
              <p className="text-sm text-zinc-400 mt-2">Units Produced</p>
            </motion.div>
          </div>

          {/* Form & Task List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Entry Form */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <AlertCircle className="w-5 h-5 text-blue-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Record Task</h2>
              </div>

              <form onSubmit={handleSaveData} className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">Project ID</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    required
                    placeholder="TRIO-2024-001"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Part Type</label>
                    <select
                      value={partType}
                      onChange={e => setPartType(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800 border border-white/20 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Select</option>
                      {partTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Process</label>
                    <select
                      value={manufacturingProcess}
                      onChange={e => setManufacturingProcess(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-zinc-800 border border-white/20 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Select</option>
                      {manufacturingProcesses.map(mp => <option key={mp} value={mp}>{mp}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">Part Name</label>
                  <input
                    type="text"
                    value={partName}
                    onChange={e => setPartName(e.target.value)}
                    required
                    placeholder="e.g., 4x8ft FRP Panel"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      required
                      min={1}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Std Time (min)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={standardTime}
                      onChange={e => setStandardTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Operator</label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={e => setOperatorName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-200 mb-2">Machine ID</label>
                    <input
                      type="text"
                      value={machineId}
                      onChange={e => setMachineId(e.target.value)}
                      required
                      placeholder="M-001"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Materials Section */}
                <div className="border-t border-white/10 pt-5 space-y-3">
                  <h3 className="text-sm font-bold text-blue-200">Materials (Optional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={resinType}
                      onChange={e => setResinType(e.target.value)}
                      className="px-3 py-2 bg-zinc-800 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Resin Type</option>
                      {resinTypes.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input
                      type="number"
                      step={0.1}
                      value={resinUsed}
                      onChange={e => setResinUsed(e.target.value)}
                      placeholder="Qty (kg)"
                      className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={fiberType}
                      onChange={e => setFiberType(e.target.value)}
                      className="px-3 py-2 bg-zinc-800 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Fiber Type</option>
                      {fiberTypes.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <input
                      type="number"
                      step={0.1}
                      value={fiberUsed}
                      onChange={e => setFiberUsed(e.target.value)}
                      placeholder="Qty (kg)"
                      className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={gelcoatColor}
                      onChange={e => setGelcoatColor(e.target.value)}
                      className="px-3 py-2 bg-zinc-800 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Gelcoat</option>
                      {gelcoatColors.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input
                      type="number"
                      step={0.1}
                      value={gelcoatUsed}
                      onChange={e => setGelcoatUsed(e.target.value)}
                      placeholder="Qty (kg)"
                      className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-lg placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* TEI Display */}
                {tei !== '0.0' && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className={`p-5 rounded-xl text-center border-2 ${
                      parseFloat(tei) >= 85 ? 'bg-green-500/10 border-green-500/30' :
                      parseFloat(tei) >= 70 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <p className="text-xs font-semibold text-zinc-300 mb-1">Task Efficiency (TEI)</p>
                    <p className={`text-4xl font-bold ${
                      parseFloat(tei) >= 85 ? 'text-green-300' :
                      parseFloat(tei) >= 70 ? 'text-yellow-300' : 'text-red-300'
                    }`}>{tei}%</p>
                  </motion.div>
                )}

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-lg text-center font-semibold text-sm bg-green-500/10 border border-green-500/30 text-green-300"
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save and Clear Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-green-500/20"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Data
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear Form
                  </button>
                </div>
              </form>
            </motion.section>

            {/* Recent Tasks */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Saved Tasks</h2>
              {tasks.length === 0 ? (
                <div className="text-center py-24 text-zinc-400">
                  <Package className="w-20 h-20 mx-auto mb-4 text-zinc-600" />
                  <p className="font-medium text-lg">No tasks saved yet</p>
                  <p className="text-sm mt-2 text-zinc-500">Save your first production task to see it here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold border border-blue-500/30">{task.projectId}</span>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium border border-purple-500/30">{task.manufacturingProcess}</span>
                          </div>
                          <h3 className="font-bold text-lg text-white">{task.partType}</h3>
                          <p className="text-sm text-zinc-400 mt-1">{task.partName}</p>
                          <p className="text-xs text-zinc-500 mt-2">{task.date} {task.time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className={`px-4 py-2 rounded-lg font-bold text-xl border ${
                            task.tei >= 85 ? 'bg-green-500/10 text-green-300 border-green-500/30' :
                            task.tei >= 70 ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'
                          }`}>{task.tei}%</div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300">
                        <div><span className="text-zinc-400">Qty:</span> <strong className="text-white">{task.quantity}</strong> units</div>
                        <div><span className="text-zinc-400">Time:</span> <strong className="text-white">{task.startTime}-{task.endTime}</strong></div>
                        <div><span className="text-zinc-400">Operator:</span> <strong className="text-white">{task.operatorName}</strong></div>
                        <div><span className="text-zinc-400">Machine:</span> <strong className="text-white">{task.machineId}</strong></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
}