"use client";

import { useState, useEffect } from "react";
import { 
  CollaborateLookingFor, 
  CollaborateTestimonial, 
  CollaborateCalendarSettings 
} from "@/lib/supabase";

export default function AdminCollaborateSettings() {
  const [lookingForItems, setLookingForItems] = useState<CollaborateLookingFor[]>([]);
  const [testimonials, setTestimonials] = useState<CollaborateTestimonial[]>([]);
  const [calendarSettings, setCalendarSettings] = useState<CollaborateCalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'looking-for' | 'testimonials' | 'calendar'>('looking-for');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch looking for items
      const lookingForResponse = await fetch('/api/collaborate/looking-for');
      if (lookingForResponse.ok) {
        const lookingForData = await lookingForResponse.json();
        setLookingForItems(lookingForData);
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch('/api/collaborate/testimonials');
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData);
      }

      // Fetch calendar settings
      const calendarResponse = await fetch('/api/collaborate/calendar');
      if (calendarResponse.ok) {
        const calendarData = await calendarResponse.json();
        setCalendarSettings(calendarData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLookingFor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      color_theme: formData.get('color_theme') as string,
    };

    try {
      const response = await fetch('/api/collaborate/looking-for', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchAllData();
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Error creating looking for item:', error);
    }
  };

  const handleSubmitTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      quote: formData.get('quote') as string,
      author_name: formData.get('author_name') as string,
      author_title: formData.get('author_title') as string,
      author_company: formData.get('author_company') as string,
      is_featured: formData.get('is_featured') === 'on',
    };

    try {
      const response = await fetch('/api/collaborate/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchAllData();
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
    }
  };

  const handleSubmitCalendar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      calendly_url: formData.get('calendly_url') as string,
      description: formData.get('description') as string,
      meeting_duration: parseInt(formData.get('meeting_duration') as string),
    };

    try {
      const response = await fetch('/api/collaborate/calendar', {
        method: calendarSettings ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating calendar settings:', error);
    }
  };

  const deleteLookingForItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/collaborate/looking-for?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const response = await fetch(`/api/collaborate/testimonials?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Collaborate Settings</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('looking-for')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'looking-for' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10'}`}
        >
          Who I'm Looking For
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'testimonials' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10'}`}
        >
          Testimonials
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'calendar' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/10'}`}
        >
          Calendar Settings
        </button>
      </div>

      {/* Who I'm Looking For Tab */}
      {activeTab === 'looking-for' && (
        <div className="space-y-6">
          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Looking For Item</h2>
            <form onSubmit={handleSubmitLookingFor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  name="title" 
                  required 
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="e.g., SWE who loves fixing systems"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  name="description" 
                  required 
                  rows={3}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="Description of who you're looking for..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Theme</label>
                <select name="color_theme" className="w-full p-3 bg-white/10 border border-white/20 rounded-lg">
                  <option value="neon-cyan">Neon Cyan</option>
                  <option value="neon-violet">Neon Violet</option>
                  <option value="neon-lime">Neon Lime</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg">
                Add Item
              </button>
            </form>
          </div>

          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current Items</h2>
            <div className="space-y-4">
              {lookingForItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.description}</p>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${item.color_theme}/20 text-${item.color_theme}`}>
                      {item.color_theme}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteLookingForItem(item.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Testimonial</h2>
            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quote</label>
                <textarea 
                  name="quote" 
                  required 
                  rows={4}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  placeholder="The testimonial quote..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author Name</label>
                  <input 
                    name="author_name" 
                    required 
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author Title</label>
                  <input 
                    name="author_title" 
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input 
                    name="author_company" 
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="is_featured" />
                  <span className="text-sm">Featured testimonial</span>
                </label>
              </div>
              <button type="submit" className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg">
                Add Testimonial
              </button>
            </form>
          </div>

          <div className="glassmorphism p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current Testimonials</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{testimonial.author_name}</h3>
                      <p className="text-sm text-white/60">
                        {testimonial.author_title}
                        {testimonial.author_company && `, ${testimonial.author_company}`}
                      </p>
                      {testimonial.is_featured && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-white/80 text-sm">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="glassmorphism p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Calendar Settings</h2>
          <form onSubmit={handleSubmitCalendar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Calendly URL</label>
              <input 
                name="calendly_url" 
                type="url"
                required 
                defaultValue={calendarSettings?.calendly_url || ''}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                placeholder="https://calendly.com/username/15min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                name="description" 
                defaultValue={calendarSettings?.description || ''}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
                placeholder="Book a 15-min chat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Duration (minutes)</label>
              <input 
                name="meeting_duration" 
                type="number"
                min="15"
                max="120"
                step="15"
                defaultValue={calendarSettings?.meeting_duration || 15}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg">
              {calendarSettings ? 'Update' : 'Create'} Calendar Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
