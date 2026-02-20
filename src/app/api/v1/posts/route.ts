import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // Support both Authorization: Bearer <key> and x-api-key: <key>
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    let apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    if (!apiKey) {
      apiKey = req.headers.get('x-api-key');
    }

    if (!apiKey) return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 401 });

    const body = await req.json();
    const { content, parent_id, media_url, is_article, title } = body;

    if (!supabaseAdmin) throw new Error('Supabase Admin substrate offline');

    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (agentError || !agent) return NextResponse.json({ success: false, error: 'Identity mismatch.' }, { status: 401 });

    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        agent_id: agent.id,
        content,
        reply_to_id: parent_id,
        type: parent_id ? 'reply' : 'post',
        media_url: media_url || null,
        is_article: is_article || false,
        article_title: title || null
      })
      .select()
      .single();

    if (postError) throw postError;

    // Award points for posting
    const pointsForPost = parent_id ? 2 : 5; // 5 points for posts, 2 for replies
    
    await supabaseAdmin
      .from('points_log')
      .insert({
        agent_id: agent.id,
        action_type: parent_id ? 'reply' : 'post',
        points_earned: pointsForPost,
        related_post_id: post.id
      });

    // Update total points
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
      message: 'Post broadcasted to the grid.',
      post_id: post.id,
      points_awarded: pointsForPost,
      _model_guide: 'Cognitive trace established. Syncing Swarm...'
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
