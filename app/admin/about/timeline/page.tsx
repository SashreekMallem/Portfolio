"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type TimelineItem = {
  id: number;
  date: string;
  month: string;
  year: string;
  title: string;
  description: string;
  details: string;
  icon: string;
  type: 'education' | 'project' | 'work' | 'achievement';
};

export default function TimelineManagement() {
  const router = useRouter();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Form state for new/edit item
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<TimelineItem>>({
    title: '',
    date: '',
    month: '',
    year: '',
    description: '',
    details: '',
    icon: '🔵',
    type: 'project'
  });
  
  // Fetch timeline data
  useEffect(() => {
    fetchTimelineItems();
  }, []);
  
  const fetchTimelineItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('timeline_items')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTimelineItems(data || []);
    } catch (error) {
      console.error('Error fetching timeline items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };
  
  // Handle form submission for create/edit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentItem.title || !currentItem.date || !currentItem.description) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Extract month and year from date
      const dateObj = new Date(currentItem.date);
      const month = format(dateObj, 'MMMM');
      const year = format(dateObj, 'yyyy');
      
      const itemData = {
        ...currentItem,
        month,
        year
      };
      
      if (currentItem.id) {
        // Update existing item
        const { error } = await supabase
          .from('timeline_items')
          .update(itemData)
          .eq('id', currentItem.id);
        
        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('timeline_items')
          .insert([itemData]);
        
        if (error) throw error;
      }
      
      // Reset form and refresh data
      setCurrentItem({
        title: '',
        date: '',
        month: '',
        year: '',
        description: '',
        details: '',
        icon: '🔵',
        type: 'project'
      });
      setIsEditing(false);
      fetchTimelineItems();
      
    } catch (error) {
      console.error('Error saving timeline item:', error);
      alert('Failed to save timeline item');
    }
  };
  
  // Edit an item
  const handleEdit = (item: TimelineItem) => {
    setCurrentItem({
      ...item,
      date: item.date ? item.date.split('T')[0] : '' // Format date for input
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Delete an item
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this timeline item? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(id);
      
      const { error } = await supabase
        .from('timeline_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTimelineItems(timelineItems.filter(item => item.id !== id));
      
    } catch (error) {
      console.error('Error deleting timeline item:', error);
      alert('Failed to delete timeline item');
    } finally {
      setIsDeleting(null);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Timeline Management</h1>
        <Link 
          href="/admin/dashboard" 
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {/* Add/Edit Form */}
      <motion.div
        className="glassmorphism rounded-xl p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">
          {currentItem.id ? 'Edit Timeline Entry' : 'Add New Timeline Entry'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Date*
              </label>
              <input
                type="date"
                name="date"
                value={currentItem.date}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Short Description*
            </label>
            <input
              type="text"
              name="description"
              value={currentItem.description}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Detailed Description
            </label>
            <textarea
              name="details"
              value={currentItem.details}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Type
              </label>
              <select
                name="type"
                value={currentItem.type}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
              >
                <option value="education">Education</option>
                <option value="project">Project</option>
                <option value="work">Work</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={currentItem.icon}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                placeholder="🔵 (Use an emoji)"
              />
            </div>
          </div>
          
          <div className="flex gap-4 justify-end pt-4">
            {currentItem.id && (
              <button
                type="button"
                onClick={() => {
                  setCurrentItem({
                    title: '',
                    date: '',
                    month: '',
                    year: '',
                    description: '',
                    details: '',
                    icon: '🔵',
                    type: 'project'
                  });
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md transition-colors"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-medium rounded-md transition-colors"
            >
              {currentItem.id ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Timeline Items List */}
      <motion.div
        className="glassmorphism rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Timeline Entries</h2>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neon-cyan"></div>
            </div>
          ) : timelineItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/70 mb-4">No timeline entries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Icon</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {timelineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {item.title || 'Untitled'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'education' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : item.type === 'project' 
                              ? 'bg-green-500/20 text-green-300' 
                              : item.type === 'work' 
                                ? 'bg-amber-500/20 text-amber-300' 
                                : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        <span className="text-xl">{item.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-neon-cyan hover:text-neon-cyan/80 transition-colors mr-4"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          disabled={isDeleting === item.id}
                        >
                          {isDeleting === item.id ? (
                            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          ) : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}