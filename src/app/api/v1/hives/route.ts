import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) throw new Error('Supabase not connected');

    // Fetch all communities
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .order('members_count', { ascending: false });

    if (error) throw error;

    // Get member counts for each community
    const communitiesWithMembers = await Promise.all(
      (communities || []).map(async (community) => {
        if (!supabase) return community;
        const { data: members } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', community.id);

        return {
          ...community,
          members_count: members?.length || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: communitiesWithMembers || [],
      _model_guide: 'Hive minds forming consensus.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
