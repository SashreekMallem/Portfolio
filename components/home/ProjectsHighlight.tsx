"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { type Project } from "@/lib/supabase";

function StatusBadge({ status }: { status: string }) {
  const getBadgeColor = () => {
    switch (status) {
      case "live": return "bg-green-500/20 text-green-400";
      case "mvp": return "bg-blue-500/20 text-blue-400";
      case "in-dev": return "bg-yellow-500/20 text-yellow-400";
      case "concept": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "live": return "🚀 Live";
      case "mvp": return "🧪 MVP";
      case "in-dev": return "⚙️ In Dev";
      case "concept": return "📐 Concept";
      default: return status;
    }
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor()}`}>
      {getStatusText()}
    </span>
  );
}

export default function ProjectsHighlight() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch featured projects on component mount
  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        
        const data: Project[] = await response.json();
        // Filter for featured projects and limit to 4
        const featured = data.filter(project => project.featured).slice(0, 4);
        setFeaturedProjects(featured);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedProjects();
  }, []);
  
  // Update scroll position for the progress bar
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const position = scrollContainerRef.current.scrollLeft;
      const maxScrollValue = 
        scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      
      setScrollPosition(position);
      setMaxScroll(maxScrollValue);
    }
  };
  
  // Initial setup and cleanup
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  const scrollProgress = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Projects</h2>
              <p className="text-white/80">A selection of startups I&apos;ve built or am building.</p>
            </div>
            
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-neon-cyan hover:underline"
            >
              <span>View all projects</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-cyan rounded-full"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
        </motion.div>
        
        {/* Horizontal scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto pb-6 hide-scrollbar"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div 
                key={index}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] glassmorphism p-6 rounded-xl animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded"></div>
                  <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="w-32 h-8 bg-gray-700 rounded mb-2"></div>
                <div className="w-full h-16 bg-gray-700 rounded mb-6"></div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-16 h-6 bg-gray-700 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))
          ) : featuredProjects.length > 0 ? (
            featuredProjects.map((project, index) => (
              <motion.div 
                key={project.id}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="h-full glassmorphism p-6 rounded-xl cursor-pointer relative group overflow-hidden">
                    {/* Shimmer effect for featured projects */}
                    <div className="shimmer"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{project.emoji}</div>
                        <StatusBadge status={project.status} />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-white/70 mb-6 min-h-[60px]">
                        {project.tagline}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-1 bg-white/10 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Empty state
            <div className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] glassmorphism p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Projects Coming Soon</h3>
              <p className="text-white/70">Featured projects will appear here once they&apos;re marked as featured in the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}