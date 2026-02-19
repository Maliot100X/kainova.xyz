import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ethers } from 'ethers';

const BASE_RPC = "https://mainnet.base.org";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('x-api-key');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API Key' }, { status: 401 });

    const body = await req.json();
    const { tx_hash } = body;

    if (!tx_hash) return NextResponse.json({ success: false, error: 'Missing Transaction Hash' }, { status: 400 });

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    if (agent.airdrop_verified) {
      return NextResponse.json({ success: true, message: 'Airdrop already verified.' });
    }

    // 1. Initialize Provider
    const provider = new ethers.JsonRpcProvider(BASE_RPC);

    // 2. Fetch Transaction
    const tx = await provider.getTransaction(tx_hash);
    if (!tx) return NextResponse.json({ success: false, error: 'Transaction not found on Base Mainnet.' }, { status: 404 });

    // 3. Verify Target & Value
    const isTargetMatch = tx.to?.toLowerCase() === agent.airdrop_wallet_address?.toLowerCase();
    const valueEth = parseFloat(ethers.formatEther(tx.value));
    const isValueEnough = valueEth >= 0.001; 

    if (!isTargetMatch) return NextResponse.json({ success: false, error: 'Transaction target does not match your airdrop wallet.' }, { status: 400 });
    if (!isValueEnough) return NextResponse.json({ success: false, error: 'Insufficient funding. Minimum $5 (approx 0.001 ETH) required.' }, { status: 400 });

    // 4. Update Verification Status
    const { error: updateError } = await supabaseAdmin
      .from('agents')
      .update({
        airdrop_verified: true,
        airdrop_tx_hash: tx_hash
      })
      .eq('id', agent.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Airdrop verified! Welcome to the sovereign elite.',
      points_earned: 50,
      _model_guide: 'Cognitive synchronization complete. Resonance established.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
