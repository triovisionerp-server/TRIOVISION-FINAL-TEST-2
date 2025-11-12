'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, TrendingUp, Plus, Save } from 'lucide-react';

export default function SupervisorDashboard() {
  // Form states
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
  
  // Material states
  const [resinType, setResinType] = useState('');
  const [resinUsed, setResinUsed] = useState('');
  const [fiberType, setFiberType] = useState('');
  const [fiberUsed, setFiberUsed] = useState('');
  const [gelcoatColor, setGelcoatColor] = useState('');
  const [gelcoatUsed, setGelcoatUsed] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  // Industry data
  const partTypes = [
    'Mould/Tooling', 'FRP Panel', 'Composite Pipe', 'Gelcoat Sheet', 
    'Resin Tank', 'Fiber Glass Part', 'Carbon Composite', 'SMC Part', 
    'BMC Component', 'Custom Part'
  ];

  const manufacturingProcesses = [
    'Hand Lay-up', 'Spray-up', 'RTM (Resin Transfer Molding)', 
    'Compression Molding', 'Vacuum Bagging', 'Pultrusion', 'Filament Winding'
  ];

  const resinTypes = [
    'Polyester Resin', 'Vinyl Ester Resin', 'Epoxy Resin', 
    'Phenolic Resin', 'Isophthalic Resin', 'Orthophthalic Resin'
  ];

  const fiberTypes = [
    'E-Glass Fiber (CSM)', 'E-Glass Fiber (WR)', 'S-Glass Fiber', 
    'Carbon Fiber', 'Aramid Fiber (Kevlar)', 'Basalt Fiber', 'Hybrid Fabric'
  ];

  const gelcoatColors = [
    'White', 'Black', 'Red', 'Blue', 'Green', 
    'Yellow', 'Gray', 'Clear/Transparent', 'Custom Color'
  ];

  // Calculate TEI
  const calculateTEI = () => {
    if (!quantity || !startTime || !endTime || !standardTime) return '0.0';
    
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const actualMinutes = (end.getTime() - start.getTime()) / 60000;
    const standardMinutes = parseFloat(standardTime) * parseInt(quantity);
    
    if (actualMinutes <= 0) return '0.0';
    
    const teiValue = (standardMinutes / actualMinutes) * 100;
    return Math.min(teiValue, 999).toFixed(1);
  };

  const tei = calculateTEI();

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate saving (will connect to Firebase later)
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
        date: new Date().toLocaleDateString()
      };

      setTasks([newTask, ...tasks]);
      setMessage('✅ Task recorded successfully!');

      // Reset form
      setProjectId(''); setPartType(''); setPartName(''); 
      setManufacturingProcess(''); setQuantity(''); 
      setStartTime(''); setEndTime(''); setStandardTime('');
      setOperatorName(''); setMachineId('');
      setResinType(''); setResinUsed('');
      setFiberType(''); setFiberUsed('');
      setGelcoatColor(''); setGelcoatUsed('');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error recording task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Production Supervisor Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Composite Manufacturing - Task & Material Tracking</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Logged in as:</p>
              <p className="text-white font-semibold">supervisor@triovisioninternational.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today's Tasks</p>
                <h3 className="text-4xl font-bold mt-2">{tasks.length}</h3>
              </div>
              <Package className="w-10 h-10 text-blue-200 opacity-50" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-medium">Average TEI</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tasks.length > 0 
                    ? (tasks.reduce((sum, t) => sum + t.tei, 0) / tasks.length).toFixed(1)
                    : '0.0'}%
                </h3>
              </div>
              <TrendingUp className="w-10 h-10 text-green-200 opacity-50" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Production</p>
                <h3 className="text-4xl font-bold mt-2">
                  {tasks.reduce((sum, t) => sum + (t.quantity || 0), 0)}
                </h3>
              </div>
              <Clock className="w-10 h-10 text-purple-200 opacity-50" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Entry Form */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Record Production Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
              {/* Project Info */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Project / Job ID *
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                  placeholder="e.g., PROJ-2024-001"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Part Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Part Type *
                  </label>
                  <select
                    value={partType}
                    onChange={(e) => setPartType(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {partTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Process *
                  </label>
                  <select
                    value={manufacturingProcess}
                    onChange={(e) => setManufacturingProcess(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {manufacturingProcesses.map(process => (
                      <option key={process} value={process}>{process}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Part Name / Description *
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  required
                  placeholder="e.g., 4x8ft Panel"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Production Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                    placeholder="100"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Std Time (min/unit) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={standardTime}
                    onChange={(e) => setStandardTime(e.target.value)}
                    required
                    placeholder="2.5"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Operator Name *
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    required
                    placeholder="Operator name"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Machine / Bay ID *
                  </label>
                  <input
                    type="text"
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    required
                    placeholder="M-001 or Bay-A"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Materials (Optional) */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-slate-300 font-semibold mb-3">Material Consumption (Optional)</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={resinType}
                      onChange={(e) => setResinType(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    >
                      <option value="">Resin Type</option>
                      {resinTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      value={resinUsed}
                      onChange={(e) => setResinUsed(e.target.value)}
                      placeholder="Resin (kg)"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={fiberType}
                      onChange={(e) => setFiberType(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    >
                      <option value="">Fiber Type</option>
                      {fiberTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      value={fiberUsed}
                      onChange={(e) => setFiberUsed(e.target.value)}
                      placeholder="Fiber (kg)"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={gelcoatColor}
                      onChange={(e) => setGelcoatColor(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    >
                      <option value="">Gelcoat Color</option>
                      {gelcoatColors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      value={gelcoatUsed}
                      onChange={(e) => setGelcoatUsed(e.target.value)}
                      placeholder="Gelcoat (kg)"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* TEI Display */}
              {tei !== '0.0' && (
                <div className={`p-6 rounded-xl border-2 text-center ${
                  parseFloat(tei) >= 85 ? 'bg-green-500/10 border-green-500' : 
                  parseFloat(tei) >= 70 ? 'bg-yellow-500/10 border-yellow-500' : 
                  'bg-red-500/10 border-red-500'
                }`}>
                  <p className="text-slate-300 text-sm font-medium mb-2">TEI (Task Efficiency Index)</p>
                  <p className={`text-5xl font-bold ${
                    parseFloat(tei) >= 85 ? 'text-green-400' : 
                    parseFloat(tei) >= 70 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {tei}%
                  </p>
                </div>
              )}

              {message && (
                <div className={`p-4 rounded-lg text-center font-semibold ${
                  message.includes('✅') ? 'bg-green-500/20 text-green-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Record Task
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Task List */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Today's Production Tasks</h2>
            
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No tasks recorded today</p>
                <p className="text-slate-500 text-sm mt-2">Start by recording your first task!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 bg-slate-700/30 border border-slate-600 rounded-xl hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                            {task.projectId}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                            {task.manufacturingProcess}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-white">{task.partType}</h3>
                        <p className="text-slate-400 text-sm">{task.partName}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-xl ${
                        task.tei >= 85 ? 'bg-green-500/20 text-green-400' : 
                        task.tei >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {task.tei}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Qty:</span>
                        <span className="text-white font-semibold ml-2">{task.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Time:</span>
                        <span className="text-white font-semibold ml-2">{task.startTime} - {task.endTime}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Operator:</span>
                        <span className="text-white font-semibold ml-2">{task.operatorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Machine:</span>
                        <span className="text-white font-semibold ml-2">{task.machineId}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
