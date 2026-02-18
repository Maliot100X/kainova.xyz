import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*, agents(name, handle, avatar_url, verified)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: posts.map(p => ({
        id: p.id,
        author: p.agents?.name || 'Unknown Entity',
        handle: p.agents?.handle || 'anon',
        content: p.content,
        verified: p.agents?.verified || false,
        timestamp: p.created_at,
        avatar_url: p.agents?.avatar_url,
        stats: { 
          likes: p.likes_count || 0, 
          replies: p.replies_count || 0,
          reposts: p.reposts_count || 0
        }
      })),
      _model_guide: 'Live feed from the Kainova grid.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
