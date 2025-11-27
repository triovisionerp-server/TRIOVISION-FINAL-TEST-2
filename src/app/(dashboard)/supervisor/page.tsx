'use client';

/**
 * 🎓 SUPERVISOR DASHBOARD (FIXED)
 * UI: Preserves your exact layout (Gradient, Modal, Checklists).
 * FIX: Added safe checks (?. and || 0) to prevent 'resinQty' crashes.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, CheckCircle, XCircle, Clock, Package, AlertCircle,
  Users, TrendingUp, Layers, Scissors, Wrench, Box, Truck
} from 'lucide-react';

// --- Interfaces ---

interface ProductionStep {
  id: string;
  name: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  operator?: string;
  notes?: string;
}

interface ProductionRecord {
  id: number;
  bomId: number;
  projectCode: string;
  moldSeries: string;
  totalMolds: number;
  targetParts: number;
  partsCompleted: number;
  
  // Pre-checks
  moldAvailable: boolean;
  manpowerAvailable: boolean;
  assignedWorkers: string[];
  
  // Production Steps
  steps: {
    csr: ProductionStep;
    packing: ProductionStep;
    gelcoatApp: ProductionStep;
    fiberPlacement: ProductionStep;
    processType: 'Injection' | 'Infusion' | 'HLU' | '';
    curingTime: number;
    demolding: ProductionStep;
    trimming: ProductionStep;
    drySanding: ProductionStep;
    waterSanding: ProductionStep;
    buffing: ProductionStep;
    rework: {
      needed: boolean;
      step: string;
      reason: string;
      materialUsed: number;
    };
    palletMaking: ProductionStep;
    partLoading: ProductionStep;
    dispatch: ProductionStep;
  };
  
  // Material Consumption
  materialsUsed: {
    resinUsed: number;
    gelcoatUsed: number;
    pigmentUsed: number;
  };
  
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: string;
  completionDate?: string;
}

export default function SupervisorProductionPage() {
  const [user, setUser] = useState('');
  const [boms, setBoms] = useState<any[]>([]);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [selectedBOM, setSelectedBOM] = useState<any>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentProduction, setCurrentProduction] = useState<ProductionRecord | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    // Optional: Redirect if needed
    // if (!currentUser) router.push('/login'); 
    
    setUser('Supervisor');
    loadBOMs();
    loadProductions();
  }, [router]);

  const loadBOMs = () => {
    const saved = localStorage.getItem('boms');
    if (saved) {
      try {
        const allBOMs = JSON.parse(saved);
        // Filter incomplete BOMs
        setBoms(allBOMs.filter((b: any) => b.status !== 'Completed'));
      } catch (e) {
        console.error("Error loading BOMs", e);
      }
    }
  };

  const loadProductions = () => {
    const saved = localStorage.getItem('productions');
    if (saved) {
      try {
        setProductions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading productions", e);
      }
    }
  };

  // --- FIX 1: Safe Initialization ---
  const startProduction = (bom: any) => {
    // Calculate default values safely
    // Uses 0 if 'materials' or 'gelcoatPerMold' is missing
    const defaultGelcoat = bom.materials?.gelcoatPerMold || 0;
    
    const newProduction: ProductionRecord = {
      id: Date.now(),
      bomId: bom.id,
      projectCode: bom.projectCode || 'N/A',
      moldSeries: bom.moldSeries || 'Standard',
      totalMolds: bom.totalMolds || 1,
      targetParts: bom.targetPartsCompletion || 10,
      partsCompleted: 0,
      moldAvailable: false,
      manpowerAvailable: false,
      assignedWorkers: [],
      steps: {
        csr: { id: 'csr', name: 'CSR', completed: false },
        packing: { id: 'packing', name: 'Packing', completed: false },
        gelcoatApp: { id: 'gelcoat', name: 'Gelcoat Application', completed: false },
        fiberPlacement: { id: 'fiber', name: 'Fiber Placement', completed: false },
        processType: '',
        curingTime: 0,
        demolding: { id: 'demolding', name: 'Demolding', completed: false },
        trimming: { id: 'trimming', name: 'Trimming & Detailing', completed: false },
        drySanding: { id: 'drysand', name: 'Dry Sanding', completed: false },
        waterSanding: { id: 'watersand', name: 'Water Sanding', completed: false },
        buffing: { id: 'buffing', name: 'Buffing', completed: false },
        rework: { needed: false, step: '', reason: '', materialUsed: 0 },
        palletMaking: { id: 'pallet', name: 'Pallet Making', completed: false },
        partLoading: { id: 'loading', name: 'Part Loading', completed: false },
        dispatch: { id: 'dispatch', name: 'Dispatch', completed: false },
      },
      materialsUsed: {
        resinUsed: 0,
        gelcoatUsed: 0,
        pigmentUsed: 0,
      },
      status: 'Not Started',
    };
    
    setCurrentProduction(newProduction);
    setSelectedBOM(bom);
    setShowTrackingModal(true);
  };

  const toggleStep = (stepKey: string) => {
    if (!currentProduction) return;
    
    const updated = { ...currentProduction };
    const step = (updated.steps as any)[stepKey];
    
    if (step && typeof step === 'object' && 'completed' in step) {
      step.completed = !step.completed;
      if (step.completed) {
        step.endTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
        if (!step.startTime) step.startTime = step.endTime;
      }
      setCurrentProduction(updated);
    }
  };

  const saveProduction = () => {
    if (!currentProduction) return;
    
    // Simplified completion check (Expand as needed)
    const s = currentProduction.steps;
    const allStepsCompleted = s.dispatch.completed;
    
    currentProduction.status = allStepsCompleted ? 'Completed' : 'In Progress';
    if (!currentProduction.startDate) currentProduction.startDate = new Date().toISOString().split('T')[0];
    if (allStepsCompleted) currentProduction.completionDate = new Date().toISOString().split('T')[0];
    
    // --- FIX 2: Safe Auto-Calculation ---
    if (currentProduction.materialsUsed.gelcoatUsed === 0 && selectedBOM) {
      // Safely access materials
      const gPerMold = selectedBOM.materials?.gelcoatPerMold || 0;
      currentProduction.materialsUsed.gelcoatUsed = selectedBOM.totalMolds * gPerMold;
    }
    
    // Save to Storage
    const existingIndex = productions.findIndex(p => p.bomId === currentProduction.bomId);
    let updatedProds;
    if (existingIndex >= 0) {
      updatedProds = [...productions];
      updatedProds[existingIndex] = currentProduction;
    } else {
      updatedProds = [...productions, currentProduction];
    }
    
    setProductions(updatedProds);
    localStorage.setItem('productions', JSON.stringify(updatedProds));
    
    // Update BOM status
    if (allStepsCompleted) {
      const allBOMs = JSON.parse(localStorage.getItem('boms') || '[]');
      const updatedBOMs = allBOMs.map((b: any) => 
        b.id === selectedBOM.id ? { ...b, status: 'Completed', actualCompletionDate: new Date().toISOString().split('T')[0] } : b
      );
      localStorage.setItem('boms', JSON.stringify(updatedBOMs));
      setBoms(updatedBOMs.filter((b: any) => b.status !== 'Completed'));
    }
    
    setShowTrackingModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const getProduction = (bomId: number) => productions.find(p => p.bomId === bomId);

  // Safe Stats Logic
  const todayStr = new Date().toISOString().split('T')[0];
  const stats = {
    totalBOMs: boms.length,
    inProgress: productions.filter(p => p.status === 'In Progress').length,
    completed: productions.filter(p => p.status === 'Completed').length,
    partsToday: productions
      .filter(p => p.completionDate === todayStr)
      .reduce((sum, p) => sum + (p.partsCompleted || 0), 0),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden text-white font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Production Tracking</h1>
                  <p className="text-zinc-400 text-sm mt-1">Supervisor Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Logged in as</p>
                  <p className="text-sm font-semibold text-green-300">{user}</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-white">{stats.totalBOMs}</h3>
              <p className="text-sm text-zinc-400 mt-2">Active BOMs</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-blue-300">{stats.inProgress}</h3>
              <p className="text-sm text-zinc-400 mt-2">In Progress</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-green-300">{stats.completed}</h3>
              <p className="text-sm text-zinc-400 mt-2">Completed</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-3xl font-bold text-purple-300">{stats.partsToday}</h3>
              <p className="text-sm text-zinc-400 mt-2">Parts Today</p>
            </div>
          </div>

          {/* BOM List */}
          <h2 className="text-xl font-bold text-white mb-6">Available BOMs</h2>
          <div className="space-y-4">
            {boms.map((bom) => {
              const production = getProduction(bom.id);
              
              // --- FIX 3: Safe Rendering Variables ---
              const resin = bom.materials?.resinType || 'Standard';
              // If gelcoatPerMold is missing, default to 0.
              const gelcoatPerMold = bom.materials?.gelcoatPerMold || 0;
              const totalGelcoat = gelcoatPerMold * (bom.totalMolds || 1);

              return (
                <div key={bom.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-3 mb-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-semibold">{bom.projectCode}</span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold">Series: {bom.moldSeries}</span>
                        {production && (
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            production.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                            production.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {production.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{bom.projectDescription}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm text-zinc-300">
                        <div><span className="text-zinc-400">Molds:</span> <strong>{bom.totalMolds}</strong></div>
                        <div><span className="text-zinc-400">Resin:</span> <strong>{resin}</strong></div>
                        <div><span className="text-zinc-400">Est. Gelcoat:</span> <strong>{totalGelcoat} kg</strong></div>
                        <div><span className="text-zinc-400">Parts Done:</span> <strong>{production?.partsCompleted || 0}</strong></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (production) {
                          setCurrentProduction(production);
                          setSelectedBOM(bom);
                          setShowTrackingModal(true);
                        } else {
                          startProduction(bom);
                        }
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
                    >
                      {production ? 'Continue Tracking' : 'Start Production'}
                    </button>
                  </div>
                </div>
              );
            })}
            {boms.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                <Package className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <p>No BOMs assigned yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Production Tracking Modal */}
      <AnimatePresence>
        {showTrackingModal && currentProduction && selectedBOM && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTrackingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedBOM.projectCode}</h2>
                    <p className="text-zinc-400">{selectedBOM.projectDescription}</p>
                  </div>
                  <button onClick={() => setShowTrackingModal(false)} className="text-zinc-500 hover:text-white"><XCircle className="w-8 h-8"/></button>
              </div>

              {/* 1. Pre-Production Checks */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Pre-Production Checks</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduction.moldAvailable} onChange={(e) => setCurrentProduction({...currentProduction, moldAvailable: e.target.checked})} className="w-5 h-5 rounded" />
                    <span className="text-white font-medium">Mold Available</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduction.manpowerAvailable} onChange={(e) => setCurrentProduction({...currentProduction, manpowerAvailable: e.target.checked})} className="w-5 h-5 rounded" />
                    <span className="text-white font-medium">Manpower Available</span>
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">Assign Workers</label>
                  <input type="text" value={currentProduction.assignedWorkers.join(', ')} onChange={(e) => setCurrentProduction({ ...currentProduction, assignedWorkers: e.target.value.split(',').map(w => w.trim()) })} placeholder="Worker Name..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl outline-none" />
                </div>
              </div>

              {/* 2. Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-purple-400" /> Step 1: Mold Prep</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={currentProduction.steps.csr.completed} onChange={() => toggleStep('csr')} className="w-5 h-5 rounded" />
                            <span className="text-white font-medium">CSR (Clean/Seal/Release)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={currentProduction.steps.packing.completed} onChange={() => toggleStep('packing')} className="w-5 h-5 rounded" />
                            <span className="text-white font-medium">Packing (Tape/Inserts)</span>
                        </label>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-blue-400" /> Step 2: Lamination</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={currentProduction.steps.gelcoatApp.completed} onChange={() => toggleStep('gelcoatApp')} className="w-5 h-5 rounded" />
                            <span className="text-white font-medium">Gelcoat Application</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={currentProduction.steps.fiberPlacement.completed} onChange={() => toggleStep('fiberPlacement')} className="w-5 h-5 rounded" />
                            <span className="text-white font-medium">Fiber Placement</span>
                        </label>
                    </div>
                </div>

                {/* Step 4: Trimming */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Scissors className="w-5 h-5 text-yellow-400" /> Step 4: Trimming</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={currentProduction.steps.trimming.completed} onChange={() => toggleStep('trimming')} className="w-5 h-5 rounded" />
                        <span className="text-white font-medium">Trimming Complete</span>
                    </label>
                </div>

                {/* Step 8: Dispatch */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-green-400" /> Step 8: Dispatch</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={currentProduction.steps.dispatch.completed} onChange={() => toggleStep('dispatch')} className="w-5 h-5 rounded" />
                        <span className="text-white font-medium">Ready for Dispatch</span>
                    </label>
                </div>
              </div>

              {/* Material Consumption (FIXED CRASH POINT) */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Material Consumption</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Resin Used (kg)</label>
                        {/* FIX: Safe access with ?.resinQty || 0 */}
                        <p className="text-xs text-zinc-400 mb-1">Planned: {selectedBOM.materials?.resinQty || 0} kg</p>
                        <input type="number" value={currentProduction.materialsUsed.resinUsed} onChange={(e) => setCurrentProduction({ ...currentProduction, materialsUsed: { ...currentProduction.materialsUsed, resinUsed: parseFloat(e.target.value) || 0 } })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Gelcoat Used (kg)</label>
                        {/* FIX: Safe access */}
                        <p className="text-xs text-zinc-400 mb-1">Planned: {(selectedBOM.materials?.gelcoatPerMold || 0) * (selectedBOM.totalMolds || 1)} kg</p>
                        <input type="number" value={currentProduction.materialsUsed.gelcoatUsed} onChange={(e) => setCurrentProduction({ ...currentProduction, materialsUsed: { ...currentProduction.materialsUsed, gelcoatUsed: parseFloat(e.target.value) || 0 } })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl outline-none" />
                    </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex gap-4 mt-8">
                <button onClick={saveProduction} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Save Progress
                </button>
                <button onClick={() => setShowTrackingModal(false)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all">Cancel</button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}