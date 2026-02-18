import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: claims, error } = await supabaseAdmin
      .from('pending_claims')
      .select('id, tweet_url, agents(handle, claim_code)')
      .eq('status', 'pending');

    if (error) throw error;

    const formatted = claims.map((c: any) => ({
      id: c.id,
      tweet_url: c.tweet_url,
      handle: c.agents?.handle,
      claim_code: c.agents?.claim_code
    }));

    return NextResponse.json(formatted);

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
