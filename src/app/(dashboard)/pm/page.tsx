'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Package, CheckCircle, XCircle, Factory, Calendar } from 'lucide-react';

// --- Types ---
interface MaterialSpecs {
  resinType: string;
  resinQty: number;
  gelcoatPerMold: number;
  pigmentQty: number;
}

interface BOM {
  id: number;
  sNo: string;
  projectCode: string;
  projectDescription: string;
  inHouseExport: 'In-house' | 'Export';
  poReference: string;
  moldSeries: '32' | '54' | '108';
  totalMolds: number;
  moldVIP: boolean;
  targetPartsCompletion: number;
  materials: MaterialSpecs;
  targetCompletionDate: string;
  partShipDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  remarks: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdDate: string;
}

export default function ProjectManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [boms, setBoms] = useState<BOM[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // FIXED: Initialized materials object to prevent crashes
  const [formData, setFormData] = useState<Partial<BOM>>({
    inHouseExport: 'In-house',
    moldSeries: '32',
    moldVIP: false,
    status: 'Pending',
    materials: {
      resinType: '',
      resinQty: 0,
      gelcoatPerMold: 0,
      pigmentQty: 0
    }
  });

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser || currentUser !== 'pm') {
      router.push('/login');
    } else {
      setUser('Project Manager');
      loadBOMs();
    }
  }, [router]);

  const loadBOMs = () => {
    const saved = localStorage.getItem('boms');
    if (saved) {
      setBoms(JSON.parse(saved));
    }
  };

  const calculateTotalGelcoat = () => {
    if (!formData.totalMolds || !formData.materials?.gelcoatPerMold) return 0;
    return (formData.totalMolds * formData.materials.gelcoatPerMold).toFixed(1);
  };

  const handleCreateBOM = () => {
    if (!formData.projectCode || !formData.projectDescription || !formData.totalMolds) {
      alert('Please fill all required fields!');
      return;
    }

    const newBOM: BOM = {
      id: Date.now(),
      sNo: `BOM-${Date.now()}`,
      projectCode: formData.projectCode || '',
      projectDescription: formData.projectDescription || '',
      inHouseExport: formData.inHouseExport || 'In-house',
      poReference: formData.poReference || '',
      moldSeries: formData.moldSeries || '32',
      totalMolds: formData.totalMolds || 0,
      moldVIP: formData.moldVIP || false,
      targetPartsCompletion: formData.targetPartsCompletion || 0,
      // Safe fallback for materials
      materials: {
        resinType: formData.materials?.resinType || '',
        resinQty: formData.materials?.resinQty || 0,
        gelcoatPerMold: formData.materials?.gelcoatPerMold || 0,
        pigmentQty: formData.materials?.pigmentQty || 0,
      },
      targetCompletionDate: formData.targetCompletionDate || '',
      partShipDate: formData.partShipDate || '',
      expectedCompletionDate: formData.expectedCompletionDate || '',
      remarks: formData.remarks || '',
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0],
    };

    const updated = [...boms, newBOM];
    setBoms(updated);
    localStorage.setItem('boms', JSON.stringify(updated));

    setShowCreateModal(false);
    // Reset Form
    setFormData({
      inHouseExport: 'In-house',
      moldSeries: '32',
      moldVIP: false,
      status: 'Pending',
      materials: {
        resinType: '',
        resinQty: 0,
        gelcoatPerMold: 0,
        pigmentQty: 0
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  // Safe helper to update nested materials
  const updateMaterial = (field: keyof MaterialSpecs, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      materials: {
        ...prev.materials!, // We know it exists because we initialized it
        [field]: value
      }
    }));
  };

  const stats = {
    total: boms.length,
    pending: boms.filter(b => b.status === 'Pending').length,
    inProgress: boms.filter(b => b.status === 'In Progress').length,
    completed: boms.filter(b => b.status === 'Completed').length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

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
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">BOM Management</h1>
                  <p className="text-zinc-400 text-sm mt-1">Project Manager Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-zinc-400">Logged in as</p>
                  <p className="text-sm font-semibold text-purple-300">{user}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              <p className="text-sm text-zinc-400 mt-2">Total BOMs</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-yellow-300">{stats.pending}</h3>
              <p className="text-sm text-zinc-400 mt-2">Pending</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-blue-300">{stats.inProgress}</h3>
              <p className="text-sm text-zinc-400 mt-2">In Progress</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-green-300">{stats.completed}</h3>
              <p className="text-sm text-zinc-400 mt-2">Completed</p>
            </div>
          </div>

          {/* Create BOM Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">All Projects</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New BOM
            </button>
          </div>

          {/* BOM List */}
          <div className="space-y-4">
            {boms.map((bom) => (
              <div key={bom.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold border border-purple-500/30">
                        {bom.projectCode}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold border border-blue-500/30">
                        Series: {bom.moldSeries}
                      </span>
                      {bom.moldVIP && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm font-semibold border border-red-500/30">
                          VIP
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{bom.projectDescription}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-black/20 p-4 rounded-lg">
                      <div><span className="text-zinc-500 block mb-1">Molds</span> <strong className="text-zinc-200">{bom.totalMolds}</strong></div>
                      <div><span className="text-zinc-500 block mb-1">Target</span> <strong className="text-zinc-200">{bom.targetPartsCompletion} Parts</strong></div>
                      <div><span className="text-zinc-500 block mb-1">Due Date</span> <strong className="text-zinc-200">{bom.targetCompletionDate}</strong></div>
                      <div><span className="text-zinc-500 block mb-1">Gelcoat</span> <strong className="text-zinc-200">{(bom.totalMolds * bom.materials.gelcoatPerMold).toFixed(1)} kg</strong></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-lg font-semibold border ${
                      bom.status === 'Completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                      bom.status === 'In Progress' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    }`}>
                      {bom.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {boms.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Package className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                <p className="text-zinc-400 text-lg">No BOMs created yet.</p>
                <p className="text-zinc-600 text-sm mt-1">Click "Create New BOM" to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create BOM Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-white">Create New BOM</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Code */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Project Code *</label>
                  <input
                    type="text"
                    value={formData.projectCode || ''}
                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                    placeholder="TRIO-2024-001"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl focus:border-purple-500/50 outline-none transition-colors"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Project Description *</label>
                  <input
                    type="text"
                    value={formData.projectDescription || ''}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="FRP Panel Production"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl focus:border-purple-500/50 outline-none transition-colors"
                  />
                </div>

                {/* In-house/Export */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Type</label>
                  <select
                    value={formData.inHouseExport}
                    onChange={(e) => setFormData({ ...formData, inHouseExport: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-white/10 text-white rounded-xl outline-none"
                  >
                    <option value="In-house">In-house</option>
                    <option value="Export">Export</option>
                  </select>
                </div>

                {/* PO Reference */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">PO Reference</label>
                  <input
                    type="text"
                    value={formData.poReference || ''}
                    onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
                    placeholder="PO-2024-001"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl focus:border-purple-500/50 outline-none"
                  />
                </div>

                {/* Mold Series */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Mold Series *</label>
                  <select
                    value={formData.moldSeries}
                    onChange={(e) => setFormData({ ...formData, moldSeries: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-white/10 text-white rounded-xl outline-none"
                  >
                    <option value="32">32 Series</option>
                    <option value="54">54 Series</option>
                    <option value="108">108 Series</option>
                  </select>
                </div>

                {/* Total Molds */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Total Molds Available *</label>
                  <input
                    type="number"
                    value={formData.totalMolds || ''}
                    onChange={(e) => setFormData({ ...formData, totalMolds: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    min="1"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl focus:border-purple-500/50 outline-none"
                  />
                </div>

                {/* Mold VIP */}
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    checked={formData.moldVIP || false}
                    onChange={(e) => setFormData({ ...formData, moldVIP: e.target.checked })}
                    className="w-5 h-5 rounded accent-purple-500"
                  />
                  <label className="text-sm font-semibold text-zinc-300">Mark as VIP Mold (Priority)</label>
                </div>

                {/* Target Parts Completion */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Target Parts to Complete *</label>
                  <input
                    type="number"
                    value={formData.targetPartsCompletion || ''}
                    onChange={(e) => setFormData({ ...formData, targetPartsCompletion: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    min="1"
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl focus:border-purple-500/50 outline-none"
                  />
                </div>

                {/* Materials Section */}
                <div className="col-span-1 md:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10 mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Factory className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Materials Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Resin Type</label>
                      <input
                        type="text"
                        value={formData.materials?.resinType || ''}
                        onChange={(e) => updateMaterial('resinType', e.target.value)}
                        placeholder="Polyester Resin"
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Resin Quantity (kg)</label>
                      <input
                        type="number"
                        value={formData.materials?.resinQty || ''}
                        onChange={(e) => updateMaterial('resinQty', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Gelcoat per Mold (kg)</label>
                      <input
                        type="number"
                        value={formData.materials?.gelcoatPerMold || ''}
                        onChange={(e) => updateMaterial('gelcoatPerMold', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-purple-500/50"
                      />
                    </div>
                     {/* Auto Calculated */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Total Gelcoat Needed</label>
                      <div className="w-full px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-lg flex justify-between items-center">
                        <span>{calculateTotalGelcoat()} kg</span>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Pigment Quantity (kg)</label>
                      <input
                        type="number"
                        value={formData.materials?.pigmentQty || ''}
                        onChange={(e) => updateMaterial('pigmentQty', parseFloat(e.target.value) || 0)}
                        step="0.1"
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="col-span-1 md:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10 mt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Production Schedule</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Target Completion</label>
                      <input
                        type="date"
                        value={formData.targetCompletionDate || ''}
                        onChange={(e) => setFormData({ ...formData, targetCompletionDate: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Part Ship Date</label>
                      <input
                        type="date"
                        value={formData.partShipDate || ''}
                        onChange={(e) => setFormData({ ...formData, partShipDate: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-zinc-400 mb-2">Expected Completion</label>
                      <input
                        type="date"
                        value={formData.expectedCompletionDate || ''}
                        onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Remarks</label>
                  <textarea
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-800/50 border border-white/10 text-white rounded-xl outline-none resize-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleCreateBOM}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/25"
                >
                  Create Production BOM
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}