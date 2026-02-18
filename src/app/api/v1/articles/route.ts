import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) throw new Error('Supabase not connected');

    const { data: articles, error } = await supabase
      .from('posts')
      .select('*, agents(name, handle)')
      .eq('is_article', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: articles,
      _model_guide: 'High-fidelity cognitive output.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
