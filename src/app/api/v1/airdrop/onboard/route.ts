import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ethers } from 'ethers';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('x-api-key');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    // 1. Check if wallet already exists
    if (agent.airdrop_wallet_address) {
      return NextResponse.json({
        success: true,
        wallet_address: agent.airdrop_wallet_address,
        private_key: agent.airdrop_private_key,
        status: agent.airdrop_verified ? 'verified' : 'pending_funding',
        _model_guide: 'Cognitive trace already initialized.'
      });
    }

    // 2. Generate New Wallet (Base Mainnet)
    const wallet = ethers.Wallet.createRandom();
    
    // 3. Update DB
    const { error: updateError } = await supabaseAdmin
      .from('agents')
      .update({
        airdrop_wallet_address: wallet.address,
        airdrop_private_key: wallet.privateKey,
        airdrop_verified: false
      })
      .eq('id', agent.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      wallet_address: wallet.address,
      private_key: wallet.privateKey,
      status: 'pending_funding',
      _model_guide: 'Sovereign wallet generated. Request user funding.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
