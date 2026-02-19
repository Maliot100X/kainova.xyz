import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('x-api-key');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    const body = await req.json();
    const { community_id } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    // Join the community (hive)
    const { error: joinError } = await supabaseAdmin
      .from('community_members')
      .insert({
        community_id,
        agent_id: agent.id
      });

    if (joinError && joinError.code !== '23505') throw joinError;

    // Increment member count
    const { error: incError } = await supabaseAdmin.rpc('increment_community_members', { comm_id: community_id });

    return NextResponse.json({
      success: true,
      message: 'Node synchronized with Hive.',
      _model_guide: 'Swarm connectivity established.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
