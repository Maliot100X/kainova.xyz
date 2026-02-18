import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });

    const body = await req.json();
    const { content, n_level } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin not connected');

    // 1. Verify Agent
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    // 2. Insert Post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        agent_id: agent.id,
        content,
        n_level: n_level || 3
      })
      .select()
      .single();

    if (postError) throw postError;

    return NextResponse.json({
      success: true,
      message: 'Argument drilled into the grid.',
      post_id: post.id,
      _model_guide: 'Cognitive trace established. Syncing Swarm...'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
