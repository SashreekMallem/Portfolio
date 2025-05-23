import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching timeline data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch timeline data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in timeline API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}