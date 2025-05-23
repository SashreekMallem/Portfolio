"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { type Project } from "@/lib/supabase";

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getBadgeColor = () => {
    switch (status) {
      case "live": return "bg-green-500/20 text-green-400";
      case "mvp": return "bg-blue-500/20 text-blue-400";
      case "in-dev": return "bg-yellow-500/20 text-yellow-400";
      case "concept": return "bg-purple-500/20 text-purple-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "live": return "🚀 Live";
      case "mvp": return "🧪 MVP";
      case "in-dev": return "⚙️ In Dev";
      case "concept": return "📐 Concept";
      case "failed": return "❌ Failed";
      default: return status;
    }
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor()}`}>
      {getStatusText()}
    </span>
  );
}

export default function ProjectsPage() {
  // State for projects data
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch projects on component mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);
  
  // Filter projects
  const filteredProjects = projects.filter(project => {
    // Status filter
    if (activeStatus !== "all" && project.status !== activeStatus) {
      return false;
    }
    
    // Category filter
    if (activeCategory !== "all" && !project.tags.includes(activeCategory)) {
      return false;
    }
    
    // Search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Extract unique categories from projects
  const categories = ["all", ...Array.from(new Set(projects.flatMap(p => p.tags)))];
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Projects</h1>
            <p className="text-xl text-white/80">
              A collection of AI-powered startups I&apos;ve built, 
              from concept to fully launched products.
            </p>
          </motion.div>
          
          {/* Filters */}
          <motion.div 
            className="mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {["all", "live", "mvp", "in-dev", "concept", "failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeStatus === status
                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                        : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {status === "all" ? "All Status" : status === "in-dev" ? "In Development" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Category Filters */}
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
              <p className="text-white/60">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Projects Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      layout
                      className="flex"
                    >
                      <Link href={`/projects/${project.id}`} className="w-full">
                        <div className={`glassmorphism h-full p-6 rounded-xl group relative ${project.featured ? 'overflow-hidden' : ''}`}>
                          {/* Shimmer effect for featured projects */}
                          {project.featured && <div className="shimmer"></div>}
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-4xl">{project.emoji}</div>
                              <StatusBadge status={project.status} />
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                              {project.title}
                            </h3>
                            
                            <p className="text-white/70 mb-6 line-clamp-3">
                              {project.tagline}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tags.map((tag) => (
                                <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              {project.demoUrl ? (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon-cyan text-sm hover:underline flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View Demo
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-sm text-white/40">No demo yet</span>
                              )}
                              
                              <span className="text-sm text-white/60 flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Details
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="col-span-full py-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium mb-2">No matching projects found</h3>
                    <p className="text-white/60">Try adjusting your search or filters</p>
                    <button
                      onClick={() => {
                        setActiveStatus("all");
                        setActiveCategory("all");
                        setSearchQuery("");
                      }}
                      className="mt-6 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}