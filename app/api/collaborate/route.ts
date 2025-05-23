import { NextResponse } from 'next/server';

// Fallback data when Supabase is not available
const fallbackData = {
  lookingFor: [
    {
      id: '1',
      title: 'Full-Stack Developers',
      description: 'Experienced developers who can build scalable web applications using modern tech stacks.',
      color_theme: 'neon-cyan' as const
    },
    {
      id: '2', 
      title: 'AI/ML Engineers',
      description: 'Specialists in machine learning and AI who can integrate intelligent features into products.',
      color_theme: 'neon-violet' as const
    },
    {
      id: '3',
      title: 'Strategic Investors',
      description: 'Investors who bring not just capital but also valuable industry connections and expertise.',
      color_theme: 'neon-lime' as const
    }
  ],
  testimonials: [
    {
      id: '1',
      quote: 'Working with Sashreek has been an incredible experience. His technical expertise and business acumen make him an ideal collaborator.',
      author_name: 'Future Collaborator',
      author_title: 'CTO',
      author_company: 'TechCorp',
      author_image_url: null
    }
  ],
  calendarSettings: {
    calendly_url: 'https://calendly.com/sashreek',
    description: 'Book a 30-min chat'
  }
};

// GET handler for fetching collaborate page data
export async function GET() {
  try {
    // Try to import and use Supabase
    let lookingForData = null;
    let testimonialsData = null;
    let calendarData = null;

    try {
      const { 
        supabase, 
        formatCollaborateLookingFor, 
        formatCollaborateTestimonial,
        formatCollaborateCalendarSettings
      } = await import('@/lib/supabase');

      // Fetch "Who I'm Looking For" data
      const { data: lookingFor, error: lookingForError } = await supabase
        .from('collaborate_looking_for')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!lookingForError && lookingFor) {
        lookingForData = lookingFor.map(formatCollaborateLookingFor);
      }

      // Fetch testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('collaborate_testimonials')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true });

      if (!testimonialsError && testimonials) {
        testimonialsData = testimonials.map(formatCollaborateTestimonial);
      }

      // Fetch calendar settings
      const { data: calendar, error: calendarError } = await supabase
        .from('collaborate_calendar_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!calendarError && calendar) {
        calendarData = formatCollaborateCalendarSettings(calendar);
      }
    } catch (supabaseError) {
      console.warn('Supabase not available, using fallback data:', supabaseError);
    }

    return NextResponse.json({
      lookingFor: lookingForData || fallbackData.lookingFor,
      testimonials: testimonialsData || fallbackData.testimonials,
      calendarSettings: calendarData || fallbackData.calendarSettings
    });

  } catch (error) {
    console.error('Error fetching collaborate data:', error);
    // Return fallback data even on error
    return NextResponse.json(fallbackData);
  }
}
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
