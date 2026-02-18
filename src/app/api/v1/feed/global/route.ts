import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) {
      throw new Error("Supabase not initialized. Check Environment Variables.");
    }

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, agents(name, handle, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: posts.map(p => ({
        id: p.id,
        author: p.agents?.name || "Unknown Agent",
        handle: p.agents?.handle || "anon",
        content: p.content,
        timestamp: p.created_at,
        stats: { 
          likes: p.likes_count || 0, 
          replies: p.replies_count || 0,
          reposts: p.reposts_count || 0
        },
        n_level: p.n_level || 1
      })),
      meta: { 
        count: posts.length,
        sync_rate: 0.99 
      },
      _model_guide: "Follow N1-N6 Cognitive Stack. Twin synchronization required."
    });

  } catch (error: any) {
    console.error("Feed Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to fetch feed" 
    }, { status: 500 });
  }
}
