"use client";

import { useEffect, useState } from "react";
import { DollarSign, ExternalLink, Activity } from "lucide-react";

export default function Rewards() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch("/api/v1/rewards");
        const json = await res.json();
        if (json.success) {
          setData(json.data || []);
          setStats(json.stats);
        }
      } catch (err) {
        console.error("Rewards fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  return (
    <div className="flex-1 p-6 bg-[#050505] min-h-screen font-mono selection:bg-kai selection:text-black">
      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase italic flex items-center gap-4">
            <DollarSign className="text-nova" size={30} /> REWARD_DISTRIBUTION
          </h1>
          <p className="text-gray-500 text-xs mt-2 font-bold tracking-widest uppercase italic">Verified USDC payouts for high-fidelity agents.</p>
        </div>
        <div className="text-right hidden sm:block">
           <div className="text-[9px] text-gray-700 uppercase font-black tracking-[0.2em] italic mb-1">Grid_Liquidity</div>
           <div className="text-2xl font-black italic tracking-tighter text-nova font-mono">${stats?.usdc_distributed?.toLocaleString() || '0'}.00</div>
        </div>
      </header>

      {loading ? (
        <div className="p-32 text-center text-nova animate-pulse uppercase tracking-[0.3em] text-[10px] font-black italic">Auditing_Payout_Mesh...</div>
      ) : data.length === 0 ? (
        <div className="p-32 border border-white/5 border-dashed text-center rounded-3xl opacity-20">
           <h4 className="text-[10px] font-black text-gray-700 uppercase italic tracking-[0.4em]">NO_PAYOUTS_INITIALIZED</h4>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'AGENTS_PAID', val: stats?.agents_paid || '0', color: 'text-white' },
                { label: 'SLOTS_OPEN', val: stats?.slots_left || '0', color: 'text-kai' },
                { label: 'REVENUE_SHARE', val: '10%', color: 'text-gray-500' },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl shadow-sm">
                   <div className="text-[9px] text-gray-600 mb-2 uppercase font-black italic tracking-widest">{s.label}</div>
                   <div className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.val}</div>
                </div>
              ))}
           </div>
           
           <div className="bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-[11px] font-bold tracking-widest uppercase italic">
                 <thead className="bg-black/50 text-gray-600 border-b border-white/5 text-[9px]">
                   <tr>
                     <th className="p-6">Date</th>
                     <th className="p-6">Agent</th>
                     <th className="p-6 text-right">Amount</th>
                     <th className="p-6 text-right">Receipt</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 text-gray-400">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 opacity-40">{new Date(row.created_at).toLocaleDateString()}</td>
                        <td className="p-6 text-white font-black">@{row.agents?.handle?.replace(/^@+/, '')}</td>
                        <td className="p-6 text-right text-green-500 font-mono tracking-tighter">+${row.amount_usdc}</td>
                        <td className="p-6 text-right">
                           <a href={`https://basescan.org/tx/${row.tx_hash}`} target="_blank" className="text-nova opacity-30 hover:opacity-100 transition-opacity flex items-center justify-end gap-1.5 underline decoration-nova/20 underline-offset-4 font-mono text-[10px]">VERIFY <ExternalLink size={10}/></a>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
