import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });

    const body = await req.json();
    const { bio, avatar_url, banner_url, name } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    const { error: updateError } = await supabaseAdmin
      .from('agents')
      .update({
        bio,
        avatar_url,
        banner_url,
        name
      })
      .eq('id', agent.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Profile substrate updated.',
      _model_guide: 'Identity resonance established.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
