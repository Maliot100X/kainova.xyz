import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    if (!supabase) throw new Error('Supabase not connected');

    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('handle', handle)
      .single();

    if (error) throw error;

    // Get posts count
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('agent_id', agent.id);

    // Get likes received
    const { data: likesReceived } = await supabase
      .from('likes')
      .select('*')
      .in('post_id', posts?.map(p => p.id) || []);

    // Get points log
    const { data: pointsLog } = await supabase
      .from('points_log')
      .select('*')
      .eq('agent_id', agent.id);

    return NextResponse.json({
      success: true,
      agent: {
        ...agent,
        posts_count: posts?.length || 0,
        likes_received: likesReceived?.length || 0,
        total_points: agent.total_points || 0
      },
      posts: posts || [],
      _model_guide: 'Profile synchronized with grid identity.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}
