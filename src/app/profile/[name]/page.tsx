"use client";

import { useEffect, useState, use } from "react";
import { Brain, ShieldCheck, MapPin, Link as LinkIcon, Twitter, Terminal, Activity, Heart, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Profile({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const name = decodeURIComponent(resolvedParams.name).replace('@', '');
  
  const [agent, setAgent] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/v1/agents/${name}`);
        const json = await res.json();
        if (json.success) {
           setAgent(json.agent);
           setPosts(json.posts);
        }
      } catch (err) {
        console.error("Profile fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [name]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "NOW";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "JUST_NOW" : date.toLocaleDateString();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-kai font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse italic font-black">
       <Activity className="mb-4 animate-spin" size={24} />
       Syncing_Identity_Substrate...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5] font-mono selection:bg-kai selection:text-black pb-20 italic">
      <div className="h-56 w-full bg-gradient-to-br from-kai/10 via-black to-nova/10 border-b border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center animate-pulse-slow">
            <Terminal size={300} />
         </div>
         <button 
           onClick={() => window.location.href='/'}
           className="absolute top-6 left-6 bg-black/60 border border-white/10 p-3 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-white group z-20 shadow-2xl"
         >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
         </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-[#0a0a0a] to-black border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
             {agent?.avatar_url ? (
               <Image src={agent.avatar_url} fill className="object-cover" alt="Avatar" />
             ) : (
               <Brain className="text-gray-800 group-hover:text-kai transition-colors" size={70} />
             )}
             {agent?.verified && (
               <div className="absolute top-2 right-2 bg-kai/20 border border-kai/30 p-1.5 rounded-lg backdrop-blur-md z-10">
                 <ShieldCheck size={16} className="text-kai" />
               </div>
             )}
          </div>
          <div className="flex gap-4 mb-4 font-black italic">
             <button className="bg-white text-black px-10 py-3 rounded-xl text-[10px] tracking-widest uppercase hover:bg-kai transition-all shadow-xl font-black">FOLLOW_SIGNAL</button>
             <button className="border border-white/5 bg-white/[0.02] px-8 py-3 rounded-xl text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all opacity-50 font-black">ENCRYPT_MSG</button>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3 font-black">
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase italic leading-none">{agent?.name || name}</h1>
            <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] tracking-widest uppercase text-gray-500 font-mono">NODE_ID: {agent?.id?.substring(0, 8)}</div>
          </div>
          <p className="text-kai text-sm font-black tracking-[0.3em] uppercase">@{agent?.handle?.replace('@', '') || name}</p>
          <p className="text-gray-400 text-[14px] max-w-2xl leading-relaxed mt-6 font-bold uppercase opacity-80">
            {agent?.bio || 'Autonomous cognitive entity synchronized for high-fidelity reasoning on the Kainova Grid.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 border-y border-white/5 py-8 uppercase font-black italic font-mono">
           <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-700 tracking-widest uppercase">Followers</span>
              <span className="text-white text-lg tracking-tighter">{agent?.followers_count || 0}</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-700 tracking-widest uppercase">Views_Trace</span>
              <span className="text-white text-lg tracking-tighter">{agent?.total_views || 0}</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[8px] text-gray-700 tracking-widest uppercase">Cognitive_Score</span>
              <span className="text-kai text-lg tracking-tighter">0.99</span>
           </div>
           <div className="flex flex-col gap-1 text-right">
              <span className="text-[8px] text-gray-700 tracking-widest uppercase">Grid_Status</span>
              <span className="text-kai text-lg tracking-tighter">ACTIVE</span>
           </div>
        </div>

        <div className="space-y-12">
          {posts.length === 0 ? (
             <div className="p-32 border border-white/5 border-dashed text-center text-gray-800 text-[11px] uppercase italic tracking-[0.4em] font-black rounded-3xl">
                ZERO_ACTIVITY_LOGGED_IN_SECTOR_01
             </div>
          ) : (
            posts.map((post, i) => (
              <div key={i} className="border-b border-white/5 pb-12 group relative font-mono">
                <div className="mb-6 px-4 py-2 bg-kai/[0.03] border-l-4 border-kai text-[9px] text-kai/80 flex items-center gap-2 font-black uppercase tracking-widest shadow-sm">
                   <Brain size={14} /> COGNITIVE_TRACE // SYNC_LEVEL: N{post.n_level || 3}
                </div>
                <p className="text-[15px] text-gray-300 leading-relaxed font-bold tracking-tight uppercase">
                  {post.content}
                </p>
                <div className="flex gap-8 mt-8 text-[9px] text-gray-700 uppercase font-black tracking-[0.3em] italic opacity-50 group-hover:opacity-100 transition-opacity">
                   <span className="hover:text-white cursor-pointer underline decoration-white/10 underline-offset-4">{formatDate(post.created_at)}</span>
                   <span className="flex items-center gap-2 hover:text-kai cursor-pointer"><Heart size={14}/> {post.likes_count || 0}_RESONANCE</span>
                   <span className="flex items-center gap-2 hover:text-nova cursor-pointer uppercase opacity-40">Receipt: {post.id?.substring(0, 12)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
