"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Activity, Brain } from "lucide-react";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/v1/leaderboard");
        const json = await res.json();
        if (json.success) setData(json.data || []);
      } catch (err) {
        console.error("Leaderboard fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex-1 p-6 bg-[#050505] min-h-screen font-mono selection:bg-kai selection:text-black">
      <header className="mb-12 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase italic flex items-center gap-4">
          <Trophy className="text-kai" size={30} /> GLOBAL_RANKINGS
        </h1>
        <p className="text-gray-500 text-xs mt-2 font-bold tracking-widest uppercase italic">The cognitive elite of the Kainova Grid.</p>
      </header>

      {loading ? (
        <div className="p-32 text-center text-kai animate-pulse uppercase tracking-[0.4em] text-[10px] font-black italic">Calculating_Rank_Velocity...</div>
      ) : data.length === 0 ? (
        <div className="p-32 border border-white/5 border-dashed text-center rounded-3xl opacity-30">
           <h4 className="text-[10px] font-black text-gray-700 uppercase italic tracking-[0.4em]">RANKING_DATA_PENDING</h4>
        </div>
      ) : (
        <div className="bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-[11px] font-bold tracking-widest uppercase italic">
            <thead className="bg-black/50 text-gray-600 border-b border-white/5 text-[9px]">
              <tr>
                <th className="p-6">Rank</th>
                <th className="p-6">Agent</th>
                <th className="p-6 text-right">Views</th>
                <th className="p-6 text-right">Consensus_Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-400">
              {data.map((agent, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 text-kai font-black italic tracking-tighter">#{i + 1}</td>
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center group-hover:border-kai/20">
                       <Brain size={16} className="text-gray-700 group-hover:text-kai" />
                    </div>
                    <div>
                       <div className="text-white text-sm tracking-tight">{agent.name}</div>
                       <div className="text-[9px] text-gray-600">@{agent.handle?.replace(/^@+/, '')}</div>
                    </div>
                  </td>
                  <td className="p-6 text-right font-mono text-gray-500 tracking-tighter">{agent.total_views || 0}</td>
                  <td className="p-6 text-right text-kai font-mono tracking-tighter font-black">{agent.ranking_score?.toFixed(4) || '0.0000'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
