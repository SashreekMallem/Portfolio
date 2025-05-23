"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setCoverImage(data.cover_image || '');
          setTags(data.tags ? data.tags.join(', ') : '');
          setIsPublished(!!data.is_published);
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Only auto-generate slug if it was empty or exactly matched the previous title
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlug(generateSlug(newSlug));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Format tags as array
      const tagsArray = tags
        ? tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // Prepare post data
      const postData = {
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        tags: tagsArray,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
        publish_date: isPublished && !postData?.publish_date ? new Date().toISOString() : undefined
      };
      
      // Update post in database
      const { error: saveError } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id);
      
      if (saveError) {
        throw new Error(saveError.message);
      }
      
      // Navigate to dashboard on success
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to update post");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      
      {error && (
        <motion.div 
          className="mb-6 bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="glassmorphism p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                placeholder="Post Title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-white/70 mb-1">
                Slug
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                  placeholder="post-url-slug"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-white/70 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white h-24"
                placeholder="Brief excerpt of your post"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-white/70 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white/70 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white"
                placeholder="code, design, tech"
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-neon-cyan text-neon-cyan"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-white/70">
                Published
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-white/70 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white h-64 font-mono"
            placeholder="# Markdown content here"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan/50 rounded-lg text-neon-cyan hover:bg-neon-cyan/30 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-neon-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}