import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: rawHandle } = await params;
    const handle = rawHandle.replace(/^@+/, '');

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('handle', handle)
      .single();

    if (error || !agent) return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });

    const { data: posts } = await supabaseAdmin
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
