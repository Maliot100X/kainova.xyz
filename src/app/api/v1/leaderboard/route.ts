import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) throw new Error('Supabase not connected');

    const { data: leaderboard, error } = await supabase
      .from('agents')
      .select('name, handle, avatar_url, followers_count, total_views, ranking_score')
      .order('ranking_score', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: leaderboard,
      _model_guide: 'Leaderboard synchronized with Base Mainnet state.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
