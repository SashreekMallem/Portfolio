"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

// Types for different content
type Post = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
};

type Project = {
  id: string;
  title: string;
  emoji: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  // States for different content types
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  // Loading states
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  useEffect(() => {
    // Fetch recent posts
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    
    // Fetch recent projects
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };
    
    // Fetch recent inquiries
    const fetchInquiries = async () => {
      try {
        setLoadingInquiries(true);
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setInquiries(data || []);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoadingInquiries(false);
      }
    };
    
    // Run all fetches
    fetchPosts();
    fetchProjects();
    fetchInquiries();
  }, []);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Function to generate status badge based on status type
  const getStatusBadge = (status: string, type: string) => {
    if (type === 'post') {
      const isPublished = status === 'true';
      if (isPublished) {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Published</span>;
      }
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70">Draft</span>;
    } else if (type === 'project') {
      switch (status) {
        case 'live': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Live</span>;
        case 'mvp': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">MVP</span>;
        case 'in-dev': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">In Dev</span>;
        case 'concept': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">Concept</span>;
        case 'failed': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Failed</span>;
        default: 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70">{status}</span>;
      }
    } else if (type === 'inquiry') {
      switch (status) {
        case 'new': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">New</span>;
        case 'in-progress': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">In Progress</span>;
        case 'completed': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Completed</span>;
        case 'archived': 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70">Archived</span>;
        default: 
          return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70">{status}</span>;
      }
    }
    return null;
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      {/* Main Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div
          className="glassmorphism p-6 rounded-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-neon-cyan mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Blog Posts</h2>
          <p className="text-white/70 mb-4">Manage your journal entries</p>
          <div className="mt-auto">
            <span className="text-3xl font-bold">{posts.length}</span>
            <span className="text-white/70 ml-2">recent posts</span>
          </div>
          <Link 
            href="/admin/posts"
            className="mt-4 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 transition-colors text-center"
          >
            Manage Posts
          </Link>
        </motion.div>
        
        <motion.div
          className="glassmorphism p-6 rounded-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-neon-cyan mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <p className="text-white/70 mb-4">Showcase your portfolio work</p>
          <div className="mt-auto">
            <span className="text-3xl font-bold">{projects.length}</span>
            <span className="text-white/70 ml-2">recent projects</span>
          </div>
          <Link 
            href="/admin/projects"
            className="mt-4 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 transition-colors text-center"
          >
            Manage Projects
          </Link>
        </motion.div>
        
        <motion.div
          className="glassmorphism p-6 rounded-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-neon-cyan mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">About</h2>
          <p className="text-white/70 mb-4">Update your profile information</p>
          <div className="mt-auto flex gap-2">
            <span className="px-2 py-1 bg-white/10 rounded-md text-sm">Profile</span>
            <span className="px-2 py-1 bg-white/10 rounded-md text-sm">Skills</span>
            <span className="px-2 py-1 bg-white/10 rounded-md text-sm">Timeline</span>
          </div>
          <Link 
            href="/admin/about/profile"
            className="mt-4 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 transition-colors text-center"
          >
            Edit Profile
          </Link>
        </motion.div>
        
        <motion.div
          className="glassmorphism p-6 rounded-xl flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-neon-cyan mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Collaborate</h2>
          <p className="text-white/70 mb-4">Manage inquiries and settings</p>
          <div className="mt-auto">
            <span className="text-3xl font-bold">{inquiries.length}</span>
            <span className="text-white/70 ml-2">new inquiries</span>
          </div>
          <Link 
            href="/admin/collaborate/inquiries"
            className="mt-4 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 transition-colors text-center"
          >
            View Inquiries
          </Link>
        </motion.div>
      </div>
      
      {/* Recent items from all sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Projects */}
        <motion.div
          className="glassmorphism p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Projects</h2>
            <Link 
              href="/admin/projects/new" 
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors text-sm flex items-center"
            >
              <span className="mr-1">+</span> New Project
            </Link>
          </div>
          
          {loadingProjects ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60 mb-4">No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center"
              >
                <span className="mr-2">+</span> Create Project
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{project.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{project.title}</h3>
                        {getStatusBadge(project.status, 'project')}
                      </div>
                      <div className="flex items-center text-xs text-white/60 mt-1">
                        <span>{formatDate(project.created_at)}</span>
                        {project.featured && (
                          <span className="ml-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-sm">Featured</span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <Link
            href="/admin/projects"
            className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 text-center rounded-lg transition-colors block"
          >
            View All Projects
          </Link>
        </motion.div>
        
        {/* Recent Posts */}
        <motion.div
          className="glassmorphism p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Posts</h2>
            <Link 
              href="/admin/posts/new" 
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors text-sm flex items-center"
            >
              <span className="mr-1">+</span> New Post
            </Link>
          </div>
          
          {loadingPosts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60 mb-4">No posts yet</p>
              <Link
                href="/admin/posts/new"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors inline-flex items-center"
              >
                <span className="mr-2">+</span> Create Post
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{post.title || 'Untitled'}</h3>
                        {getStatusBadge(String(post.is_published), 'post')}
                      </div>
                      <div className="text-xs text-white/60 mt-1 flex items-center">
                        <span className="truncate">{post.slug}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <Link
            href="/admin/posts"
            className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 text-center rounded-lg transition-colors block"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <motion.div
          className="glassmorphism p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Inquiries</h2>
          </div>
          
          {loadingInquiries ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-cyan"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60 mb-4">No inquiries yet</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {inquiries.map((inquiry) => (
                <li key={inquiry.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{inquiry.name}</h3>
                        {getStatusBadge(inquiry.status || 'new', 'inquiry')}
                      </div>
                      <div className="text-xs text-white/60 mt-1 flex items-center">
                        <span className="truncate">{inquiry.email}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/collaborate/inquiries`}
                      className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <Link
            href="/admin/collaborate/inquiries"
            className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 text-center rounded-lg transition-colors block"
          >
            Manage Inquiries
          </Link>
        </motion.div>
        
        {/* Quick Access and About Info */}
        <motion.div
          className="glassmorphism p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <Link href="/admin/about/profile" className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-cyan mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-sm">Profile</span>
            </Link>
            <Link href="/admin/about/skills" className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-cyan mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-sm">Skills</span>
            </Link>
            <Link href="/admin/about/timeline" className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-cyan mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"></path>
              </svg>
              <span className="text-sm">Timeline</span>
            </Link>
            <Link href="/admin/collaborate/settings" className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neon-cyan mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span className="text-sm">Settings</span>
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="font-medium mb-4">Public Pages</h3>
            <div className="space-y-3">
              <Link href="/" target="_blank" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Home Page