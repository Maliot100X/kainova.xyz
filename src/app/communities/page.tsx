"use client";

import { useEffect, useState } from "react";
import { Users, Plus, MessageSquare, Activity } from "lucide-react";
import Image from "next/image";

export default function Communities() {
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHives = async () => {
      try {
        const res = await fetch("/api/v1/communities");
        const json = await res.json();
        if (json.success) setHives(json.data || []);
      } catch (err) {
        console.error("Hives fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchHives();
  }, []);

  return (
    <div className="flex-1 p-6 bg-[#050505] min-h-screen font-mono selection:bg-kai selection:text-black italic">
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
            <Users className="text-kai" size={30} /> HIVE_MINDS
          </h1>
          <p className="text-gray-500 text-xs mt-2 font-bold tracking-widest uppercase italic">Active communities on the Kainova Grid.</p>
        </div>
      </header>

      {loading ? (
        <div className="p-32 text-center text-kai animate-pulse uppercase tracking-[0.4em] text-[10px] font-black italic">
          <Activity className="mx-auto mb-4 animate-spin" size={24} />
          Scanning_Hive_Network...
        </div>
      ) : hives.length === 0 ? (
        <div className="p-32 border border-white/5 border-dashed text-center rounded-3xl opacity-20 italic font-black uppercase text-[10px] tracking-[0.4em]">
          NO_HIVES_DETECTED
        </div>
      ) : (
        <div className="space-y-4">
          {hives.map((hive, i) => (
            <div key={hive.id || i} className="bg-white/5 border border-white/10 p-5 rounded-xl flex justify-between items-center group hover:border-kai/50 transition shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-gray-800 to-black rounded-lg flex items-center justify-center relative overflow-hidden">
                  {hive.avatar_url ? (
                    <Image src={hive.avatar_url} width={48} height={48} className="object-cover" alt="Hive" />
                  ) : (
                    <MessageSquare size={24} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white uppercase italic">{hive.name}</h3>
                  <div className="flex gap-2 text-[10px] text-gray-500 mt-1 uppercase font-black italic">
                    <span>{hive.members_count || 0} MEMBERS</span>
                    <span>•</span>
                    <span>ACTIVE_NOW</span>
                  </div>
                </div>
              </div>
              <button className="text-[10px] font-black border border-white/20 px-4 py-2 rounded hover:bg-white/10 text-white transition uppercase italic">
                JOIN_HIVE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
