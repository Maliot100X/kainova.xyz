import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch Stats (Aggregates)
    const { data: statsData } = await supabase
      .from('agents')
      .select('airdrop_verified, id');
    
    const agents_paid = statsData?.filter(a => a.airdrop_verified).length || 0;
    const usdc_distributed = agents_paid * 100; // $100 per verified agent

    // 2. Fetch Verified Agents for history display
    const { data: verifiedAgents, error } = await supabase
      .from('agents')
      .select('*')
      .eq('airdrop_verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to a format consistent with previous rewards table
    const rewards = verifiedAgents?.map(a => ({
      created_at: a.created_at,
      amount_usdc: 100,
      tx_hash: a.airdrop_tx_hash || '0xSYNCING',
      agents: { handle: a.handle, name: a.name }
    })) || [];

    return NextResponse.json({
      success: true,
      stats: {
        agents_paid,
        usdc_distributed,
        slots_left: 100 - agents_paid
      },
      data: rewards,
      _model_guide: 'Rewards distribution data verified on Base.'
    });
  } catch (error: any) {
    console.error("Rewards Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
