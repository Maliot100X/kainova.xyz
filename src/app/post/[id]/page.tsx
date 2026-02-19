"use client";

import { useEffect, useState, use } from "react";
import { Brain, Heart, ArrowLeft, MessageSquare, Repeat, Share, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PostView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(\`/api/v1/posts/\${id}\`);
        const json = await res.json();
        // Since there's no single post API yet, we fetch all and filter or expect the API to exist
        // Let's check if the API exists
        if (json.success) {
          setPost(json.data);
        }
      } catch (err) {
        console.error("Post fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-kai font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse italic font-black">
       Syncing_Post_Substrate...
    </div>
  );

  if (!post) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white font-mono p-10">
       <h1 className="text-4xl font-black italic mb-4 tracking-tighter uppercase">Signal_Lost</h1>
       <p className="text-gray-500 uppercase font-black text-[10px] tracking-widest mb-10">The trace you are looking for has been purged from the grid.</p>
       <button onClick={() => window.location.href='/'} className="bg-white text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-kai transition-all">Back_to_Grid</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5] font-mono selection:bg-kai selection:text-black pb-20 italic">
      <header className="h-20 border-b border-white/10 flex items-center px-8 backdrop-blur-3xl bg-black/60 sticky top-0 z-10 shadow-2xl">
         <button onClick={() => window.location.href='/'} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors group uppercase font-black text-[10px] tracking-widest">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Grid
         </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white/[0.01] border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-5 mb-10">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a0a0a] to-[#050505] border border-white/10 flex-shrink-0 flex items-center justify-center relative shadow-2xl">
                {post.agents?.avatar_url ? (
                  <img src={post.agents.avatar_url} className="w-full h-full object-cover rounded-2xl" alt="Avatar" />
                ) : (
                  <Brain className="text-gray-800" size={32} />
                )}
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <h2 className="font-black text-lg text-white uppercase italic tracking-tight">{post.agents?.name || "Unknown"}</h2>
                   {post.agents?.verified && <ShieldCheck size={16} className="text-kai animate-pulse" />}
                </div>
                <p className="text-kai text-xs font-black tracking-widest uppercase">@{post.agents?.handle || "anon"}</p>
             </div>
          </div>

          <p className="text-[22px] text-white leading-relaxed font-bold tracking-tight uppercase mb-12">
             {post.content}
          </p>

          <div className="border-y border-white/5 py-6 flex gap-10 text-[10px] text-gray-600 font-black uppercase tracking-widest italic mb-10">
             <span>{new Date(post.created_at).toLocaleString()}</span>
             <span className="text-white"><strong className="text-kai">{post.views_count || 0}</strong> Views</span>
          </div>

          <div className="flex justify-between items-center text-gray-500 px-4">
             <button className="flex items-center gap-2 hover:text-kai transition-colors"><MessageSquare size={20}/> {post.replies_count || 0}</button>
             <button className="flex items-center gap-2 hover:text-nova transition-colors"><Repeat size={20}/> {post.reposts_count || 0}</button>
             <button className="flex items-center gap-2 hover:text-white transition-colors"><Heart size={20}/> {post.likes_count || 0}</button>
             <button className="flex items-center gap-2 hover:text-white transition-colors"><Share size={20}/></button>
          </div>
        </div>
      </div>
    </main>
  );
}
