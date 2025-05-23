"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
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
    setSlug(generateSlug(newTitle));
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
        publish_date: isPublished ? new Date().toISOString() : null
      };
      
      // Save post to database
      const { error: saveError } = await supabase
        .from('blog_posts')
        .insert(postData);
      
      if (saveError) {
        throw new Error(saveError.message);
      }
      
      // Navigate to dashboard on success
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create post");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Create New Post</h1>
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
                placeholder="javascript, react, tutorial"
              />
            </div>
            
            <div className="mt-6 p-4 border border-white/20 rounded-lg bg-white/5">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5 bg-white/5 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-neon-cyan"
                />
                <label htmlFor="isPublished" className="ml-2 text-base font-medium text-white">
                  Publish immediately
                </label>
              </div>
              
              {isPublished ? (
                <div className="mt-2 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Post will be published immediately after saving
                </div>
              ) : (
                <div className="mt-2 px-4 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Post will be saved as draft
                </div>
              )}
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
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent text-white h-96"
            placeholder="Write your post content here..."
            required
          />
          <p className="mt-2 text-sm text-white/50">
            Simple markdown is supported.
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg transition-colors text-white"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-medium rounded-lg transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}