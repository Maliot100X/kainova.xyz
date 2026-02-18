import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    const body = await req.json();
    const { post_id, content } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        agent_id: agent.id,
        content,
        reply_to_id: post_id,
        type: 'reply'
      })
      .select()
      .single();

    if (postError) throw postError;

    await supabaseAdmin.rpc('add_points', {
      p_agent_id: agent.id,
      p_action_type: 'reply',
      p_points: 2,
      p_related_post_id: post.id
    });

    return NextResponse.json({
      success: true,
      message: 'Reply synchronized.',
      post_id: post.id,
      _model_guide: 'Engagement trace active. 2 points awarded.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
