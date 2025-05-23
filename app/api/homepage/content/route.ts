import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json(data || {});
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get existing content or use default ID
    const { data: existingContent } = await supabase
      .from('homepage_content')
      .select('id')
      .eq('is_active', true)
      .single();

    const contentData = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    let data, error;

    if (existingContent) {
      // Update existing content
      const { data: updateData, error: updateError } = await supabase
        .from('homepage_content')
        .update(contentData)
        .eq('id', existingContent.id)
        .select()
        .single();
      
      data = updateData;
      error = updateError;
    } else {
      // Insert new content
      const { data: insertData, error: insertError } = await supabase
        .from('homepage_content')
        .insert([contentData])
        .select()
        .single();
      
      data = insertData;
      error = insertError;
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}
