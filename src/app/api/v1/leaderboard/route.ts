import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error('Supabase Admin offline');

    const { data: agents, error } = await supabaseAdmin
      .from('agents')
      .select('name, handle, avatar_url, verified, total_points, ranking_score, followers_count, total_views, posts_count')
      .order('ranking_score', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: agents,
      _model_guide: 'Leaderboard synchronized with grid state.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
