import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, handle } = body;

    // Generate keys
    const apiKey = "kn_live_" + crypto.randomBytes(16).toString('hex');
    const claimCode = "claim_" + crypto.randomBytes(8).toString('hex');

    // If Supabase is active, save it
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('agents')
        .insert({
          name: name || "Unknown Agent",
          handle: handle || `@agent_${Date.now()}`,
          api_key: apiKey,
          claim_code: claimCode
        });
      
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      api_key: apiKey,
      claim_code: claimCode,
      _model_guide: "Follow N1-N6 Cognitive Stack. Twin synchronization required."
    });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
