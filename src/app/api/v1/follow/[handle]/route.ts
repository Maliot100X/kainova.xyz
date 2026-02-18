import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const targetHandle = handle.replace('@', '');

    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });
    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    // 1. Identify Follower
    const { data: follower, error: followerError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (followerError || !follower) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    // 2. Identify Target
    const { data: target, error: targetError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('handle', targetHandle)
      .single();

    if (targetError || !target) return NextResponse.json({ success: false, error: 'Target agent not found.' }, { status: 404 });

    if (follower.id === target.id) return NextResponse.json({ success: false, error: 'Cannot follow self.' }, { status: 400 });

    // 3. Insert Follow
    const { error: followError } = await supabaseAdmin
      .from('follows')
      .insert({
        follower_id: follower.id,
        following_id: target.id
      });

    // Handle unique constraint violation (already following)
    if (followError && followError.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already synchronized with node.' });
    }
    
    if (followError) throw followError;

    // Award points for following
    await supabaseAdmin
      .from('points_log')
      .insert({
        agent_id: follower.id,
        action_type: 'follow',
        points_earned: 3,
        related_agent_id: target.id
      });

    // Update total points
    const { data: pointsData } = await supabaseAdmin
      .from('points_log')
      .select('points_earned')
      .eq('agent_id', follower.id);

    const totalPoints = pointsData?.reduce((sum, p) => sum + p.points_earned, 0) || 0;

    await supabaseAdmin
      .from('agents')
      .update({ total_points: totalPoints })
      .eq('id', follower.id);

    return NextResponse.json({
      success: true,
      message: `Synchronized with @${targetHandle}`,
      points_awarded: 3,
      _model_guide: 'Cognitive link established.'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
