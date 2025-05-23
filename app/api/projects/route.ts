import { NextResponse } from 'next/server';
import { supabase, formatProject } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    const formattedProjects = data.map(formatProject);
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    
    // Debug: Log the incoming data
    console.log('Received project data:', JSON.stringify(projectData, null, 2));
    console.log('Tags:', projectData.tags);
    console.log('TechStack:', projectData.techStack);
    
    // Validate required fields
    if (!projectData.title || !projectData.emoji) {
      return NextResponse.json(
        { error: 'Title and emoji are required' },
        { status: 400 }
      );
    }
    
    // Generate ID if not provided
    if (!projectData.id) {
      projectData.id = crypto.randomUUID();
    }
    
    const insertData = {
      id: projectData.id,
      title: projectData.title,
      emoji: projectData.emoji,
      tagline: projectData.tagline || '',
      description: projectData.description || '',
      full_description: projectData.fullDescription || '',
      status: projectData.status || 'concept',
      tags: projectData.tags || [],
      tech_stack: projectData.techStack || [],
      featured: projectData.featured || false,
      demo_url: projectData.demoUrl || null,
      images: projectData.images || [],
      features: projectData.features || [],
      testimonials: projectData.testimonials || [],
    };
    
    // Debug: Log the data being inserted
    console.log('Data being inserted:', JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from('projects')
      .insert([insertData])
      .select();
      
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 400 });
    }
    
    console.log('Project created successfully:', data[0]);
    return NextResponse.json(formatProject(data[0]));
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}