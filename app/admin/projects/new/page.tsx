"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/lib/supabase";

export default function NewProjectPage() {
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    emoji: "",
    tagline: "",
    description: "",
    fullDescription: "<p>Enter the full description here. HTML is supported.</p>",
    status: "concept",
    tags: [],
    techStack: [],
    featured: false,
    demoUrl: "",
    images: [],
    features: [],
    testimonials: []
  });
  
  // Tag input fields
  const [tagInput, setTagInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  
  // Feature input fields
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  
  // Testimonial input fields
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  
  // Image input field
  const [imageUrl, setImageUrl] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Add tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput("");
  };
  
  // Remove tag
  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };
  
  // Add tech stack item
  const handleAddTechStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techStackInput.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      techStack: [...(prev.techStack || []), techStackInput.trim()]
    }));
    setTechStackInput("");
  };
  
  // Remove tech stack item
  const handleRemoveTechStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack?.filter((_, i) => i !== index)
    }));
  };
  
  // Add feature
  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureTitle.trim() || !featureDescription.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), { title: featureTitle.trim(), description: featureDescription.trim() }]
    }));
    setFeatureTitle("");
    setFeatureDescription("");
  };
  
  // Remove feature
  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };
  
  // Add testimonial
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialQuote.trim() || !testimonialAuthor.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { quote: testimonialQuote.trim(), author: testimonialAuthor.trim() }]
    }));
    setTestimonialQuote("");
    setTestimonialAuthor("");
  };
  
  // Remove testimonial
  const handleRemoveTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials?.filter((_, i) => i !== index)
    }));
  };
  
  // Add image
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), imageUrl.trim()]
    }));
    setImageUrl("");
  };
  
  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError("");
      
      // Generate a UUID for the project
      const projectId = crypto.randomUUID();
      
      // Prepare the data with the generated ID
      const projectData = {
        ...formData,
        id: projectId
      };
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }
      
      const newProject = await response.json();
      router.push("/admin/projects");
    } catch (err: any) {
      console.error("Error creating project:", err);
      setError(err.message || "Failed to create project");
      window.scrollTo(0, 0);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neon-cyan">Create New Project</h1>
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="glassmorphism rounded-lg p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  required
                  placeholder="Project Title"
                />
              </div>
              
              <div>
                <label htmlFor="emoji" className="block text-sm font-medium mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  id="emoji"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  required
                  maxLength={2}
                  placeholder="🚀"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="tagline" className="block text-sm font-medium mb-2">
                Tagline
              </label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                required
                placeholder="A brief, catchy description"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent resize-none"
                required
                placeholder="A more detailed description of your project"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="fullDescription" className="block text-sm font-medium mb-2">
                Full Description (HTML)
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={8}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent font-mono text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  required
                >
                  <option value="concept">Concept</option>
                  <option value="in-dev">In Development</option>
                  <option value="mvp">MVP</option>
                  <option value="live">Live</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="demoUrl" className="block text-sm font-medium mb-2">
                  Demo URL (optional)
                </label>
                <input
                  type="url"
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan/50 border-white/30 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm">
                  Featured Project
                </label>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Tags</h2>
            
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  placeholder="Enter a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-3 bg-neon-cyan text-gray-900 rounded-r-lg hover:bg-neon-cyan/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <div key={index} className="px-3 py-2 bg-white/10 rounded-lg flex items-center">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-white/60 hover:text-white/90"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.tags?.length === 0 && (
                <p className="text-white/60 text-sm">No tags added yet</p>
              )}
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Tech Stack</h2>
            
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  placeholder="Enter a technology"
                />
                <button
                  type="button"
                  onClick={handleAddTechStack}
                  className="px-4 py-3 bg-neon-cyan text-gray-900 rounded-r-lg hover:bg-neon-cyan/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.techStack?.map((tech, index) => (
                <div key={index} className="px-3 py-2 bg-white/10 rounded-lg flex items-center">
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTechStack(index)}
                    className="ml-2 text-white/60 hover:text-white/90"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.techStack?.length === 0 && (
                <p className="text-white/60 text-sm">No technologies added yet</p>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Features</h2>
            
            <div className="mb-4 glassmorphism p-4 rounded-lg">
              <div className="mb-3">
                <label htmlFor="featureTitle" className="block text-sm font-medium mb-1">
                  Feature Title
                </label>
                <input
                  type="text"
                  id="featureTitle"
                  value={featureTitle}
                  onChange={(e) => setFeatureTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="featureDescription" className="block text-sm font-medium mb-1">
                  Feature Description
                </label>
                <textarea
                  id="featureDescription"
                  value={featureDescription}
                  onChange={(e) => setFeatureDescription(e.target.value)}
                  rows={2}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent resize-none"
                />
              </div>
              
              <button
                type="button"
                onClick={handleAddFeature}
                className="w-full py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                Add Feature
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.features?.map((feature, index) => (
                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-neon-cyan">{feature.title}</h3>
                      <p className="text-sm text-white/70 mt-1">{feature.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-white/60 hover:text-white/90"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              {formData.features?.length === 0 && (
                <p className="text-white/60 text-sm">No features added yet</p>
              )}
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Testimonials</h2>
            
            <div className="mb-4 glassmorphism p-4 rounded-lg">
              <div className="mb-3">
                <label htmlFor="testimonialQuote" className="block text-sm font-medium mb-1">
                  Quote
                </label>
                <textarea
                  id="testimonialQuote"
                  value={testimonialQuote}
                  onChange={(e) => setTestimonialQuote(e.target.value)}
                  rows={3}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="testimonialAuthor" className="block text-sm font-medium mb-1">
                  Author
                </label>
                <input
                  type="text"
                  id="testimonialAuthor"
                  value={testimonialAuthor}
                  onChange={(e) => setTestimonialAuthor(e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  placeholder="Name, Title"
                />
              </div>
              
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="w-full py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                Add Testimonial
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.testimonials?.map((testimonial, index) => (
                <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm italic text-white/80 mb-2">"{testimonial.quote}"</p>
                      <p className="text-xs text-white/60">— {testimonial.author}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(index)}
                      className="text-white/60 hover:text-white/90 ml-3"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              {formData.testimonials?.length === 0 && (
                <p className="text-white/60 text-sm">No testimonials added yet</p>
              )}
            </div>
          </div>
          
          {/* Images */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">Images</h2>
            
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-transparent"
                  placeholder="/path-to-image.jpg"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-3 bg-neon-cyan text-gray-900 rounded-r-lg hover:bg-neon-cyan/80 transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1">Enter the path to the image file</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.images?.map((image, index) => (
                <div key={index} className="relative bg-white/5 rounded-lg p-2 aspect-video flex items-center justify-center">
                  <div className="text-white/60 text-xs overflow-hidden text-ellipsis">{image}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:text-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.images?.length === 0 && (
                <div className="col-span-full">
                  <p className="text-white/60 text-sm">No images added yet</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-end">
              <Link
                href="/admin/projects"
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors mr-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-neon-cyan text-gray-900 rounded-lg hover:bg-neon-cyan/80 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2">Creating</span>
                    <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}