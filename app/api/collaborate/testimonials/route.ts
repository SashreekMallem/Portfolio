import { NextResponse } from 'next/server';
import { supabase, formatCollaborateTestimonial } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('collaborate_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json(data.map(formatCollaborateTestimonial));
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
    const testimonialData = await request.json();
    
    const { data, error } = await supabase
      .from('collaborate_testimonials')
      .insert([{
        quote: testimonialData.quote,
        author_name: testimonialData.author_name,
        author_title: testimonialData.author_title || null,
        author_company: testimonialData.author_company || null,
        author_image_url: testimonialData.author_image_url || null,
        is_featured: testimonialData.is_featured || false,
        sort_order: testimonialData.sort_order || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to create testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateTestimonial(data));
  } catch (error) {
    console.error('Error creating testimonial:', error);
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
      .from('collaborate_testimonials')
      .update({
        quote: updateData.quote,
        author_name: updateData.author_name,
        author_title: updateData.author_title,
        author_company: updateData.author_company,
        author_image_url: updateData.author_image_url,
        is_featured: updateData.is_featured,
        is_active: updateData.is_active,
        sort_order: updateData.sort_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to update testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCollaborateTestimonial(data));
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('collaborate_testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to delete testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
