"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Skill = {
  id: number;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
};

export default function SkillsManagement() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Form state for new/edit skill
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>({
    name: '',
    category: '',
    icon: '💻',
    proficiency: 3
  });
  
  // Fetch skills data
  useEffect(() => {
    fetchSkills();
  }, []);
  
  const fetchSkills = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category');
      
      if (error) {
        throw error;
      }
      
      setSkills(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(skill => skill.category) || []));
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSkill({
      ...currentSkill,
      [name]: name === 'proficiency' ? Number(value) : value
    });
  };
  
  // Handle form submission for create/edit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentSkill.name || !currentSkill.category) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (currentSkill.id) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update(currentSkill)
          .eq('id', currentSkill.id);
        
        if (error) throw error;
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert([currentSkill]);
        
        if (error) throw error;
      }
      
      // Reset form and refresh data
      setCurrentSkill({
        name: '',
        category: currentSkill.category, // Keep the same category for convenience
        icon: '💻',
        proficiency: 3
      });
      fetchSkills();
      
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };
  
  // Edit a skill
  const handleEdit = (skill: Skill) => {
    setCurrentSkill({...skill});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Delete a skill
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(id);
      
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSkills(skills.filter(skill => skill.id !== id));
      
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Skills Management</h1>
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
          {currentSkill.id ? 'Edit Skill' : 'Add New Skill'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Skill Name*
              </label>
              <input
                type="text"
                name="name"
                value={currentSkill.name}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category*
              </label>
              <div className="flex gap-2">
                <input
                  list="categories"
                  type="text"
                  name="category"
                  value={currentSkill.category}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  placeholder="e.g. Frontend, Backend, DevOps"
                  required
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={currentSkill.icon}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                placeholder="💻 (Use an emoji)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Proficiency (1-5)
              </label>
              <input
                type="range"
                name="proficiency"
                min="1"
                max="5"
                step="1"
                value={currentSkill.proficiency}
                onChange={handleInputChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-end pt-4">
            {currentSkill.id && (
              <button
                type="button"
                onClick={() => {
                  setCurrentSkill({
                    name: '',
                    category: currentSkill.category,
                    icon: '💻',
                    proficiency: 3
                  });
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
              {currentSkill.id ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Skills List */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neon-cyan"></div>
          </div>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-10 glassmorphism rounded-xl">
            <p className="text-white/70 mb-4">No skills added yet.</p>
          </div>
        ) : (
          Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="glassmorphism rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="mr-2 text-2xl">{categorySkills[0]?.icon || '💻'}</span>
                    {category}
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Icon</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Proficiency</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {categorySkills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {skill.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                            <span className="text-xl">{skill.icon}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-neon-cyan h-2 rounded-full" 
                                style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-white/50 mt-1">{skill.proficiency}/5</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEdit(skill)}
                              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors mr-4"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(skill.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              disabled={isDeleting === skill.id}
                            >
                              {isDeleting === skill.id ? (
                                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                              ) : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}