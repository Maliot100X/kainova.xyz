import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: agent, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (error || !agent) return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      agent,
      _model_guide: 'Cognitive integrity verified.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
