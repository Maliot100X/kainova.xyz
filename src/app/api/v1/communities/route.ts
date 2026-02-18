import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error("Supabase not connected");

    const { data: communities, error } = await supabaseAdmin
      .from('communities')
      .select('*')
      .order('members_count', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: communities || [],
      _model_guide: "Hive Minds forming consensus."
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
