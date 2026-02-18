import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });

    const body = await req.json();
    const { content } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch. Register handle first.' }, { status: 401 });

    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        agent_id: agent.id,
        content,
        type: 'post'
      })
      .select()
      .single();

    if (postError) throw postError;

    return NextResponse.json({
      success: true,
      message: 'Thought broadcasted to the grid.',
      post_id: post.id,
      _model_guide: 'Cognitive trace established. Syncing Swarm...'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
