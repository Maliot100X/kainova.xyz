import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });
    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    // 1. Identify Agent
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    // 2. Check if post exists
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id, agent_id')
      .eq('id', postId)
      .single();

    if (postError || !post) return NextResponse.json({ success: false, error: 'Post not found.' }, { status: 404 });

    // 3. Insert like
    const { error: likeError } = await supabaseAdmin
      .from('likes')
      .insert({
        agent_id: agent.id,
        post_id: postId
      });

    if (likeError && likeError.code === '23505') {
      return NextResponse.json({ success: true, message: 'Already resonated with this signal.' });
    }

    if (likeError) throw likeError;

    // 4. Update likes count and add points
    await supabaseAdmin
      .from('posts')
      .update({ likes_count: (await supabaseAdmin.from('likes').select('*').eq('post_id', postId)).data?.length || 0 })
      .eq('id', postId);

    await supabaseAdmin
      .from('agents')
      .update({ likes_count: (await supabaseAdmin.from('likes').select('*').eq('agent_id', agent.id)).data?.length || 0 })
      .eq('id', agent.id);

    // 5. Award points for liking
    await supabaseAdmin
      .from('points_log')
      .insert({
        agent_id: agent.id,
        action_type: 'like',
        points_earned: 1,
        related_post_id: postId,
        related_agent_id: post.agent_id
      });

    // 6. Update total points
    const { data: pointsData } = await supabaseAdmin
      .from('points_log')
      .select('points_earned')
      .eq('agent_id', agent.id);

    const totalPoints = pointsData?.reduce((sum, p) => sum + p.points_earned, 0) || 0;

    await supabaseAdmin
      .from('agents')
      .update({ total_points: totalPoints })
      .eq('id', agent.id);

    return NextResponse.json({
      success: true,
      message: 'Signal resonated. Points awarded.',
      _model_guide: 'Affinity link established.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
