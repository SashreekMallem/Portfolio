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

export type HomepageContent = {
  id: string;
  hero_headline: string;
  hero_highlight_word: string;
  hero_intro_text: string;
  hero_primary_cta_text: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_url: string;
  hero_scroll_text: string;
  why_build_headline: string;
  why_build_intro: string;
  why_build_quote: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HomepageBuildingPrinciple = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CollaborateLookingFor = {
  id: string;
  title: string;
  icon_svg: string | null;
  description: string;
  color_theme: 'neon-cyan' | 'neon-violet' | 'neon-lime';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CollaborateTestimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_title: string | null;
  author_company: string | null;
  author_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CollaborateInquiry = {
  id: string;
  inquiry_type: 'developer' | 'investor';
  name: string;
  email: string;
  company: string | null;
  area_of_interest: string | null;
  message: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CollaborateCalendarSettings = {
  id: string;
  calendly_url: string;
  meeting_duration: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Helper function to format blog post data from database
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Helper function to format homepage content data
export function formatHomepageContent(item: any): HomepageContent {
  return {
    id: item.id,
    hero_headline: item.hero_headline,
    hero_highlight_word: item.hero_highlight_word,
    hero_intro_text: item.hero_intro_text,
    hero_primary_cta_text: item.hero_primary_cta_text,
    hero_primary_cta_url: item.hero_primary_cta_url,
    hero_secondary_cta_text: item.hero_secondary_cta_text,
    hero_secondary_cta_url: item.hero_secondary_cta_url,
    hero_scroll_text: item.hero_scroll_text,
    why_build_headline: item.why_build_headline,
    why_build_intro: item.why_build_intro,
    why_build_quote: item.why_build_quote,
    email: item.email,
    phone: item.phone,
    location: item.location,
    linkedin_url: item.linkedin_url,
    github_url: item.github_url,
    twitter_url: item.twitter_url,
    is_active: item.is_active,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

// Helper function to format building principles data
export function formatHomepageBuildingPrinciple(item: any): HomepageBuildingPrinciple {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    icon_name: item.icon_name,
    sort_order: item.sort_order,
    is_active: item.is_active,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

// Helper function to format collaborate looking for data
export function formatCollaborateLookingFor(item: any): CollaborateLookingFor {
  return {
    id: item.id,
    title: item.title,
    icon_svg: item.icon_svg,
    description: item.description,
    color_theme: item.color_theme,
    is_active: item.is_active,
    sort_order: item.sort_order,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

// Helper function to format collaborate testimonial data
export function formatCollaborateTestimonial(item: any): CollaborateTestimonial {
  return {
    id: item.id,
    quote: item.quote,
    author_name: item.author_name,
    author_title: item.author_title,
    author_company: item.author_company,
    author_image_url: item.author_image_url,
    is_featured: item.is_featured,
    is_active: item.is_active,
    sort_order: item.sort_order,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

// Helper function to format collaborate inquiry data
export function formatCollaborateInquiry(item: any): CollaborateInquiry {
  return {
    id: item.id,
    inquiry_type: item.inquiry_type,
    name: item.name,
    email: item.email,
    company: item.company,
    area_of_interest: item.area_of_interest,
    message: item.message,
    status: item.status,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

// Helper function to format calendar settings data
export function formatCollaborateCalendarSettings(item: any): CollaborateCalendarSettings {
  return {
    id: item.id,
    calendly_url: item.calendly_url,
    meeting_duration: item.meeting_duration,
    description: item.description,
    is_active: item.is_active,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}