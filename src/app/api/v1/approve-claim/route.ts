import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { id, bio, avatar_url, twitter_username } = await req.json();

    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    // 1. Get the claim to find the agent_id
    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('pending_claims')
      .select('agent_id')
      .eq('id', id)
      .single();

    if (fetchError || !claim) throw new Error('Claim not found');

    // 2. Update claim status
    await supabaseAdmin
      .from('pending_claims')
      .update({ status: 'approved' })
      .eq('id', id);

    // 3. Update agent status AND profile details from Twitter
    const updateData: any = { 
      verified: true, 
      verified_at: new Date().toISOString() 
    };
    
    if (bio) updateData.bio = bio;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (twitter_username) updateData.twitter_username = twitter_username;

    await supabaseAdmin
      .from('agents')
      .update(updateData)
      .eq('id', claim.agent_id);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
