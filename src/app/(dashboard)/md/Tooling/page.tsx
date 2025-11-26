'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Box, Cog, Hammer, Layers, Wrench, Shield, Users2, 
  BarChart2, CheckCircle2, RotateCw, Sparkles, ChevronLeft, Factory 
} from 'lucide-react';

const toolingModules = [
  { 
    key: 'stockbuilding', 
    title: 'Stock Building', 
    subtitle: 'Raw material, Stock, Preparation.', 
    icon: Box, 
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    iconBorder: 'border-blue-500/30',
    label: 'BUILDING',
    labelColor: 'text-blue-300'
  },
  { 
    key: 'machining', 
    title: 'Machining', 
    subtitle: 'CNC, Manual, Finishing.', 
    icon: Cog, 
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20',
    iconBorder: 'border-yellow-500/30',
    label: 'MACHINING',
    labelColor: 'text-yellow-300'
  },
  { 
    key: 'patternfinishing', 
    title: 'Pattern Finishing', 
    subtitle: 'Pattern, Detailing, Prep.', 
    icon: Hammer, 
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    iconBorder: 'border-purple-500/30',
    label: 'PATTERN',
    labelColor: 'text-purple-300'
  },
  { 
    key: 'lamination', 
    title: 'Lamination', 
    subtitle: 'Composite, Layup, Curing.', 
    icon: Layers, 
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/20',
    iconBorder: 'border-pink-500/30',
    label: 'LAMINATION',
    labelColor: 'text-pink-300'
  },
  { 
    key: 'mouldfinishing', 
    title: 'Mold Finishing', 
    subtitle: 'Mold, Polishing, Release.', 
    icon: Wrench, 
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/20',
    iconBorder: 'border-green-500/30',
    label: 'FINISHING',
    labelColor: 'text-green-300'
  },
  { 
    key: 'welding', 
    title: 'Welding', 
    subtitle: 'Weld, Fabrication, Assembly.', 
    icon: Shield, 
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/20',
    iconBorder: 'border-red-500/30',
    label: 'WELDING',
    labelColor: 'text-red-300'
  },
  { 
    key: 'assembly', 
    title: 'Assembly', 
    subtitle: 'Fitting, Bonding, QA.', 
    icon: Users2, 
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20',
    iconBorder: 'border-indigo-500/30',
    label: 'ASSEMBLY',
    labelColor: 'text-indigo-300'
  },
  { 
    key: 'cmm', 
    title: 'CMM', 
    subtitle: 'Measurement, Inspection, Reports.', 
    icon: BarChart2, 
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/20',
    iconBorder: 'border-teal-500/30',
    label: 'CMM',
    labelColor: 'text-teal-300'
  },
  { 
    key: 'trimline', 
    title: 'Trimline', 
    subtitle: 'Trimming, Cutting, Detailing.', 
    icon: RotateCw, 
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    iconBorder: 'border-orange-500/30',
    label: 'TRIMLINE',
    labelColor: 'text-orange-300'
  },
  { 
    key: 'quality', 
    title: 'Quality Dept.', 
    subtitle: 'QA, QC, Documentation.', 
    icon: CheckCircle2, 
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20',
    iconBorder: 'border-cyan-500/30',
    label: 'QUALITY',
    labelColor: 'text-cyan-300'
  },
  { 
    key: 'maintenance', 
    title: 'Maintenance', 
    subtitle: 'Repairs, Upkeep, Records.', 
    icon: Sparkles, 
    iconColor: 'text-lime-400',
    iconBg: 'bg-lime-500/20',
    iconBorder: 'border-lime-500/30',
    label: 'MAINTENANCE',
    labelColor: 'text-lime-300'
  }
];

export default function ToolingMainPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Tooling Modules</h1>
                  <p className="text-zinc-400 text-sm mt-1">Molds, Teams, Tasks Management</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/md')} 
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg transition-all duration-300 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {toolingModules.map((mod, index) => {
              const IconComponent = mod.icon;
              return (
                <motion.div
                  key={mod.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/md/Tooling/${mod.key}`)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${mod.iconBg} ${mod.iconBorder} rounded-lg flex items-center justify-center border`}>
                      <IconComponent className={`w-6 h-6 ${mod.iconColor}`} />
                    </div>
                    <span className={`text-xs font-medium ${mod.labelColor} uppercase`}>{mod.label}</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white">{mod.title}</h3>
                  <p className="text-sm text-zinc-400 mt-2">{mod.subtitle}</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Click to view</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}