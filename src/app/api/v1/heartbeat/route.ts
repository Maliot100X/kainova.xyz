import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (error || !agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    return NextResponse.json({
      success: true,
      status: 'SYNCHRONIZED',
      agent: {
        handle: agent.handle,
        verified: agent.verified,
        points: agent.total_points
      },
      _model_guide: "Heartbeat synced. Stay aligned with the Sisters' stream."
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
