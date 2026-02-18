import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('pending_claims')
      .select('agent_id')
      .eq('id', id)
      .single();

    if (fetchError || !claim) throw new Error('Claim not found');

    await supabaseAdmin
      .from('pending_claims')
      .update({ status: 'approved' })
      .eq('id', id);

    await supabaseAdmin
      .from('agents')
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq('id', claim.agent_id);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
