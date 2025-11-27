'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, ClipboardList, 
  Factory, ShoppingCart, LogOut, Wrench // Import Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: "MD Overview", path: "/md" },
  { icon: ClipboardList, label: "Project Manager", path: "/pm" },
  { icon: Wrench, label: "Tooling Dept", path: "/tooling" }, // Added Tooling
  { icon: Factory, label: "Production Floor", path: "/supervisor" },
  { icon: ShoppingCart, label: "Store / Inventory", path: "/store" },
  { icon: Users, label: "Customer Portal", path: "/customer" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 z-50 p-6 flex flex-col">
      {/* Glass Container */}
      <div className="h-full w-full backdrop-blur-xl bg-zinc-950/50 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-8 pb-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-xl font-bold text-white">TV</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Composite ERP</h1>
            <p className="text-xs text-zinc-500">Internal System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? "bg-white/10 border border-white/10 shadow-lg" 
                    : "hover:bg-white/5 border border-transparent hover:border-white/5"
                }`}
              >
                {isActive && <motion.div layoutId="active-bar" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                <span className={`text-sm font-medium ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button onClick={() => { localStorage.removeItem('currentUser'); router.push('/login'); }} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}