import { supabase, formatBlogPost } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET handler for fetching blog posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const tag = searchParams.get('tag');
  
  try {
    // If a slug is provided, fetch a single post
    if (slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json(formatBlogPost(data));
    }
    
    // Build query for multiple posts
    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, tags, publish_date, cover_image, created_at', { count: 'exact' });
    
    // Only show published posts unless in admin mode
    if (searchParams.get('admin') !== 'true') {
      query = query.eq('is_published', true);
    }
    
    // Filter by tag if provided
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    // Paginate
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Order by publish date
    const { data, count, error } = await query
      .order('publish_date', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return NextResponse.json({ 
      posts: data ? data.map(post => formatBlogPost(post)) : [], 
      totalCount: count || 0,
      page,
      limit
    });
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Error fetching blog posts' }, { status: 500 });
  }
}

// POST handler for creating a new blog post
export async function POST(request: Request) {
  try {
    const postData = await request.json();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select();
    
    if (error) throw error;
    
    return NextResponse.json(formatBlogPost(data[0]));
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Error creating blog post' }, { status: 500 });
  }
}