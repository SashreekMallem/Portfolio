"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  publishDate: string;
  coverImage: string | null;
  slug: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog?slug=${slug}`);
        
        if (response.status === 404) {
          setError("Post not found");
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          return;
        }
        
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  // Function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM d, yyyy");
  };
  
  // Function to calculate read time (rough estimate)
  const getReadTime = (content: string | null) => {
    if (!content) return "3 min read";
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };
  
  // Handle back button
  const handleBack = () => {
    router.push('/journal');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center pt-32 h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Post Not Found</h1>
            <p className="text-white/70 mb-8">
              {error || "The blog post you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-medium rounded-lg transition-colors"
            >
              Back to Journal
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <button 
                onClick={handleBack}
                className="text-white/70 hover:text-white flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Journal
              </button>
            </motion.div>
            
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="bg-neon-cyan/20 text-neon-cyan text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>{formatDate(post.publishDate)}</span>
                <span>•</span>
                <span>{getReadTime(post.content)}</span>
              </div>
            </motion.div>
            
            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Content */}
            <motion.div
              className="prose prose-invert prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {post.excerpt && (
                <div className="mb-8 text-xl text-white/80 font-light leading-relaxed border-l-4 border-neon-cyan pl-4">
                  {post.excerpt}
                </div>
              )}
              
              <ReactMarkdown>
                {post.content || ''}
              </ReactMarkdown>
            </motion.div>
            
            {/* Share and navigation */}
            <motion.div
              className="mt-16 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Share this post</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.88 8.14 6.84 9.5.5.08.66-.23.66-.5 0-.23 0-.86-.02-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.69 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.69.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.16.59.67.5C19.14 20.14 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleBack}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all posts
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </div>
  );
}