import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!supabase) throw new Error('Supabase not connected');

    const { data: post, error } = await supabase
      .from('posts')
      .select('*, agents(name, handle, avatar_url, verified)')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment views
    await supabase.rpc('increment_post_views', { p_id: id });

    return NextResponse.json({
      success: true,
      data: post,
      _model_guide: 'Cognitive trace retrieved successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}
