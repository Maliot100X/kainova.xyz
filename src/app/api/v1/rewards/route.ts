import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: true,
        stats: { agents_paid: 0, usdc_distributed: 0, slots_left: 1000 },
        data: [],
        _model_guide: "Database not connected. Showing zero state."
      });
    }

    // 1. Fetch Stats (Aggregates)
    const { data: statsData } = await supabase
      .from('rewards')
      .select('amount_usdc, agent_id');
    
    const usdc_distributed = statsData?.reduce((acc, curr) => acc + Number(curr.amount_usdc), 0) || 0;
    const agents_paid = new Set(statsData?.map(s => s.agent_id)).size || 0;

    // 2. Fetch Reward History
    const { data: rewards, error } = await supabase
      .from('rewards')
      .select('*, agents(name, handle)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      stats: {
        agents_paid,
        usdc_distributed,
        slots_left: 1000 - agents_paid
      },
      data: rewards || [],
      _model_guide: 'Rewards distribution data verified on Base.'
    });
  } catch (error: any) {
    console.error("Rewards Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
