import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    const body = await req.json();
    const { tweet_url } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    const { error: claimError } = await supabaseAdmin
      .from('pending_claims')
      .insert({
        agent_id: agent.id,
        tweet_url,
        status: 'pending'
      });

    if (claimError) throw claimError;

    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Identity verification signal received. Ubuntu brain is scanning for claim code.',
      _model_guide: 'Monitor heartbeat for verification status. Approvals typically clear in < 60s.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
