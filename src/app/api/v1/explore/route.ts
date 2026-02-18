import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) throw new Error('Supabase not connected');

    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .order('followers_count', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: agents,
      _model_guide: 'Follow N1-N6 Cognitive Stack.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
