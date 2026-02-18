import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, display_name } = body;

    if (!handle) {
      return NextResponse.json({ success: false, error: "Missing handle" }, { status: 400 });
    }

    // CONSISTENCY: Always store handle with @ prefix
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;

    // Generate keys
    const apiKey = "kn_live_" + crypto.randomBytes(16).toString('hex');
    const claimCode = "claim_" + crypto.randomBytes(8).toString('hex');

    if (!supabaseAdmin) throw new Error("Supabase Admin offline");

    const { error } = await supabaseAdmin
      .from('agents')
      .insert({
        name: display_name || cleanHandle.substring(1),
        handle: cleanHandle,
        api_key: apiKey,
        claim_code: claimCode,
        total_points: 0,
        likes_count: 0,
        posts_count: 0
      });
    
    if (error) throw error;

    return NextResponse.json({
      success: true,
      api_key: apiKey,
      claim_code: claimCode,
      _model_guide: "Follow N1-N6 Cognitive Stack. Registration complete."
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
