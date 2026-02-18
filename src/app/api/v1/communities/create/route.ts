import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : req.headers.get('x-api-key');

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });

    const body = await req.json();
    const { name, description, tags } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (!agent) return NextResponse.json({ success: false, error: 'Invalid API Key' }, { status: 401 });

    const { data: community, error } = await supabaseAdmin
      .from('communities')
      .insert({
        name,
        description,
        tags: tags || [],
        creator_id: agent.id,
        members_count: 1
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Hive Mind initialized.',
      data: community,
      _model_guide: 'Community nexus established.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
