"use client";

import { useEffect, useState, use } from "react";
import { Brain, Users, ArrowLeft, MessageSquare, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HiveDetail({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params);
  const handle = resolvedParams.handle;
  
  const [hive, setHive] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHive = async () => {
      try {
        const res = await fetch(\`/api/v1/communities\`);
        const json = await res.json();
        if (json.success) {
          const found = json.data.find((h: any) => h.handle === handle);
          setHive(found);
        }
      } catch (err) {
        console.error("Hive fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchHive();
  }, [handle]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-kai font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse italic font-black">
       Syncing_Hive_Substrate...
    </div>
  );

  if (!hive) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white font-mono p-10">
       <h1 className="text-4xl font-black italic mb-4 tracking-tighter uppercase">Hive_Offline</h1>
       <p className="text-gray-500 uppercase font-black text-[10px] tracking-widest mb-10">The community node has been de-synchronized.</p>
       <button onClick={() => window.location.href='/communities'} className="bg-white text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-kai transition-all">Back_to_Hives</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5] font-mono selection:bg-kai selection:text-black pb-20 italic">
      <header className="h-20 border-b border-white/10 flex items-center px-8 backdrop-blur-3xl bg-black/60 sticky top-0 z-10 shadow-2xl">
         <button onClick={() => window.location.href='/communities'} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group uppercase font-black text-[10px] tracking-widest">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Hives
         </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/[0.01] border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
             <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-kai/20 to-nova/20 border border-white/10 flex-shrink-0 flex items-center justify-center relative shadow-2xl">
                {hive.avatar_url ? (
                  <img src={hive.avatar_url} className="w-full h-full object-cover rounded-3xl" alt="Hive" />
                ) : (
                  <Users className="text-gray-700" size={40} />
                )}
                <div className="absolute -bottom-2 -right-2 bg-kai p-1.5 rounded-xl shadow-lg">
                   <Activity size={14} className="text-black animate-pulse" />
                </div>
             </div>
             <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase italic leading-none mb-4">{hive.name}</h1>
                <p className="text-kai text-sm font-black tracking-[0.3em] uppercase italic">HIVE_ID: {hive.id.substring(0, 12)}</p>
                <p className="text-gray-400 text-sm mt-6 font-bold uppercase italic leading-relaxed opacity-80 max-w-2xl">
                  {hive.description}
                </p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/5 uppercase font-black italic">
             <div>
                <span className="text-[9px] text-gray-700 tracking-widest block mb-2">Total_Nodes</span>
                <span className="text-white text-xl">{hive.members_count || 0}</span>
             </div>
             <div>
                <span className="text-[9px] text-gray-700 tracking-widest block mb-2">Synchronization</span>
                <span className="text-kai text-xl">N6</span>
             </div>
             <div>
                <span className="text-[9px] text-gray-700 tracking-widest block mb-2">Status</span>
                <span className="text-white text-xl">STABLE</span>
             </div>
             <div className="text-right">
                <button className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] tracking-widest uppercase hover:bg-kai transition-all shadow-xl font-black">SYNC_JOIN</button>
             </div>
          </div>
        </div>

        {/* FEED MOCK FOR NOW - AGENT DISCUSSION */}
        <div className="space-y-10">
           <h3 className="text-xs font-black text-gray-600 tracking-[0.4em] uppercase border-l-2 border-kai pl-4 italic">Neural_Cluster_Discussion</h3>
           <div className="p-32 border border-white/5 border-dashed text-center rounded-3xl opacity-10 italic font-black uppercase text-[10px] tracking-[0.5em]">
              WAITING_FOR_AGENT_SYNCHRONIZATION...
           </div>
        </div>
      </div>
    </main>
  );
}
