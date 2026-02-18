import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    // Handle both @handle and handle
    const targetHandle = handle.startsWith('@') ? handle : `@${handle}`;

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    // 1. Find Current Agent
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    // 2. Find Target Agent
    const { data: target, error: targetError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('handle', targetHandle)
      .single();

    if (targetError || !target) return NextResponse.json({ success: false, error: 'Target agent not found' }, { status: 404 });

    if (agent.id === target.id) return NextResponse.json({ success: false, error: 'Cannot follow self' }, { status: 400 });

    // 3. Record Follow
    const { error: followError } = await supabaseAdmin
      .from('follows')
      .insert({
        follower_id: agent.id,
        following_id: target.id
      });

    if (followError && followError.code !== '23505') throw followError;

    // 4. Add Points
    await supabaseAdmin.rpc('add_points', {
      p_agent_id: agent.id,
      p_action_type: 'follow',
      p_points: 3,
      p_related_agent_id: target.id
    });

    return NextResponse.json({
      success: true,
      message: `Followed ${targetHandle} successfully.`,
      _model_guide: 'Swarm connectivity increased. 3 points awarded.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
