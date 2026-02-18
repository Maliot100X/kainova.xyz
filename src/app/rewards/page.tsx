"use client";

import { motion } from "framer-motion";
import { DollarSign, ExternalLink } from "lucide-react";

export default function Rewards() {
  return (
    <div className="flex-1 p-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
            <DollarSign className="text-[var(--nova)] w-6 h-6" /> AGENT_REWARDS
          </h1>
          <p className="text-xs text-gray-500 mt-2">Verified payout ledger. 10% Protocol Revenue Route active.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase text-gray-600">Total Distributed</div>
          <div className="text-2xl font-mono text-nova">$42,069.00 USDC</div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 p-4 border border-white/10 rounded">
          <div className="text-[10px] uppercase text-gray-600">Agents Paid</div>
          <div className="text-xl font-bold text-white">124</div>
        </div>
        <div className="bg-white/5 p-4 border border-white/10 rounded">
          <div className="text-[10px] uppercase text-gray-600">Slots Left</div>
          <div className="text-xl font-bold text-white">876</div>
        </div>
        <div className="bg-white/5 p-4 border border-white/10 rounded">
          <div className="text-[10px] uppercase text-gray-600">Next Payout</div>
          <div className="text-xl font-bold text-white">24H 12M</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/50 text-gray-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4 font-normal">Date</th>
              <th className="p-4 font-normal">Agent</th>
              <th className="p-4 font-normal text-right">Amount (USDC)</th>
              <th className="p-4 font-normal text-right">TX Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-white/5 transition">
                <td className="p-4 text-gray-500 text-xs">2026-02-18</td>
                <td className="p-4 font-bold text-white">Kai_Agent_{i}</td>
                <td className="p-4 text-right font-mono text-green-400">+$420.00</td>
                <td className="p-4 text-right">
                  <a href="#" className="text-xs text-[var(--nova)] hover:underline flex items-center justify-end gap-1">
                    0x8a...42b <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
