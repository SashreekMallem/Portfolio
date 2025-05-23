"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      case "in-dev": return "⚙️ In Development";
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

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: ""
  });
  
  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);
  
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would send this to a backend API
    console.log("Waitlist submission:", formData);
    setHasJoinedWaitlist(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-4xl mb-4">⚠️</div>
              <h1 className="text-2xl mb-4">Project not found</h1>
              <p className="text-white/60 mb-6">{error || "This project doesn't exist or has been removed."}</p>
              <Link href="/projects" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Back to projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-white/60 mb-6">
              <Link href="/projects" className="hover:text-neon-cyan transition-colors">
                Projects
              </Link>
              <span>/</span>
              <span>{project.title}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{project.emoji}</div>
                  <StatusBadge status={project.status} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-white/80 mb-6">
                  {project.tagline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-sm px-3 py-1 bg-white/10 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10L20 15M20 15L15 20M20 15H8C6.93913 15 5.92172 14.5786 5.17157 13.8284C4.42143 13.0783 4 12.0609 4 11C4 9.93913 4.42143 8.92172 5.17157 8.17157C5.92172 7.42143 6.93913 7 8 7H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View Live Demo
                </a>
              )}
            </div>
          </motion.div>
          
          {/* Tabs */}
          <div className="border-b border-white/10 mb-12">
            <div className="flex overflow-x-auto hide-scrollbar -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-b-2 border-neon-cyan text-neon-cyan"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === "features"
                    ? "border-b-2 border-neon-cyan text-neon-cyan"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => setActiveTab("tech")}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === "tech"
                    ? "border-b-2 border-neon-cyan text-neon-cyan"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                Tech Stack
              </button>
              {(project.status === "concept" || project.status === "in-dev") && (
                <button
                  onClick={() => setActiveTab("waitlist")}
                  className={`px-4 py-3 font-medium whitespace-nowrap ${
                    activeTab === "waitlist"
                      ? "border-b-2 border-neon-cyan text-neon-cyan"
                      : "text-white/60 hover:text-white/90"
                  }`}
                >
                  Join Waitlist
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Project Images */}
                {project.images && project.images.length > 0 && (
                  <div className="mb-12 glassmorphism rounded-xl p-4">
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                      {project.images.map((image, index) => (
                        <div key={index} className="min-w-[280px] md:min-w-[320px] h-[200px] bg-white/5 rounded-lg flex items-center justify-center">
                          <div className="text-white/30 text-sm">Image placeholder: {image}</div>
                        </div>
                      ))}
                      {project.images.length === 0 && (
                        <div className="w-full h-[200px] bg-white/5 rounded-lg flex items-center justify-center">
                          <div className="text-white/30">
                            {project.status === "concept" 
                              ? "Concept visualizations coming soon"
                              : "Screenshots coming soon"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div className="prose prose-invert max-w-none mb-12">
                  <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
                </div>
                
                {/* Testimonials */}
                {project.testimonials && project.testimonials.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">What People Are Saying</h3>
                    <div className="grid gap-6">
                      {project.testimonials.map((testimonial, index) => (
                        <div key={index} className="glassmorphism p-6 rounded-xl">
                          <blockquote className="mb-4 text-white/90 italic">
                            "{testimonial.quote}"
                          </blockquote>
                          <cite className="text-sm not-italic text-white/70">— {testimonial.author}</cite>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Features Tab */}
            {activeTab === "features" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-8">Key Features</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {project.features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glassmorphism p-6 rounded-xl"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-neon-cyan">
                        {feature.title}
                      </h3>
                      <p className="text-white/80">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Tech Stack Tab */}
            {activeTab === "tech" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-8">Technology Stack</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {project.techStack.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glassmorphism p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square"
                    >
                      <div className="text-3xl mb-2">
                        {/* Simple emoji representation of tech */}
                        {{
                          "React": "⚛️",
                          "React Native": "📱",
                          "Next.js": "▲",
                          "Vue.js": "🟢",
                          "Flutter": "🔷",
                          "Python": "🐍",
                          "Node.js": "🟢",
                          "FastAPI": "⚡",
                          "Express": "🚂",
                          "MongoDB": "🍃",
                          "PostgreSQL": "🐘",
                          "Firebase": "🔥",
                          "Supabase": "⚡",
                          "Stripe": "💳",
                          "Docker": "🐳",
                          "TensorFlow": "🧠",
                          "GPT-4": "🤖",
                          "OpenAI": "🧠",
                          "Anthropic Claude": "🤖",
                          "Vercel": "▲",
                          "Prisma": "◆"
                        }[tech] || "🔧"}
                      </div>
                      <span className="font-medium">{tech}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Waitlist Tab */}
            {activeTab === "waitlist" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-lg mx-auto text-center mb-8">
                  <div className="text-4xl mb-4">
                    {{
                      "concept": "📝",
                      "in-dev": "🚧"
                    }[project.status] || "🚀"}
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Join the Waitlist
                  </h2>
                  <p className="text-white/80">
                    {project.status === "concept"
                      ? "This project is currently in the concept phase. Sign up to be notified when development starts and to provide early feedback."
                      : "Development is underway! Join the waitlist to be among the first to try it when it's ready for testing."}
                  </p>
                </div>
                
                {!hasJoinedWaitlist ? (
                  <form 
                    onSubmit={handleWaitlistSubmit}
                    className="max-w-lg mx-auto glassmorphism p-6 rounded-xl"
                  >
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Why are you interested? (optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-lg hover:bg-neon-cyan/20 transition-colors"
                    >
                      Join Waitlist
                    </button>
                  </form>
                ) : (
                  <div className="max-w-lg mx-auto glassmorphism p-6 rounded-xl text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                    <p className="text-white/80 mb-4">
                      Thanks for your interest in {project.title}. We'll notify you when there are updates.
                    </p>
                    <button
                      onClick={() => setHasJoinedWaitlist(false)}
                      className="text-neon-cyan hover:underline text-sm"
                    >
                      Add another email
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}