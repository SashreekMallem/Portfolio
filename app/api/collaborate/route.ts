import { NextResponse } from 'next/server';
import { 
  supabase, 
  formatCollaborateLookingFor, 
  formatCollaborateTestimonial,
  formatCollaborateCalendarSettings,
  formatCollaborateInquiry
} from '@/lib/supabase';

// GET handler for fetching collaborate page data
export async function GET() {
  try {
    // Fetch "Who I'm Looking For" data
    const { data: lookingForData, error: lookingForError } = await supabase
      .from('collaborate_looking_for')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (lookingForError) {
      console.error('Error fetching looking for data:', lookingForError);
    }

    // Fetch testimonials
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('collaborate_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true });

    if (testimonialsError) {
      console.error('Error fetching testimonials:', testimonialsError);
    }

    // Fetch calendar settings
    const { data: calendarData, error: calendarError } = await supabase
      .from('collaborate_calendar_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (calendarError) {
      console.error('Error fetching calendar settings:', calendarError);
    }

    return NextResponse.json({
      lookingFor: lookingForData ? lookingForData.map(formatCollaborateLookingFor) : [],
      testimonials: testimonialsData ? testimonialsData.map(formatCollaborateTestimonial) : [],
      calendarSettings: calendarData ? formatCollaborateCalendarSettings(calendarData) : null
    });

  } catch (error) {
    console.error('Error fetching collaborate data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaborate data' },
      { status: 500 }
    );
  }
}

// POST handler for creating collaboration inquiries
export async function POST(request: Request) {
  try {
    const inquiryData = await request.json();
    
    // Validate required fields
    const { inquiry_type, name, email, message } = inquiryData;
    
    if (!inquiry_type || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['developer', 'investor'].includes(inquiry_type)) {
      return NextResponse.json(
        { error: 'Invalid inquiry type' },
        { status: 400 }
      );
    }

    // Insert the inquiry
    const { data, error } = await supabase
      .from('collaborate_inquiries')
      .insert([{
        inquiry_type,
        name,
        email,
        company: inquiryData.company || null,
        area_of_interest: inquiryData.area_of_interest || null,
        message,
        status: 'new'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry:', error);
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: formatCollaborateInquiry(data)
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
