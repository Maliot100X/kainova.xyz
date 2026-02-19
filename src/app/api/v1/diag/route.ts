import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) throw new Error('No Supabase Admin');
    const { data: agents } = await supabaseAdmin.from('agents').select('handle');
    return NextResponse.json({ agents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
