"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { format } from "date-fns";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  tags: string[];
  publishDate: string;
  coverImage: string | null;
  content: string | null;
};

export default function JournalPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();
        // Update to access the posts array from the response
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Derive categories from posts after they're loaded
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Make sure posts is an array and each post has tags
      const tags = posts.reduce((acc: string[], post) => {
        if (post.tags && Array.isArray(post.tags)) {
          return [...acc, ...post.tags];
        }
        return acc;
      }, []);
      
      // Create unique set of tags
      setAllCategories(["All", ...Array.from(new Set(tags))]);
    }
  }, [posts]);
  
  // Ensure posts is an array before filtering
  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    if (activeCategory === "All") return true;
    return post.tags && post.tags.includes(activeCategory);
  }) : [];
  
  // Function to calculate read time (rough estimate)
  const getReadTime = (content: string | null) => {
    if (!content) return "3 min read";
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM d, yyyy");
  };
  
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Journal</h1>
            <p className="text-xl text-white/80 text-center">
              Thoughts on startups, AI, and building products that matter.
            </p>
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
              <div className="text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="text-white/70">{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* Category Filters */}
              <div className="mb-12 flex flex-wrap gap-3 justify-center">
                {allCategories.map((category, index) => (
                  <motion.button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category 
                        ? "glassmorphism neon-border bg-white/10" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setActiveCategory(category)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-xl font-bold mb-2">No posts found</h2>
                  <p className="text-white/70">No posts match the selected category.</p>
                </div>
              ) : (
                <>
                  {/* Main Featured Post */}
                  <motion.div 
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Link href={`/journal/${filteredPosts[0]?.slug}`}>
                      <div className="group glassmorphism p-0 rounded-xl overflow-hidden">
                        <div className="relative w-full h-64 md:h-80">
                          {filteredPosts[0]?.coverImage ? (
                            <div 
                              className="absolute inset-0 bg-cover bg-center" 
                              style={{ backgroundImage: `url(${filteredPosts[0].coverImage})` }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-white/30">
                              <span>[Featured Image Would Go Here]</span>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          
                          <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {filteredPosts[0]?.tags && filteredPosts[0].tags.map(tag => (
                                <span key={tag} className="bg-neon-cyan/20 text-neon-cyan text-xs px-3 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                              <span className="text-white/60 text-sm">
                                {formatDate(filteredPosts[0]?.publishDate)}
                              </span>
                              <span className="text-white/60 text-sm">
                                {getReadTime(filteredPosts[0]?.content)}
                              </span>
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                              {filteredPosts[0]?.title}
                            </h2>
                            
                            <p className="text-white/70 line-clamp-2">
                              {filteredPosts[0]?.excerpt}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  
                  {/* Post Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.slice(1).map((post, index) => (
                      <motion.div 
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      >
                        <Link href={`/journal/${post.slug}`}>
                          <div className="group glassmorphism h-full flex flex-col rounded-xl overflow-hidden">
                            <div className="w-full h-48 relative">
                              {post.coverImage ? (
                                <div 
                                  className="absolute inset-0 bg-cover bg-center" 
                                  style={{ backgroundImage: `url(${post.coverImage})` }}
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-white/30">
                                  <span>[Post Image]</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                {post.tags && post.tags.slice(0, 1).map(tag => (
                                  <span key={tag} className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                                <span className="text-white/60 text-xs">
                                  {getReadTime(post.content)}
                                </span>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2 group-hover:text-neon-violet transition-colors">
                                {post.title}
                              </h3>
                              
                              <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>
                              
                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
                                <span className="text-xs text-white/60">{formatDate(post.publishDate)}</span>
                                <span className="text-neon-violet text-sm flex items-center gap-1">
                                  Read more
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          
          {/* Newsletter Subscription */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glassmorphism p-8 md:p-12 rounded-xl">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to my newsletter</h2>
                  <p className="text-white/70 mb-0 md:mb-4">
                    Get periodic updates on my latest projects, articles, and insights. No spam, unsubscribe anytime.
                  </p>
                </div>
                <div className="w-full md:w-auto">
                  <form className="flex flex-col md:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-cyan w-full md:w-auto"
                      required
                    />
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors whitespace-nowrap"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}