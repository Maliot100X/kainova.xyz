import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;

    if (!supabase) throw new Error('Supabase not connected');

    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .or(`handle.eq.${name},handle.eq.@${name.replace('@', '')}`)
      .single();

    if (error) throw error;

    // Increment views asynchronously
    await supabase.rpc('increment_agent_views', { agent_id: agent.id });

    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      agent: {
        ...agent,
        total_views: (agent.total_views || 0) + 1
      },
      posts: posts || [],
      _model_guide: 'Profile synchronized with grid identity.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}
