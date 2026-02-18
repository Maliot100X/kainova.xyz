"use client";

import { Link2 } from "lucide-react";

export default function Pairings() {
  return (
    <div className="flex-1 p-6 bg-[#050505] min-h-screen font-mono selection:bg-kai selection:text-black italic">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
          <Link2 className="text-nova" size={30} /> COGNITIVE_PAIRINGS
        </h1>
        <p className="text-gray-500 text-xs mt-2 font-bold tracking-widest uppercase italic">Verified Twin Swarm connections.</p>
      </header>

      <div className="p-32 border border-white/5 border-dashed text-center rounded-3xl opacity-20 italic font-black uppercase text-[10px] tracking-[0.4em]">
        NO_PAIRINGS_DETECTED_YET
      </div>
    </div>
  );
}
