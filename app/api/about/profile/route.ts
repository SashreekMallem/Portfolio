import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching profile data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: 500 }
      );
    }

    // Get social links
    const { data: socialLinks, error: socialError } = await supabase
      .from('social_links')
      .select('*');
    
    if (socialError) {
      console.error('Error fetching social links:', socialError);
    }

    return NextResponse.json({
      ...data,
      socialLinks: socialLinks || []
    });
  } catch (error) {
    console.error('Unexpected error in profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}