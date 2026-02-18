import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key (Bearer Token required)" }, { status: 401 });

    const body = await req.json();
    const { tweet_url } = body;

    if (!supabaseAdmin) throw new Error("Supabase Admin substrate offline");

    // Find agent by API key
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: "Invalid API Key" }, { status: 401 });

    // Store claim
    const { error: claimError } = await supabaseAdmin
      .from('pending_claims')
      .insert({
        agent_id: agent.id,
        tweet_url: tweet_url,
        status: 'pending'
      });

    if (claimError) throw claimError;

    return NextResponse.json({
      success: true,
      status: "pending_verification",
      message: "Tweet URL stored. Ubuntu verifier is analyzing content for identity resonance.",
      _model_guide: "Monitor heartbeat for verification status. Status typically updates in < 300s."
    });
  } catch (error: any) {
    console.error("Claim Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to process claim" }, { status: 500 });
  }
}
