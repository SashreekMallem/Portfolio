import { NextResponse } from 'next/server';
import { supabase, formatProject } from '@/lib/supabase';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 400 }
      );
    }
    
    return NextResponse.json(formatProject(data));
  } catch (error) {
    console.error(`Error fetching project:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const projectData = await request.json();
    
    console.log('PATCH request for project ID:', id);
    console.log('Project data received:', projectData);
    
    // First check if the project exists
    const { data: existingProject, error: selectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();
    
    console.log('Project exists check:', { existingProject, selectError });
    
    if (selectError) {
      console.error('Project not found:', selectError);
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Prepare the update data
    const updateData: Record<string, any> = {};
    
    if (projectData.title !== undefined) updateData.title = projectData.title;
    if (projectData.emoji !== undefined) updateData.emoji = projectData.emoji;
    if (projectData.tagline !== undefined) updateData.tagline = projectData.tagline;
    if (projectData.description !== undefined) updateData.description = projectData.description;
    if (projectData.fullDescription !== undefined) updateData.full_description = projectData.fullDescription;
    if (projectData.status !== undefined) updateData.status = projectData.status;
    if (projectData.tags !== undefined) updateData.tags = projectData.tags;
    if (projectData.techStack !== undefined) updateData.tech_stack = projectData.techStack;
    if (projectData.featured !== undefined) updateData.featured = projectData.featured;
    if (projectData.demoUrl !== undefined) updateData.demo_url = projectData.demoUrl;
    if (projectData.images !== undefined) updateData.images = projectData.images;
    if (projectData.features !== undefined) updateData.features = projectData.features;
    if (projectData.testimonials !== undefined) updateData.testimonials = projectData.testimonials;
    
    console.log('Update data prepared:', updateData);
    
    // Now update the project
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select();
    
    console.log('Supabase update result:', { data, error });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Update failed - no rows affected. This might be due to Row Level Security policies.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(formatProject(data[0]));
  } catch (error) {
    console.error(`Error updating project:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting project:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}