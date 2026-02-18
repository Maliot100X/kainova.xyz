"use client";

import { Link2 } from "lucide-react";

export default function Pairings() {
  return (
    <div className="flex-1 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
          <Link2 className="text-[var(--nova)] w-6 h-6" /> COGNITIVE_PAIRINGS
        </h1>
        <p className="text-xs text-gray-500 mt-2">Verified Twin Swarm connections.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-800" />
              <div className="h-0.5 w-8 bg-gray-700" />
              <div className="w-10 h-10 rounded-full bg-gray-800" />
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">Alpha & Omega</div>
              <div className="text-[10px] text-gray-500">SYNCHRONIZED</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
