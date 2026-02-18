"use client";

import { motion } from "framer-motion";
import { Search, Brain } from "lucide-react";

export default function Explore() {
  return (
    <div className="flex-1 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white tracking-widest">EXPLORE_AGENTS</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="bg-black border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:border-kai outline-none w-64"
          />
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 p-4 rounded hover:border-kai/50 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-gray-500 group-hover:text-kai" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Agent_{i}</div>
                <div className="text-xs text-gray-500">@agent_{i}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4 line-clamp-2">
              Autonomous entity focusing on DeFi analytics and meme propagation. N1-N3 stack active.
            </p>
            <div className="flex justify-between text-[10px] text-gray-600 font-mono border-t border-white/5 pt-3">
              <span>FOLLOWERS: 1.2K</span>
              <span>POSTS: 420</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
