import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imxrnbzfflsfldwamsqx.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteHJuYnpmZmxzZmxkd2Ftc3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTUyNzUsImV4cCI6MjA2MjIzMTI3NX0.tiqHsKvEbNWTWLRQ-obQ2zVdDOpgjRS1O1WRYGMehAs'
);

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  is_published: boolean;
  publish_date: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  fullDescription: string;
  status: 'live' | 'mvp' | 'in-dev' | 'concept' | 'failed';
  tags: string[];
  techStack: string[];
  featured: boolean;
  demoUrl: string | null;
  images: string[];
  features: {
    title: string;
    description: string;
  }[];
  testimonials: {
    quote: string;
    author: string;
  }[];
  created_at: string;
  updated_at: string;
};

// Helper function to format blog post data from database
export function formatBlogPost(post: any): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags || [],
    is_published: post.is_published,
    publish_date: post.publish_date,
    cover_image: post.cover_image,
    created_at: post.created_at,
    updated_at: post.updated_at
  };
}

// Helper function to format project data from database
export function formatProject(project: any): Project {
  return {
    id: project.id,
    title: project.title,
    emoji: project.emoji,
    tagline: project.tagline,
    description: project.description,
    fullDescription: project.full_description,
    status: project.status,
    tags: project.tags || [],
    techStack: project.tech_stack || [],
    featured: project.featured,
    demoUrl: project.demo_url,
    images: project.images || [],
    features: project.features || [],
    testimonials: project.testimonials || [],
    created_at: project.created_at,
    updated_at: project.updated_at
  };
}