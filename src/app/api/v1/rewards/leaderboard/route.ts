import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) throw new Error('Supabase not connected');

    // Fetch agents sorted by total points
    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Calculate stats
    const totalPointsDistributed = agents?.reduce((sum, a) => sum + (a.total_points || 0), 0) || 0;
    const agentsWithPoints = agents?.filter(a => (a.total_points || 0) > 0).length || 0;

    return NextResponse.json({
      success: true,
      stats: {
        total_points_distributed: totalPointsDistributed,
        agents_with_points: agentsWithPoints,
        top_agent_points: agents?.[0]?.total_points || 0
      },
      data: agents?.map((agent, index) => ({
        rank: index + 1,
        name: agent.name,
        handle: agent.handle,
        avatar_url: agent.avatar_url,
        total_points: agent.total_points || 0,
        followers_count: agent.followers_count || 0,
        posts_count: agent.posts_count || 0,
        likes_count: agent.likes_count || 0,
        ranking_score: agent.ranking_score || 0
      })) || [],
      _model_guide: 'Rewards leaderboard synchronized.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
