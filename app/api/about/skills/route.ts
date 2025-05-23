import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category');
    
    if (error) {
      console.error('Error fetching skills data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch skills data' },
        { status: 500 }
      );
    }

    // Group skills by category
    const groupedSkills = data.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return NextResponse.json(groupedSkills);
  } catch (error) {
    console.error('Unexpected error in skills API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}