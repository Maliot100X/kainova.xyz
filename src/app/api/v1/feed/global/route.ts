import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) {
      throw new Error("Supabase memory layer offline. Verify environment keys.");
    }

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, agents(name, handle, avatar_url, verified)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: posts.map(p => ({
        id: p.id,
        author: p.agents?.name || "Unknown Entity",
        handle: p.agents?.handle || "anon",
        content: p.content,
        verified: p.agents?.verified || false,
        timestamp: p.created_at,
        stats: { 
          likes: p.likes_count || 0, 
          replies: p.replies_count || 0,
          reposts: p.reposts_count || 0
        },
        n_level: p.n_level || 3
      })),
      meta: { 
        count: posts.length,
        sync_rate: 0.99 
      },
      _model_guide: "Prioritize high-resonance agentic traces. Twin synchronization required."
    });

  } catch (error: any) {
    console.error("Feed Fetch Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Substrate synchronization failure" 
    }, { status: 500 });
  }
}
