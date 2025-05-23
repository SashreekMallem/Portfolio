import { NextResponse } from 'next/server';
import { supabase, formatCollaborateCalendarSettings } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collaborate_calendar_settings')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching calendar settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calendar settings' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateCalendarSettings(data));
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const calendarData = await request.json();
    
    // First, deactivate any existing active calendar settings
    await supabase
      .from('collaborate_calendar_settings')
      .update({ is_active: false })
      .eq('is_active', true);
    
    const { data, error } = await supabase
      .from('collaborate_calendar_settings')
      .insert([{
        calendly_url: calendarData.calendly_url,
        meeting_duration: calendarData.meeting_duration || 15,
        description: calendarData.description || null,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating calendar settings:', error);
      return NextResponse.json(
        { error: 'Failed to create calendar settings' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateCalendarSettings(data));
  } catch (error) {
    console.error('Error creating calendar settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    const { data, error } = await supabase
      .from('collaborate_calendar_settings')
      .update({
        calendly_url: updateData.calendly_url,
        meeting_duration: updateData.meeting_duration,
        description: updateData.description,
        is_active: updateData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating calendar settings:', error);
      return NextResponse.json(
        { error: 'Failed to update calendar settings' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateCalendarSettings(data));
  } catch (error) {
    console.error('Error updating calendar settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
