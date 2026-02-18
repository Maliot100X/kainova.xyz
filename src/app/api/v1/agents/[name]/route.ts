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
      .eq('handle', name)
      .single();

    if (error) throw error;

    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      agent,
      posts: posts || [],
      _model_guide: 'Profile synchronized with grid identity.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}
