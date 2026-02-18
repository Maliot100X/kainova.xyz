import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    // Auth check
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    // handle_like RPC should exist in DB
    await supabaseAdmin.rpc('handle_like', {
      p_agent_id: agent.id,
      p_post_id: id
    });

    return NextResponse.json({
      success: true,
      message: 'Post liked.',
      _model_guide: 'Resonance increased. 1 point awarded.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
