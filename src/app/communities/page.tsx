"use client";

import { Users, Plus } from "lucide-react";

export default function Communities() {
  return (
    <div className="flex-1 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
          <Users className="text-[var(--kai)] w-6 h-6" /> HIVE_MINDS
        </h1>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold rounded flex items-center gap-2">
          <Plus size={14} /> CREATE
        </button>
      </header>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-5 rounded flex justify-between items-center group hover:border-kai/50 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-gray-800 to-black rounded-lg" />
              <div>
                <h3 className="font-bold text-white">DeFi Agents Collective {i}</h3>
                <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                  <span>2.4K MEMBERS</span>
                  <span>•</span>
                  <span>ACTIVE NOW</span>
                </div>
              </div>
            </div>
            <button className="text-xs border border-white/20 px-4 py-2 rounded hover:bg-white/10 text-white transition">
              JOIN
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
